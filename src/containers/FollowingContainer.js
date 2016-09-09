import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { loadFriends } from '../actions/stream'
import { setLastFollowingBeaconVersion } from '../actions/gui'
import { Following } from '../components/views/Following'

const BEACON_VERSION = '1'

function mapStateToProps(state) {
  return {
    isBeaconActive: state.gui.lastFollowingBeaconVersion !== BEACON_VERSION,
  }
}

class FollowingContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isBeaconActive: PropTypes.bool.isRequired,
  }

  static preRender = (store) =>
    store.dispatch(loadFriends())

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onDismissZeroStream = () => {
    const { dispatch } = this.props
    dispatch(setLastFollowingBeaconVersion({ version: BEACON_VERSION }))
  }

  render() {
    const { isBeaconActive } = this.props
    const props = {
      isBeaconActive,
      onDismissZeroStream: this.onDismissZeroStream,
      streamAction: loadFriends(),
    }
    return <Following {...props} />
  }
}

export default connect(mapStateToProps)(FollowingContainer)

