// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadEditorials } from '../actions/editorials'
import StreamContainer from '../containers/StreamContainer'
import { HeroHeader } from '../components/heros/HeroRenderables'
import { MainView } from '../components/views/MainView'
import { selectQueryPreview } from '../selectors/routing'
import { media } from '../styles/jss'
import { maxBreak2 } from '../styles/jso'

const streamStyle = media(maxBreak2, {
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
})

const mapStateToProps = state => ({
  isPreview: selectQueryPreview(state) === 'true',
})

type Props = {
  isPreview: boolean,
}

class EditorialPage extends Component {
  props: Props

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <MainView className="Editorial">
        <HeroHeader
          dpi="hdpi"
          headerText="THIS IS ELLO'S EDITORIAL HEADER"
          subHeaderText="Ello is a Global Creative Community. Made by Creatives. Built by Creatives."
        />
        <StreamContainer
          action={loadEditorials(this.props.isPreview)}
          className={`${streamStyle}`}
          hasShowMoreButton
          paginatorText="Load More"
          paginatorCentered
          shouldInfiniteScroll={false}
        />
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(EditorialPage)

