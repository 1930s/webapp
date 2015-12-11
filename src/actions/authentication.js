import * as ACTION_TYPES from '../constants/action_types'
import { accessTokens, forgotPassword } from '../networking/api'
import * as ENV from '../../env'

export function getClientCredentials() {
  return {
    type: ACTION_TYPES.AUTHENTICATION.CLIENT,
    payload: {
      endpoint: accessTokens(),
      method: 'POST',
      body: {
        client_id: ENV.AUTH_CLIENT_ID.replace(/"/g, ''),
        client_secret: ENV.AUTH_CLIENT_SECRET.replace(/"/g, ''),
        grant_type: 'client_credentials',
      },
    },
  }
}

export function getUserCredentials(email, password) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.USER,
    payload: {
      endpoint: accessTokens(),
      method: 'POST',
      body: {
        client_id: ENV.AUTH_CLIENT_ID.replace(/"/g, ''),
        client_secret: ENV.AUTH_CLIENT_SECRET.replace(/"/g, ''),
        grant_type: 'password',
        email: email,
        password: password,
      },
    },
  }
}

export function sendForgotPasswordRequest(email) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.FORGOT_PASSWORD,
    payload: {
      endpoint: forgotPassword(),
      method: 'POST',
      body: {
        email: email,
      },
    },
  }
}

