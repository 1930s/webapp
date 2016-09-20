import React, { PropTypes } from 'react'

export const AppleStore = ({ to }) =>
  <a href={to} target="_blank" rel="noopener noreferrer" className="AppStore AppleStore"><span className="invisible">Apple Store</span></a>

AppleStore.propTypes = {
  to: PropTypes.string.isRequired,
}

AppleStore.defaultProps = {
  to: 'https://itunes.apple.com/app/apple-store/id953614327?pt=117139389&ct=webapp&mt=8',
}

export const GooglePlayStore = ({ to }) =>
  <a href={to} target="_blank" rel="noopener noreferrer" className="AppStore GooglePlayStore"><span className="invisible">Google Play Store</span></a>

GooglePlayStore.propTypes = {
  to: PropTypes.string.isRequired,
}

GooglePlayStore.defaultProps = {
  to: 'https://play.google.com/store/apps/details?id=co.ello.ElloApp',
}

