import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { replace } from 'react-router-redux'
import { random, debounce, set } from 'lodash'
import { isAndroid } from '../../vendor/jello'
import { ONBOARDING_VERSION } from '../../constants/application_types'
import { FORM_CONTROL_STATUS as STATUS } from '../../constants/status_types'
import { AUTHENTICATION_PROMOTIONS } from '../../constants/promotions/authentication'
import { loadProfile, saveProfile } from '../../actions/profile'
import { signIn } from '../../actions/authentication'
import { trackEvent } from '../../actions/tracking'
import Cover from '../../components/assets/Cover'
import Credits from '../../components/assets/Credits'
import TextControl from '../../components/forms/TextControl'
import PasswordControl from '../../components/forms/PasswordControl'
import FormButton from '../../components/forms/FormButton'
import {
  isFormValid,
  getUserStateFromClient,
  getPasswordState,
} from '../../components/forms/Validators'
import AppleStoreLink from '../../components/support/AppleStoreLink'
import { MainView } from '../../components/views/MainView'

class SignIn extends Component {

  static propTypes = {
    coverDPI: PropTypes.string,
    coverOffset: PropTypes.number,
    currentStream: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    webOnboardingVersionSeen: PropTypes.string,
  }

  componentWillMount() {
    const userlist = AUTHENTICATION_PROMOTIONS
    const index = random(0, userlist.length - 1)
    this.state = {
      showUserError: false,
      showPasswordError: false,
      userState: { status: STATUS.INDETERMINATE, message: '' },
      featuredUser: userlist[index],
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.userValue = ''
    this.passwordValue = ''

    this.delayedShowUserError = debounce(this.delayedShowUserError, 1000)
    this.delayedShowPasswordError = debounce(this.delayedShowPasswordError, 1000)
  }

  componentWillReceiveProps(nextProps) {
    if (typeof this.props.webOnboardingVersionSeen === 'undefined' &&
        this.props.webOnboardingVersionSeen !== nextProps.webOnboardingVersionSeen) {
      const { currentStream, dispatch } = this.props
      if (nextProps.webOnboardingVersionSeen &&
          nextProps.webOnboardingVersionSeen !== ONBOARDING_VERSION) {
        dispatch(replace({ pathname: '/onboarding' }))
      } else if (!nextProps.webOnboardingVersionSeen) {
        dispatch(replace({ pathname: currentStream }))
        dispatch(saveProfile({ web_onboarding_version: ONBOARDING_VERSION }))
      } else {
        dispatch(replace({ pathname: currentStream }))
      }
    }
  }

  componentWillUnmount() {
    // Cancel lingering debounced methods
    this.delayedShowUserError.cancel()
    this.delayedShowPasswordError.cancel()
  }

  onBlurControl = () => {
    if (isAndroid()) {
      document.body.classList.remove('hideCredits')
    }
  }

  onChangeUserControl = ({ usernameOrEmail }) => {
    this.setState({ showUserError: false })
    this.delayedShowUserError()
    this.userValue = usernameOrEmail
    const { userState } = this.state
    const currentStatus = userState.status
    const newState = getUserStateFromClient({ value: usernameOrEmail, currentStatus })
    console.log(newState)
    if (newState.status !== currentStatus) {
      this.setState({ userState: newState })
    }
  }

  onChangePasswordControl = ({ password }) => {
    this.setState({ showPasswordError: false })
    this.delayedShowPasswordError()
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
  }

  onFocusControl = () => {
    if (isAndroid()) {
      document.body.classList.add('hideCredits')
    }
  }

  onSubmit = (e) => {
    e.preventDefault()

    const { dispatch } = this.props
    const action = signIn(this.userValue, this.passwordValue)

    set(action, 'meta.successAction', () => dispatch(loadProfile()))
    set(action, 'meta.failureAction', () => this.setState({
      failureMessage: 'Your username/email or password are incorrect',
    }))

    dispatch(action)
  }

  onClickTrackCredits = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('authentication-credits-clicked'))
  }

  delayedShowUserError = () => {
    this.setState({ showUserError: true })
  }

  delayedShowPasswordError = () => {
    this.setState({ showPasswordError: true })
  }

  renderStatus(state) {
    return () => {
      if (state.status === STATUS.FAILURE) {
        return <p className="HoppyStatusMessage hasContent">{state.message}</p>
      }
      return <p className="HoppyStatusMessage"><span /></p>
    }
  }

  render() {
    const { coverDPI, coverOffset } = this.props
    const {
      userState, showUserError,
      passwordState, showPasswordError,
      failureMessage, featuredUser,
    } = this.state
    const isValid = isFormValid([userState, passwordState])
    return (
      <MainView className="Authentication">
        <div className="AuthenticationFormDialog">
          <h1>
            Welcome back.
          </h1>
          <form
            className="AuthenticationForm"
            id="NewSessionForm"
            noValidate="novalidate"
            onSubmit={this.onSubmit}
            role="form"
          >
            <TextControl
              classList="asBoxControl"
              id="usernameOrEmail"
              label="Username or Email"
              name="user[usernameOrEmail]"
              onBlur={this.onBlurControl}
              onChange={this.onChangeUserControl}
              onFocus={this.onFocusControl}
              placeholder="Enter your username or email"
              renderStatus={showUserError ? this.renderStatus(userState) : null}
              tabIndex="1"
            />
            <PasswordControl
              classList="asBoxControl"
              label="Password"
              onBlur={this.onBlurControl}
              onChange={this.onChangePasswordControl}
              onFocus={this.onFocusControl}
              renderStatus={showPasswordError ? this.renderStatus(passwordState) : null}
              tabIndex="2"
            />
            {failureMessage ? <p>{failureMessage}</p> : null}
            <FormButton disabled={!isValid} tabIndex="3">Log in</FormButton>
          </form>
          <Link className="ForgotPasswordLink" to="/forgot-password">Forgot password?</Link>
        </div>
        <AppleStoreLink />
        <Credits onClick={this.onClickTrackCredits} user={featuredUser} />
        <Cover
          coverDPI={coverDPI}
          coverImage={featuredUser.coverImage}
          coverOffset={coverOffset}
          modifiers="asFullScreen withOverlay"
        />
      </MainView>
    )
  }
}

const mapStateToProps = state => ({
  currentStream: state.gui.currentStream,
  coverDPI: state.gui.coverDPI,
  coverOffset: state.gui.coverOffset,
  webOnboardingVersionSeen: state.profile.webOnboardingVersion,
})

export default connect(mapStateToProps)(SignIn)

