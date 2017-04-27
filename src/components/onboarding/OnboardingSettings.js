import React, { PropTypes } from 'react'
import classNames from 'classnames'
import OnboardingNavbar from './OnboardingNavbar'
import { MainView } from '../views/MainView'
import { ElloOutlineMark } from '../assets/Icons'
import InfoForm from '../forms/InfoForm'
import Uploader from '../uploaders/Uploader'
import Avatar from '../assets/Avatar'
import BackgroundImage from '../assets/BackgroundImage'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

const formStyle = css(
  { padding: '20px 10px 80px' },
  media(s.minBreak2, s.pt40, { minHeight: 410, marginLeft: 285 }),
)

const OnboardingSettings = (props, context) => {
  const { avatar, isAvatarBlank, saveAvatar } = context
  const { coverImage, dpi, isCoverImageBlank, isMobile, saveCover } = context
  const { isNextDisabled } = props
  return (
    <MainView className="Onboarding OnboardingSettings">
      <h1 className="OnboardingHeading">
        <span>Grow your creative influence. </span>
        <span>Completed profiles get way more views.</span>
      </h1>
      <div className="OnboardingCoverPicker">
        <Uploader
          className={classNames('isCoverUploader', { isCoverImageBlank })}
          kind="coverImage"
          line1="2560 x 1440"
          line2="Animated Gifs work too"
          line3={isMobile ? null : 'Drag & Drop'}
          saveAction={saveCover}
          title="Upload Header"
        />
        <BackgroundImage
          className="hasOverlay6 inOnboarding"
          sources={coverImage}
          dpi={dpi}
          useGif
        />
      </div>
      <div className="OnboardingAvatarPicker" >
        <Uploader
          className={classNames('isAvatarUploader isXLUploader', { isAvatarBlank })}
          kind="avatar"
          title="Upload Avatar"
          line1="360 x 360"
          line2="Animated Gifs work too"
          line3={isMobile ? null : 'Drag & Drop'}
          saveAction={saveAvatar}
        />
        {isAvatarBlank ? <ElloOutlineMark /> : null}
        <Avatar
          className="isXLarge"
          size="large"
          sources={avatar}
          useGif
        />
      </div>
      <InfoForm
        className={`OnboardingInfoForm ${formStyle}`}
        isOnboardingControl
        controlClassModifiers="isOnboardingControl"
        tabIndexStart={1}
      />
      <OnboardingNavbar
        isNextDisabled={isNextDisabled}
      />
    </MainView>
  )
}

OnboardingSettings.propTypes = {
  isNextDisabled: PropTypes.bool,
}
OnboardingSettings.defaultProps = {
  isNextDisabled: false,
}
OnboardingSettings.contextTypes = {
  avatar: PropTypes.object,
  dpi: PropTypes.string.isRequired,
  coverImage: PropTypes.object,
  isAvatarBlank: PropTypes.bool,
  isMobile: PropTypes.bool.isRequired,
  isCoverImageBlank: PropTypes.bool,
  saveAvatar: PropTypes.func.isRequired,
  saveCover: PropTypes.func.isRequired,
}

export default OnboardingSettings

