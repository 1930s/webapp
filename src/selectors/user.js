import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import trunc from 'trunc-html'
import { selectParamsUsername } from './params'
import { selectJson } from './store'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { findModel } from '../helpers/json_helper'

// props.user.xxx
export const selectPropsUser = (state, props) => get(props, 'user')
export const selectPropsUserId = (state, props) => get(props, 'userId') || get(props, 'user').get('id')

// state.json.users.xxx
export const selectUsers = state => state.json.get('users')

// Memoized selectors
export const selectUser = createSelector(
  [selectUsers, selectPropsUserId], (users, userId) =>
    (users ? users.get(`${userId}`, Immutable.Map()) : Immutable.Map()),
)

export const selectUserFromPropsUserId = createSelector(
  [selectJson, selectPropsUserId], (json, userId) =>
    json.getIn([MAPPING_TYPES.USERS, userId], null),
)

export const selectUserFromUsername = createSelector(
  [selectJson, selectParamsUsername], (json, username) =>
    findModel(json, { collection: MAPPING_TYPES.USERS, findObj: { username } }) || Immutable.Map(),
)

export const selectRelationshipPriority = createSelector(
  [selectUser], user => user.get('relationshipPriority'),
)

export const selectTruncatedShortBio = createSelector(
  [selectUserFromPropsUserId], user =>
    trunc(user ? user.get('formattedShortBio') || '' : '', 160, { sanitizer:
      { allowedAttributes: { img: ['align', 'alt', 'class', 'height', 'src', 'width'] } },
    }),
)

export const selectUserMetaDescription = createSelector(
  [selectUserFromUsername], (user) => {
    if (!user) { return null }
    const nickname = user.get('name', `@${user.get('username')}`)
    const backupTitle = `See ${nickname}'s work on Ello.`
    return trunc(user.get('formattedShortBio', backupTitle), 160).text
  },
)

export const selectUserMetaImage = createSelector(
  [selectUserFromUsername], user =>
    user.getIn(['coverImage', 'optimized', 'url'], null),
)

export const selectUserMetaRobots = createSelector(
  [selectUserFromUsername], (user) => {
    if (!user) { return null }
    return (user.get('badForSeo') ? 'noindex, follow' : 'index, follow')
  },
)

export const selectUserMetaTitle = createSelector(
  [selectUserFromUsername], (user) => {
    if (!user) { return null }
    const name = user.get('name')
    const username = user.get('username')
    return (name ? `${name} (@${username}) | Ello` : `@${username} | Ello`)
  },
)

