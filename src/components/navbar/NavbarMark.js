import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { ElloMark, ElloRainbowMark, ElloDonutMark, ElloNinjaSuit } from '../assets/Icons'

const getLogoMark = (mark) => {
  switch (mark) {
    case 'rainbow':
      return <ElloRainbowMark />
    case 'donut':
      return <ElloDonutMark />
    case 'none':
      return null
    case 'normal':
    default:
      return <ElloMark />
  }
}

const getLogoModifier = (mods) => {
  switch (mods) {
    case 'isNinja':
      return <ElloNinjaSuit />
    default:
      return null
  }
}


export const NavbarMark = ({ currentStream, isLoggedIn, onClick }) => {
  const list = ENV.LOGO_MARK ? ENV.LOGO_MARK.split('.') : ['normal']
  const mark = list[0]
  const mods = list.length > 1 ? list.slice(1).join(' ') : ''
  return (
    <Link
      className="NavbarMark"
      draggable
      onClick={onClick}
      to={isLoggedIn ? currentStream : '/'}
    >
      {getLogoModifier(mods)}
      {getLogoMark(mark)}
    </Link>
  )
}

NavbarMark.propTypes = {
  currentStream: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default NavbarMark

