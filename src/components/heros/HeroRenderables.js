import React from 'react'
import PropTypes from 'prop-types'
import BackgroundImage from '../assets/BackgroundImage'
import {
  HeroAppStores,
  HeroPromotionCredits,
  HeroPromotionCTA,
  HeroScrollToContentButton,
  HeroShareUserButton,
} from './HeroParts'
import { ZeroStream } from '../zeros/Zeros'
import UserContainer from '../../containers/UserContainer'
import { css, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const heroStyle = css(
  { paddingTop: 85 },
  s.bgcWhite,
  select('.isOnboardingView ~ &', { paddingTop: '0 !important' }),
  select('.isAuthenticationView ~ &', { paddingTop: '0 !important' }),
  select('.isDiscoverView ~ &', { paddingTop: '160px !important' }),
  media(s.maxBreak2,
    parent('.isLoggedOut', { paddingTop: 80 }),
    select('.isDiscoverView ~ &', { paddingTop: '120px !important' }),
    select('.isLogged .isDiscoverView ~ &', { paddingTop: '120px !important' }),
    select('.isProfileMenuActive ~ &', s.displayNone),
  ),
  media('(max-width: 23.375em)',
    select('.isDiscoverView ~ &', { paddingTop: '130px !important' }),
    select('.isLogged .isDiscoverView ~ &', { paddingTop: '100px !important' }),
  ),
  media(s.minBreak2,
    { paddingTop: 80 },
  ),
)

export const Hero = ({ children }) => (
  <div className={`Hero ${heroStyle}`}>
    {children}
  </div>
)
Hero.propTypes = {
  children: PropTypes.array.isRequired,
}

// -------------------------------------

export const HeroBroadcast = ({ broadcast, onDismiss }) =>
  <ZeroStream onDismiss={onDismiss}>{broadcast}</ZeroStream>

HeroBroadcast.propTypes = {
  broadcast: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

// -------------------------------------
const profileStyle = css(
  s.relative, s.flex, s.overflowHidden,
  media(s.minBreak2, { height: 'calc(100vh - 80px)', minHeight: 540 }),
)

export const HeroProfile = ({ dpi, sources, userId, useGif }) =>
  (<div className={profileStyle}>
    <BackgroundImage
      className="inHeroProfile hasOverlay6"
      dpi={dpi}
      sources={sources}
      useGif={useGif}
    />
    <UserContainer userId={userId} type="profile" />
    <HeroShareUserButton />
    <HeroScrollToContentButton />
  </div>)

HeroProfile.propTypes = {
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
  userId: PropTypes.string,
  useGif: PropTypes.bool.isRequired,
}
HeroProfile.defaultProps = {
  sources: null,
  userId: null,
}

// -------------------------------------

const promotionAuthStyle = css(s.fullscreen)

export const HeroPromotionAuth = (props) => {
  const { creditSources, creditUsername, dpi, sources } = props
  return (
    <div className={promotionAuthStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      {creditUsername ?
        <HeroPromotionCredits sources={creditSources} username={creditUsername} /> : null
      }
      <HeroAppStores />
    </div>
  )
}

HeroPromotionAuth.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
}
HeroPromotionAuth.defaultProps = {
  creditSources: null,
  creditUsername: null,
  sources: null,
}

// -------------------------------------
const promotionStyle = css(
  s.relative,
  s.flex,
  s.itemsCenter,
  s.fullWidth,
  { minHeight: 240 },
  s.overflowHidden,
  s.colorWhite,
  media(s.minBreak2, { minHeight: 380 }),
)

const captionStyle = css(
  s.relative, s.py20, s.mx10, s.fontSize14,
  media(s.minBreak2, s.mx20),
  media(s.minBreak4, s.pr40, s.mx40),
)

const categoryCaptionStyle = css(
  s.relative, s.py20, s.fontSize14,
  { maxWidth: 500 },
  s.mxAuto,
  media(s.maxBreak2, s.px10, { minHeight: 200 }),
  media(s.minBreak4, s.px0),
)

const categoryHeadingStyle = css(
  s.sansBlack, s.fontSize18, { lineHeight: 1.5 }, s.center,
  media(s.minBreak2, s.fontSize24),
)
const categoryHeadingTextStyle = css(s.inlineBlock, s.borderBottom)
const mobileActionStyle = css(s.relative, s.fullWidth, s.px10, s.pb10, s.fontSize14, s.selfEnd)
const categoryCopyStyle = css(s.mt40)

const promotionCategoryStyle = css({ ...promotionStyle }, media(s.maxBreak2, s.flexColumn))


export const HeroPromotionCategory = (props) => {
  const { creditLabel, creditSources, creditUsername, description, dpi, name, sources } = props
  const { ctaCaption, ctaHref, isLoggedIn, isMobile } = props
  return (
    <div className={promotionCategoryStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      <div className={categoryCaptionStyle}>
        <h1 className={categoryHeadingStyle}>
          <span className={categoryHeadingTextStyle}>{name}</span>
        </h1>
        <p className={categoryCopyStyle}>{description}</p>
        {!isMobile &&
          <HeroPromotionCTA caption={ctaCaption} isLoggedIn={isLoggedIn} to={ctaHref} />
        }
      </div>
      { isMobile &&
        <div className={`HeroPromotionMobileActions ${mobileActionStyle}`}>
          <HeroPromotionCTA caption={ctaCaption} isLoggedIn={isLoggedIn} to={ctaHref} />
          {creditUsername &&
            <HeroPromotionCredits
              label={creditLabel}
              sources={creditSources}
              username={creditUsername}
            />
          }
        </div>
      }
      {!isMobile && creditUsername &&
        <HeroPromotionCredits
          label={creditLabel}
          sources={creditSources}
          username={creditUsername}
        />
      }
    </div>
  )
}

HeroPromotionCategory.propTypes = {
  creditLabel: PropTypes.string.isRequired,
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  description: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  sources: PropTypes.object,
}
HeroPromotionCategory.defaultProps = {
  creditSources: null,
  creditUsername: null,
  ctaCaption: null,
  ctaHref: null,
  sources: null,
}

// -------------------------------------

const promotionHeadingStyle = css(s.sansBlack, s.fontSize18, media(s.minBreak2, s.fontSize48))
const promotionSubheadingStyle = css(s.fontSize14, media(s.minBreak2, s.fontSize28))

export const HeroPromotionPage = (props) => {
  const { creditSources, creditUsername, dpi, header, sources, subheader } = props
  const { ctaCaption, ctaHref, isLoggedIn } = props
  return (
    <div className={promotionStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      <div className={captionStyle}>
        <h1 className={promotionHeadingStyle}>{header}</h1>
        <h2 className={promotionSubheadingStyle}>{subheader}</h2>
        <HeroPromotionCTA caption={ctaCaption} isLoggedIn={isLoggedIn} to={ctaHref} />
      </div>
      {creditUsername &&
        <HeroPromotionCredits sources={creditSources} username={creditUsername} />
      }
    </div>
  )
}

HeroPromotionPage.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  sources: PropTypes.object,
  subheader: PropTypes.string,
}
HeroPromotionPage.defaultProps = {
  creditSources: null,
  creditUsername: null,
  ctaCaption: null,
  ctaHref: null,
  sources: null,
  subheader: null,
}

const headerStyle = css(
  s.relative,
  s.px10,
  s.fullWidth,
  s.colorWhite,
  s.mxAuto,
  { marginTop: 0 },
  { height: 400, maxWidth: 1440 },
  parent('.Editorial', s.px0),
  media(
    s.minBreak2,
    s.px20,
    { height: 600 },
    parent('.Editorial', s.px20),
    { marginTop: 0 },
  ),
  media(
    s.minBreak4,
    s.px40,
    parent('.Editorial', s.px40, s.mb20),
    { marginTop: 0 },
  ),
)

const imageContainerStyle = css(
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.relative,
  { height: 400 },
  media(s.minBreak2, { height: 600 }),
)

const HeroHeaderCaptionStyle = css(
  s.absolute, s.pr20, { left: 20, top: 80 },
  media(s.minBreak2, s.pr40, { left: 60, top: 40 }),
  media(s.minBreak3, { left: 80, top: 110 }),
  media(s.minBreak4, { left: 100, top: 180 }),
)

const HeroHeaderHeadingStyle = css(
  s.sansBlack, s.fontSize48, { lineHeight: 48 },
  media(s.minBreak2, { fontSize: 90, lineHeight: 90 }),
)

const HeroHeaderSubHeadingStyle = css(
  s.sansRegular, s.fontSize24, { lineHeight: 24 },
  media(s.minBreak2, s.fontSize24),
)

export const HeroHeader = ({
  dpi,
  headerText,
  subHeaderText,
}) => (
  <div className={`HeroHeader ${headerStyle}`}>
    <div className={imageContainerStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} />
    </div>
    <div className={HeroHeaderCaptionStyle}>
      <h1 className={HeroHeaderHeadingStyle}>{headerText}</h1>
      <p className={HeroHeaderSubHeadingStyle}>{subHeaderText}</p>
    </div>
    <HeroPromotionCredits
      label="Posted by"
      sources=""
      username="scottbrag"
    />
  </div>
)
HeroHeader.propTypes = {
  dpi: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired,
  subHeaderText: PropTypes.string.isRequired,
}

