import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import { RELATIONSHIP_PRIORITY } from 'ello-brains/dist/constants/relationship_types'
import { CheckCircleIcon, CheckIconSM, PlusCircleIcon, PlusIconSM } from '../assets/Icons'

export function getNextPriority(currentPriority) {
  switch (currentPriority) {
    case RELATIONSHIP_PRIORITY.INACTIVE:
    case RELATIONSHIP_PRIORITY.NOISE:
    case RELATIONSHIP_PRIORITY.NONE:
    case null:
      return RELATIONSHIP_PRIORITY.FRIEND
    default:
      return RELATIONSHIP_PRIORITY.INACTIVE
  }
}

class FollowButton extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    priority: PropTypes.oneOf([
      RELATIONSHIP_PRIORITY.INACTIVE,
      RELATIONSHIP_PRIORITY.FRIEND,
      RELATIONSHIP_PRIORITY.NOISE,
      RELATIONSHIP_PRIORITY.SELF,
      RELATIONSHIP_PRIORITY.MUTE,
      RELATIONSHIP_PRIORITY.BLOCK,
      RELATIONSHIP_PRIORITY.NONE,
      null,
    ]),
    userId: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    priority: null,
    userId: null,
  }

  componentWillMount() {
    this.state = { nextPriority: getNextPriority(this.props.priority) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ nextPriority: getNextPriority(nextProps.priority) })
  }

  onClickUpdatePriority = () => {
    const { nextPriority } = this.state
    const { onClick, priority, userId } = this.props
    if (onClick) {
      onClick({ userId, priority: nextPriority, existing: priority })
    }
  }

  renderAsToggleButton(label, icon = null) {
    const { className, priority } = this.props
    return (
      <button
        className={classNames('FollowButton', className)}
        data-priority={priority}
        onClick={this.onClickUpdatePriority}
      >
        {icon}
        <span className="FollowButtonLabel">{label}</span>
      </button>
    )
  }

  renderAsLabelButton(label) {
    const { className, onClick, priority } = this.props
    return (
      <button
        className={classNames('FollowButton', className)}
        data-priority={priority}
        onClick={onClick}
      >
        <span>{label}</span>
      </button>
    )
  }

  renderAsSelf() {
    const { className, priority } = this.props
    return (
      <Link
        className={classNames('FollowButton', className)}
        data-priority={priority}
        to="/settings"
      >
        <span>Edit Profile</span>
      </Link>
    )
  }

  renderAsInactive() {
    const icon = this.props.className === 'isInHeader' ? <PlusCircleIcon /> : <PlusIconSM />
    return this.renderAsToggleButton('Follow', icon)
  }

  renderAsNone() {
    return this.renderAsInactive()
  }

  renderAsFriend() {
    const icon = this.props.className === 'isInHeader' ? <CheckCircleIcon /> : <CheckIconSM />
    return this.renderAsToggleButton('Following', icon)
  }

  renderAsNoise() {
    return this.renderAsFriend()
  }

  renderAsMute() {
    return this.renderAsLabelButton('Muted')
  }

  renderAsBlock() {
    return this.renderAsLabelButton('Blocked')
  }

  render() {
    const { priority } = this.props
    const fn = priority ?
      `renderAs${priority.charAt(0).toUpperCase() + priority.slice(1)}` :
      'renderAsInactive'
    return this[fn]()
  }
}

export default FollowButton

