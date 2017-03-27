import React, { PropTypes } from 'react'
import { css, media } from '../../styles/jss'
import { block, fontSize14, minBreak2, px0, px10 } from '../../styles/jso'

const spinGif = '/static/images/support/ello-spin.gif'

const imageStyle = css(block, { margin: '0 auto 75px' })
const errorStyle = css(
  { maxWidth: 780 },
  px10,
  { marginBottom: 30 },
  fontSize14,
  media(minBreak2, px0),
)

export const ErrorStateImage = () =>
  <img className={imageStyle} src={spinGif} alt="Ello" width="130" height="130" />

export const ErrorState = ({ children = 'Something went wrong.' }) =>
  <div className={errorStyle}>
    {children}
  </div>

ErrorState.propTypes = {
  children: PropTypes.node,
}

export const ErrorState4xx = ({ withImage = true }) =>
  <ErrorState>
    {withImage ? <ErrorStateImage /> : null}
    <p>This doesn&rsquo;t happen often, but it looks like something is broken. Hitting the back button and trying again might be your best bet. If that doesn&rsquo;t work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank" rel="noopener noreferrer">Store</a> or the <a href={`${ENV.AUTH_DOMAIN}/wtf/post/communitydirectory`}>Community Directory</a>.</p>
  </ErrorState>

ErrorState4xx.propTypes = {
  withImage: PropTypes.bool,
}

export const ErrorState5xx = ({ withImage = true }) =>
  <ErrorState>
    {withImage ? <ErrorStateImage /> : null}
    <p>It looks like something is broken and we couldn&rsquo;t complete your request. Please try again in a few minutes. If that doesn&rsquo;t work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank" rel="noopener noreferrer">Store</a> or the <a href={`${ENV.AUTH_DOMAIN}/wtf/post/communitydirectory`}>Community Directory</a>.</p>
  </ErrorState>

ErrorState5xx.propTypes = {
  withImage: PropTypes.bool,
}

