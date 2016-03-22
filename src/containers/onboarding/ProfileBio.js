/* eslint-disable react/prefer-stateless-function */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { trackEvent } from '../../actions/tracking'
import OnboardingHeader from '../../components/onboarding/OnboardingHeader'
import Avatar from '../../components/assets/Avatar'
import InfoForm from '../../components/forms/InfoForm'
import Cover from '../../components/assets/Cover'

class ProfileBio extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
  }

  onClickNext = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('next-info-picker'))
    dispatch(push('/'))
  }

  onClickSkip = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('skipped-info-picker'))
    dispatch(push('/'))
  }

  render() {
    const { profile } = this.props
    return (
      <section className="InfoPicker Panel">
        <OnboardingHeader
          title="Customize your profile."
          message="Fill out your bio."
          nextAction={ this.onClickNext }
          skipAction={ this.onClickSkip }
        />

        <div className="InfoPickerBody" >
          <Avatar
            size="large"
            sources={ profile.avatar }
          />
          <InfoForm
            tabIndexStart={ 1 }
          />

        </div>
        <Cover coverImage={ profile.coverImage } />
      </section>
    )
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

export default connect(mapStateToProps)(ProfileBio)

