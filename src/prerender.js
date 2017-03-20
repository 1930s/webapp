/* eslint-disable no-console,max-len */
import 'babel-polyfill'
import 'isomorphic-fetch'
import Immutable from 'immutable'
import path from 'path'
import fs from 'fs'
import { renderToString } from 'react-dom/server'
import { renderStaticOptimized } from 'glamor-server'
import React from 'react'
import Helmet from 'react-helmet'
import Honeybadger from 'honeybadger'
import { createMemoryHistory, match, RouterContext } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { createServerStore } from './store'
import createRoutes from './routes'
import { serverRoot } from './sagas'

const indexStr = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8')

// Return promises for initial loads
function preRenderComponents(renderProps, store, sagaTask, startTime, requestId) {
  const promises = renderProps.components.map(component => ((component && component.preRender) ? component.preRender(store, renderProps) : null)).filter(component => !!component)
  return Promise.all(promises).then(() => {
    console.log(`[${requestId}][prerender] component promises resolved in ${new Date() - startTime}ms, closing store`)
    store.close()
    return sagaTask.done
  })
}

const createSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS
  return (state) => {
    const routingState = state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

function prerender(context, done) {
  const { accessToken,
          expiresAt,
          originalUrl,
          url,
          timingHeader,
          requestId } = context
  const startTime = new Date()
  Honeybadger.setContext(context)

  console.log(`[${requestId}][prerender] Rendering ${url}`)

  const memoryHistory = createMemoryHistory(originalUrl)
  const store = createServerStore(memoryHistory, {
    authentication: Immutable.Map({
      accessToken,
      expirationDate: new Date(expiresAt),
      isLoggedIn: false,
    }),
  })
  const isServer = true
  const routes = createRoutes(store, isServer)
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: createSelectLocationState(),
  })
  const sagaTask = store.runSaga(serverRoot)

  match({ history, routes, location: url }, (error, redirectLocation, renderProps) => {
    // populate the router store object for initial render
    if (error) {
      console.log(`[${requestId}][prerender] MATCH ERROR`, error)
      // TODO: Should we abort here?
    } else if (redirectLocation) {
      console.log(`[${requestId}][prerender] Rendering redirect to ${redirectLocation.pathname}`)
      done(false, { type: 'redirect', location: redirectLocation.pathname })
      return
    } else if (!renderProps) {
      console.log(`[${requestId}][prerender] NO RENDER PROPS`)
      done(true)
      return
    }

    const InitialComponent = (
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    )

    preRenderComponents(renderProps, store, sagaTask, startTime, requestId).then(() => {
      console.log(`[${requestId}][prerender] Saga task complete after ${new Date() - startTime}ms, finalizing markup`)
      const componentHTML = renderToString(InitialComponent)
      const head = Helmet.rewind()
      const { css, ids } = renderStaticOptimized(() => componentHTML)
      const state = store.getState()
      if (state.stream.get('should404') === true) {
        console.log(`[${requestId}][prerender] Rendering 404 (total ${new Date() - startTime}ms)`)
        done(false, { type: '404' })
      } else {
        Object.keys(state).forEach((key) => {
          state[key] = state[key].toJS()
        })
        const initialStateTag = `<script id="initial-state">window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`
        const initialGlamTag = `<script id="glam-state">window.__GLAM__ = ${JSON.stringify(ids)}</script>`
        // Add helmet's stuff after the last statically rendered meta tag
        const html = indexStr.replace(
          'rel="copyright">',
          `rel="copyright">${head.title.toString()} ${head.meta.toString()} ${head.link.toString()} ${timingHeader} <style>${css}</style>`,
        ).replace('<div id="root"></div>', `<div id="root">${componentHTML}</div>${initialStateTag} ${initialGlamTag}`)
        console.log(`[${requestId}][prerender] Rendering 200 (total ${new Date() - startTime}ms)`)
        done(false, { type: 'render', body: html })
      }
    }).catch((err) => {
      console.log(`[${requestId}][prerender] Caught error (total ${new Date() - startTime}ms)`, err)
      Honeybadger.notify(err);
      done(false, { type: 'error' })
    })
    renderToString(InitialComponent)
  })
}

export default prerender
