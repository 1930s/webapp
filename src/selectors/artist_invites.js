import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { camelize } from 'humps'
import get from 'lodash/get'
import { ARTIST_INVITES } from 'ello-brains/constants/mapping_types'

const selectPropsArtistInviteId = (state, props) =>
  get(props, 'artistInviteId') || get(props, 'artistInvite', Immutable.Map()).get('id')

const selectArtistInvites = state =>
  state.json.get(camelize(ARTIST_INVITES), Immutable.Map())

const selectParamsSlug = (state, props) => get(props, 'params.slug')

// Memoized selectors
// Requires `artistInviteId` or `artistInvite` to be found in props
export const selectArtistInvite = createSelector(
  [selectPropsArtistInviteId, selectParamsSlug, selectArtistInvites], (id, slug, artistInvites) => {
    if (id) {
      return artistInvites.get(id, Immutable.Map())
    } else if (slug) {
      return (artistInvites.find(ai => ai.get('slug') === slug)) || Immutable.Map()
    }
    return Immutable.Map()
  },
)

export const selectClosedAt = createSelector([selectArtistInvite], ai => ai.get('closedAt'))
export const selectDescription = createSelector([selectArtistInvite], ai => ai.get('description'))
export const selectGuide = createSelector([selectArtistInvite], ai => ai.get('guide', Immutable.List()))
export const selectHeaderImage = createSelector([selectArtistInvite], ai => ai.get('headerImage', Immutable.Map()))
export const selectInviteType = createSelector([selectArtistInvite], ai => ai.get('inviteType'))
export const selectLinks = createSelector([selectArtistInvite], ai => ai.get('links', Immutable.Map()))
export const selectLogoImage = createSelector([selectArtistInvite], ai => ai.get('logoImage', Immutable.Map()))
export const selectOpenedAt = createSelector([selectArtistInvite], ai => ai.get('openedAt'))
export const selectShortDescription = createSelector([selectArtistInvite], ai => ai.get('shortDescription'))
export const selectSlug = createSelector([selectArtistInvite], ai => ai.get('slug'))
export const selectStatus = createSelector([selectArtistInvite], ai => ai.get('status'))
export const selectSubmissionBodyBlock = createSelector([selectArtistInvite], ai => ai.get('submissionBodyBlock'))
export const selectTitle = createSelector([selectArtistInvite], ai => ai.get('title'))

