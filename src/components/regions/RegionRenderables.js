import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Mousetrap from 'mousetrap'
import EmbedRegion from '../regions/EmbedRegion'
import ImageRegion from '../regions/ImageRegion'
import TextRegion from '../regions/TextRegion'
import { isIOS } from '../../lib/jello'
import { SHORTCUT_KEYS } from '../../constants/application_types'

export class RegionItems extends PureComponent {
  static propTypes = {
    columnWidth: PropTypes.number.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    isPostBody: PropTypes.bool,
    isComment: PropTypes.bool,
  }
  static defaultProps = {
    isPostBody: false,
    isComment: false,
  }

  componentWillMount() {
    this.state = {
      lightBox: false,
      assetIdToSet: null,
    }
  }

  // set light box
  setLightBox(lightBox, assetId) {
    if (assetId) {
      this.bindLightBoxKeys(!lightBox, assetId)

      return this.setState({
        lightBox: !lightBox,
        assetIdToSet: assetId,
      })
    }
    return null
  }

  bindLightBoxKeys(lightBox, assetId) {
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)

    if (lightBox && assetId) {
      Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.setLightBox(lightBox, assetId) })
    }
  }

  handleStaticImageRegionClick(event, assetId) {
    const { isPostBody, isPostDetail, isGridMode, isComment } = this.props
    const { lightBox } = this.state
    const buyButtonClick = event.target.classList.contains('ElloBuyButton')

    if (isPostBody && !buyButtonClick && (isPostDetail || !isGridMode)) {
      return this.setLightBox(lightBox, assetId)
    }

    if (isComment) {
      return this.setLightBox(lightBox, assetId)
    }

    return this.setState({
      lightBox: false,
      assetIdToSet: null,
    })
  }

  render() {
    const { columnWidth, commentOffset, content, contentWidth,
      detailPath, innerHeight, isComment, isGridMode, isPostDetail } = this.props
    const { lightBox, assetIdToSet } = this.state

    // sometimes the content is null/undefined for some reason
    if (!content) { return null }

    const cells = []
    content.forEach((region) => {
      const regionKey = region.get('id', JSON.stringify(region.get('data')))

      switch (region.get('kind')) {
        case 'text':
          cells.push(
            <TextRegion
              content={region.get('data')}
              detailPath={detailPath}
              isComment={isComment}
              isGridMode={isGridMode}
              key={`TextRegion_${regionKey}`}
            />,
          )
          break
        case 'image': {
          const asset = region.get('asset')
          const assetId = asset ? asset.get('id') : null
          const lightBoxOn = (lightBox && (assetIdToSet === assetId))

          cells.push(
            <ImageRegion
              key={`ImageRegion_${regionKey}`}
              asset={asset}
              buyLinkURL={region.get('linkUrl')}
              columnWidth={columnWidth}
              commentOffset={commentOffset}
              content={region.get('data')}
              contentWidth={contentWidth}
              detailPath={detailPath}
              innerHeight={innerHeight}
              isComment={isComment}
              isGridMode={isGridMode}
              isPostDetail={isPostDetail}
              shouldUseVideo={!!(asset && asset.getIn(['attachment', 'video'], Immutable.Map()).size) && !isIOS() && !isPostDetail}
              lightBox={lightBoxOn}
              handleStaticImageRegionClick={
                event => this.handleStaticImageRegionClick(event, assetId)
              }
            />,
          )
          break
        }
        case 'embed':
          cells.push(
            <EmbedRegion
              detailPath={detailPath}
              isComment={isComment}
              key={`EmbedRegion_${regionKey}`}
              region={region}
            />,
          )
          break
        default:
          break
      }
    })
    // loop through cells to grab out image/text
    return <div>{cells}</div>
  }
}

export function regionItemsForNotifications(content, detailPath) {
  const imageAssets = []
  const texts = []
  content.forEach((region) => {
    switch (region.get('kind')) {
      case 'text':
        texts.push(
          <TextRegion
            content={region.get('data')}
            detailPath={detailPath}
            isGridMode={false}
            key={`TextRegion_${region.get('data')}`}
          />,
        )
        break
      case 'image': {
        const asset = region.get('asset')
        imageAssets.push(
          <ImageRegion
            asset={asset}
            buyLinkURL={region.get('linkUrl')}
            content={region.get('data')}
            detailPath={detailPath}
            isGridMode
            isNotification
            key={`ImageRegion_${JSON.stringify(region.get('data'))}`}
            links={region.get('links')}
            shouldUseVideo={!!(asset && asset.getIn(['attachment', 'video'], Immutable.Map()).size) && !isIOS()}
          />,
        )
        break
      }
      case 'embed':
        imageAssets.push(
          <EmbedRegion
            detailPath={detailPath}
            key={`EmbedRegion_${JSON.stringify(region.get('data'))}`}
            region={region}
          />,
        )
        break
      // Hidden <hr>
      case 'rule':
        texts.push(<hr style={{ margin: '0.375rem', border: 0 }} key={`NotificationRule_${detailPath}`} />)
        break
      default:
        break
    }
  })
  return { assets: imageAssets, texts }
}

