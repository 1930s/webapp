/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router'
import { before, css, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import BackgroundImage from '../assets/BackgroundImage'
import ImageAsset from '../assets/ImageAsset'
import { ArrowIcon } from '../assets/Icons'
import { RoundedRect } from '../buttons/Buttons'
import ArtistInviteSubmissionsContainer from '../../containers/ArtistInviteSubmissionsContainer'

const gridContainerStyle = css(
  s.alignTop,
  s.bgcF2,
  s.fontSize14,
  s.fullWidth,
  s.mb10,
  s.sansRegular,
  s.transitionBgColor,
  media(
    s.minBreak2,
    s.mr20,
    s.mb20,
    { width: 'calc(50% - 10px)' },
    select(':nth-child(2n)', s.mr0),
  ),
  media(
    s.minBreak4,
    s.mr40,
    s.mb40,
    { width: 'calc(50% - 20px)' },
  ),
  hover(s.bgcE5),
)

const imageContainerStyle = css(
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.relative,
  { height: 235 },
  media(s.minBreak2, { height: 220 }, parent('.ArtistInvitesDetail', s.mb40, { height: 555 }, media(s.minBreak3, s.mb60))),
  parent('a:hover', select('> .BackgroundImage::before', { backgroundColor: 'rgba(0, 0, 0, 0.5)' })),
  parent('.ArtistInvitesDetail', s.mb20),
)

const logoImageStyle = css(
  { maxHeight: 155 },
  s.px20,
  s.zIndex1,
  media(s.minBreak2, { maxHeight: 140 }, parent('.ArtistInvitesDetail', { maxHeight: 190 })),
)

const contentContainerStyle = css(
  { height: 250 },
  s.p10,
  s.relative,
  media(s.minBreak3, s.py30, s.px20),
)

const titleStyle = css(
  s.sansBlack,
  s.fontSize24,
  s.truncate,
  media(s.minBreak3, s.mb20),
  parent(
    '.ArtistInvitesDetail',
    media(s.minBreak2, { marginTop: -5 }),
    media(s.minBreak3, s.mb0, s.fontSize38, { marginTop: -10 }),
  ),
)

const inviteTypeStyle = css(
  s.colorA,
  s.my0,
  s.truncate,
  parent(
    '.ArtistInvitesDetail',
    s.fontSize24,
    s.sansLight,
    media(s.minBreak3, s.fontSize38),
  ),
)

const textStatusStyle = css(
  s.fontSize24,
  s.mb0,
  s.mt20,
  s.truncate,
  modifier('.closed', { color: '#fe0404' }),
  modifier('.open', { color: '#00d100' }),
  modifier('.preview', { color: '#0409fe' }),
  modifier('.selecting', { color: '#ffb100' }),
  modifier('.upcoming', { color: '#c000ff' }),
  parent('.ArtistInvitesDetail', s.sansLight, media(s.minBreak3, s.fontSize38)),
)

const bulletStatusStyle = css(
  { ...textStatusStyle },
  s.fontSize14,
  s.mt10,
  before(
    {
      borderRadius: 5,
      content: '""',
      height: 10,
      width: 10,
    },
    s.inlineBlock,
    s.mr20,
  ),
  modifier('.closed', before({ backgroundColor: '#fe0404' })),
  modifier('.open', before(s.bgcGreen)),
  modifier('.preview', before({ backgroundColor: '#0409fe' })),
  modifier('.selecting', before({ backgroundColor: '#ffb100' })),
  modifier('.upcoming', before({ backgroundColor: '#c000ff' })),
  media(s.minBreak3, s.absolute, s.mt0, { left: 'calc(100% - 230px)', top: 85 }),
)

const dateRangeStyle = css(
  s.colorA,
  s.my0,
  s.truncate,
  media(s.minBreak3, s.absolute, { left: 'calc(100% - 200px)', top: 105 }),
  parent(
    '.ArtistInvitesDetail',
    s.fontSize24,
    s.sansLight,
    { left: 'auto', position: 'inherit', top: 'auto' },
    media(s.minBreak3, s.fontSize38),
  ),

)

const shortDescriptionStyle = css(
  media(s.minBreak3, s.mt40),
)

const getStatusText = (status) => {
  switch (status) {
    case 'closed':
      return 'Invite Closed'
    case 'open':
      return 'Open For Submissions'
    case 'preview':
      return 'Preview'
    case 'selecting':
      return 'Selections In Progress'
    case 'upcoming':
      return 'Upcoming'
    default:
      return null
  }
}

const renderTextStatus = status => (
  <p className={`${textStatusStyle} ${status}`}>
    {getStatusText(status)}
  </p>
)

const renderBulletStatus = status => (
  <p className={`${bulletStatusStyle} ${status}`}>
    {getStatusText(status)}
  </p>
)

export const ArtistInviteGrid = ({
  closedAt,
  dpi,
  headerImage,
  inviteType,
  logoImage,
  openedAt,
  shortDescription,
  slug,
  status,
  title,
}, { onClickArtistInviteDetail }) => (
  <Link to={`/artist-invites/${slug}`} onClick={onClickArtistInviteDetail} className={gridContainerStyle}>
    <article>
      <div className={imageContainerStyle}>
        <BackgroundImage className="hasOverlay3" dpi={dpi} sources={headerImage} />
        <ImageAsset className={logoImageStyle} src={logoImage.getIn(['optimized', 'url'])} />
      </div>
      <div className={contentContainerStyle}>
        <h2 className={titleStyle}>{title}</h2>
        <p className={inviteTypeStyle}>{inviteType}</p>
        {renderBulletStatus(status)}
        <p className={dateRangeStyle}>{`${moment(openedAt).format('MMM D')} — ${moment(closedAt).format('MMM D, YYYY')}`}</p>
        <div className={shortDescriptionStyle}>
          <p dangerouslySetInnerHTML={{ __html: shortDescription }} />
        </div>
      </div>
    </article>
  </Link>
)
ArtistInviteGrid.propTypes = {
  closedAt: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  headerImage: PropTypes.object.isRequired,
  inviteType: PropTypes.string.isRequired,
  logoImage: PropTypes.object.isRequired,
  openedAt: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
ArtistInviteGrid.contextTypes = {
  onClickArtistInviteDetail: PropTypes.func.isRequired,
}

const detailContainerStyle = css(
  s.maxSiteWidth,
  s.px10,
  s.mxAuto,
  media(s.minBreak2, s.px20),
  media(s.minBreak4, s.px0),
  select('& .ArrowIcon', { transform: 'rotate(90deg)' }),
  select(
    '& .RoundedRect',
    s.my20,
    media(
      s.minBreak2,
      modifier('.ScrollButton', s.my40),
      modifier('.SubmitButton', s.mt0, s.mb30),
    ),
    media(
      s.minBreak3,
      modifier('.ScrollButton', s.my60),
      modifier('.SubmitButton', { marginBottom: 50 }),
    ),
  ),
)

const contentColumnStyle = css(
  s.alignTop,
  s.fit,
  s.inlineBlock,
  media(
    s.minBreak2,
    s.mr20,
    s.mb20,
    { width: 'calc(50% - 10px)' },
    select(':nth-child(2n)', s.mr0),
  ),
  media(
    s.minBreak3,
    s.mr40,
    s.mb40,
    { width: 'calc(50% - 20px)' },
  ),
)

const guideStyle = css(
  s.colorA,
  s.fontSize14,
  select('& .GuideHeader', s.fontSize24, s.mb20, s.sansBlack, s.truncate, media(s.minBreak3, s.fontSize38)),
  select('& .GuideContent', media(s.minBreak2, s.mb30), media(s.minBreak3, s.mb60)),
)

export const ArtistInviteDetail = ({
  closedAt,
  description,
  dpi,
  guide,
  hasSubmissions,
  headerImage,
  inviteType,
  isLoggedIn,
  links,
  logoImage,
  openedAt,
  slug,
  status,
  submissionBodyBlock,
  title,
}, {
  onClickScrollToContent,
  onClickSubmit,
}) => (
  <div>
    <article className={detailContainerStyle}>
      <div className={imageContainerStyle}>
        <BackgroundImage className="hasOverlay3" dpi={dpi} sources={headerImage} />
        <ImageAsset className={logoImageStyle} src={logoImage.getIn(['optimized', 'url'])} />
      </div>
      <div>
        <div className={contentColumnStyle}>
          <h1 className={titleStyle}>{title}</h1>
          <p className={inviteTypeStyle}>{inviteType}</p>
          {renderTextStatus(status)}
          <p className={dateRangeStyle}>{`${moment(openedAt).format('MMM D')} — ${moment(closedAt).format('MMM D, YYYY')}`}</p>
          {links.size !== 0 && hasSubmissions &&
            <RoundedRect className="ScrollButton GreenBorder" onClick={onClickScrollToContent}>
              <ArrowIcon />
              See Submissions
            </RoundedRect>
          }
          <div>
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
        <div className={contentColumnStyle}>
          {status === 'open' && isLoggedIn &&
            <RoundedRect className="SubmitButton Green isXL" onClick={onClickSubmit}>
              SUBMIT
            </RoundedRect>
          }
          {guide.map(g => (
            <div className={guideStyle} key={`guide_${g.get('title')}`}>
              <h3 className="GuideHeader">{g.get('title')}</h3>
              <div className="GuideContent" dangerouslySetInnerHTML={{ __html: g.get('renderedBody') }} />
            </div>
          ))}
        </div>
      </div>
    </article>
    <ArtistInviteSubmissionsContainer links={links} slug={slug} status={status} />
  </div>
)
ArtistInviteDetail.propTypes = {
  closedAt: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  guide: PropTypes.object.isRequired,
  hasSubmissions: PropTypes.bool.isRequired,
  headerImage: PropTypes.object.isRequired,
  inviteType: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  links: PropTypes.object.isRequired,
  logoImage: PropTypes.object.isRequired,
  openedAt: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  submissionBodyBlock: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
ArtistInviteDetail.contextTypes = {
  onClickScrollToContent: PropTypes.func.isRequired,
  onClickSubmit: PropTypes.func.isRequired,
}

