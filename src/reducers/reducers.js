import * as TYPE from '../constants/action_types'

export function stream(state = {}, action) {
  if(action.type.indexOf('LOAD_STREAM') == -1) {
    return state
  }
  return {
    ...state,
    error: action.error,
    meta: action.meta,
    payload: action.payload,
    type: action.type
  }
}

