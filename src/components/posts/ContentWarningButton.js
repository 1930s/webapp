import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class ContentWarningButton extends Component {

  static propTypes = {
    onClick: PropTypes.func,
    post: PropTypes.shape({
      contentWarning: PropTypes.string,
    }).isRequired,
  };

  componentWillMount() {
    this.state = {
      isOpen: false,
    }
  }

  handleClick = (e) => {
    const { onClick } = this.props
    const { isOpen } = this.state
    const newIsOpen = !isOpen
    this.setState({ isOpen: newIsOpen })
    if (onClick) {
      onClick({ isOpen: newIsOpen }, e)
    }
  };

  render() {
    const { post } = this.props
    const { isOpen } = this.state
    const classes = classNames('ContentWarningButton', { isOpen })
    return (
      <button className={ classes } onClick={ this.handleClick }>
        <span className="ContentWarningButtonMessage">
          { post.contentWarning }
        </span>
        <span className="ContentWarningButtonStateLabel">
          { isOpen ? 'Hide' : 'View' }
        </span>
      </button>
    )
  }
}
