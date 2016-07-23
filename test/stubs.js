import * as MAPPING_TYPES from '../src/constants/mapping_types'

const json = {}

function clearJSON() {
  Object.keys(json).forEach((key) => {
    delete json[key]
  })
}
const commonProps = {
  id: '1',
  createdAt: new Date(),
  href: 'href',
  links: {},
}

function addToJSON(collection, model) {
  if (!json[collection]) { json[collection] = {} }
  json[collection][model.id] = model
}

export function stubAvatar(url = '') {
  return {
    original: {
      url,
    },
    large: {
      url,
      metadata: null,
    },
    regular: {
      url,
      metadata: null,
    },
    small: {
      url,
      metadata: null,
    },
  }
}

export function stubCoverImage() {
  return {
    original: {
      url: '',
    },
    optimized: {
      url: '',
      metadata: null,
    },
  }
}

function stubPromotion(username = '666') {
  return {
    avatar: { regular: `${username}-avatar.jpg` },
    caption: 'Ello promotion caption.',
    coverImage: {
      hdpi: { url: `${username}-cover.jpg` },
      xhdpi: { url: `${username}-cover.jpg` },
      optimized: { url: `${username}-cover.jpg` },
    },
    username,
  }
}

function stubAuthPromotion(username = '666') {
  const promotion = stubPromotion(username)
  delete promotion.caption
  return promotion
}

function stubUser(properties) {
  const defaultProps = {
    username: 'username',
    name: 'name',
    postsAdultContent: false,
    viewsAdultContent: true,
    hasCommentingEnabled: true,
    hasSharingEnabled: true,
    hasRepostingEnabled: true,
    hasLovesEnabled: true,
    experimentalFeatures: false,
    relationshipPriority: null,
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    lovesCount: 0,
    formattedShortBio: '<p>Formatted Short Bio</p>',
    externalLinksList: [
      {
        url: 'http://www.google.com',
        text: 'google.com',
      },
    ],
    backgroundPosition: null,
    avatar: stubAvatar(),
    coverImage: stubCoverImage(),
  }
  const model = { ...commonProps, ...defaultProps, ...properties }
  addToJSON(MAPPING_TYPES.USERS, model)
  return model
}

function stubTextRegion(properties) {
  const defaultProps = {
    kind: 'text',
    data: '<p>Text Region</p>',
  }
  return { ...defaultProps, ...properties }
}

function stubPost(properties) {
  const defaultProps = {
    authorId: 'authorId',
    body: [],
    commentsCount: 0,
    content: [stubTextRegion()],
    contentWarning: null,
    isAdultContent: false,
    loved: false,
    lovesCount: 0,
    repostCount: 0,
    reposted: false,
    summary: [stubTextRegion()],
    token: 'token',
    viewsCount: 0,
  }
  const model = { ...commonProps, ...defaultProps, ...properties }
  addToJSON(MAPPING_TYPES.POSTS, model)
  return model
}

function stubComment(properties) {
  const defaultProps = {
    authorId: 'authorId',
    body: [],
    content: [stubTextRegion()],
    postId: '1',
    summary: [stubTextRegion()],
  }
  const model = { ...commonProps, ...defaultProps, ...properties }
  addToJSON(MAPPING_TYPES.COMMENTS, model)
  return model
}

function stubPage(path, properties = {}) {
  const page = {
    ids: ['1', '2', '3', '4', '5'],
    next: {
      ids: [],
      pagination: { next: '/next/next', totalCount: 1, totalPages: 3, totalPagesRemaining: 2 },
      type: 'posts',
    },
    pagination: { next: '/next', totalCount: 1, totalPages: 3, totalPagesRemaining: 2 },
    type: 'posts',
    ...properties,
  }
  if (!json.pages) { json.pages = {} }
  json.pages[path] = page
  return page
}

export function stub(model, properties) {
  switch (model.toLowerCase()) {
    case 'comment':
      return stubComment(properties)
    case 'post':
      return stubPost(properties)
    case 'user':
      return stubUser(properties)
    default:
      return null
  }
}

export function stubJSONStore() {
  // add some users
  stub('user', { id: '1', username: 'archer' })
  stub('user', { id: '2', username: 'lana' })
  stub('user', { id: '3', username: 'cyril' })
  stub('user', { id: '4', username: 'pam' })
  stub('user', { id: 'inf', followersCount: '∞', username: 'ello' })
  // add some posts
  stub('post', { id: '1', repostsCount: 1, token: 'token1', authorId: '1' })
  stub('post', { id: '2', repostsCount: 1, token: 'token2', authorId: '2' })
  stub('post', { id: '3', repostsCount: 1, token: 'token3', authorId: '3' })
  stub('post', { id: '4', repostsCount: 1, token: 'token4', authorId: '4' })
  // TODO: Stub out some real pages with more accurate results
  stubPage('/discover')
  stubPage('/following')
  stubPage('/search/posts')
  stubPage('/search/users')
  stubPage('/mk')
  return json
}

export { clearJSON, json, stubPost, stubPromotion, stubAuthPromotion, stubTextRegion, stubUser }

