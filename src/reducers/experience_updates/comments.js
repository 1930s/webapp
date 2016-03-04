/* eslint-disable no-param-reassign */
import * as ACTION_TYPES from '../../constants/action_types'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import * as jsonReducer from '../../reducers/json'

const methods = {}

function _updateCommentsCount(newState, postId, delta) {
  const commentCount = newState[MAPPING_TYPES.POSTS][postId].commentsCount
  jsonReducer.methods.mergeModel(
    newState,
    MAPPING_TYPES.POSTS,
    {
      id: postId,
      commentsCount: Number(commentCount) + delta,
    }
  )
  return newState
}
methods.updateCommentsCount = (newState, postId, delta) =>
  _updateCommentsCount(newState, postId, delta)

function _addOrUpdateComment(newState, action) {
  const { postId } = action.payload
  let post
  let response
  switch (action.type) {
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
    case ACTION_TYPES.COMMENT.UPDATE_SUCCESS:
      response = action.payload.response
      if (!newState[MAPPING_TYPES.COMMENTS]) {
        newState[MAPPING_TYPES.COMMENTS] = {}
      }
      newState[MAPPING_TYPES.COMMENTS][response.id] = response
      post = newState[MAPPING_TYPES.POSTS][postId]
      if (action.type === ACTION_TYPES.COMMENT.UPDATE_SUCCESS) { return newState }
      // add the comment to the linked array
      if (post.links && post.links.comments) {
        post.links.comments.ids.unshift(`${action.payload.response.id}`)
      }
      return methods.updateCommentsCount(newState, postId, 1)
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
      return methods.updateCommentsCount(newState, postId, -1)
    default:
      return newState
  }
}
methods.addOrUpdateComment = (newState, action) =>
  _addOrUpdateComment(newState, action)

function _toggleEditing(state, newState, action) {
  const { model, isEditing } = action.payload
  newState[MAPPING_TYPES.COMMENTS][model.id].isEditing = isEditing
  return newState
}
methods.toggleEditing = (state, newState, action) =>
  _toggleEditing(state, newState, action)

export default methods

