import React from 'react'
import { Link } from 'react-router'
import * as MAPPING_TYPES from '../../constants/mapping_types'
import { body, setModels } from './RegionParser'
import Avatar from '../assets/Avatar'
import CommentTools from '../comments/CommentTools'
import RelationsGroup from '../relationships/RelationsGroup'

function header(comment, author) {
  if (!comment || !author) { return null }
  return (
    <header className="PostHeader" key={`PostHeader_${comment.id}`}>
      <div className="PostHeaderAuthor">
        <Link className="PostHeaderLink" to={`/${author.username}`}>
          <Avatar sources={author.avatar} />
          <span>{`@${author.username}`}</span>
        </Link>
      </div>
      <RelationsGroup user={author} />
    </header>
  )
}

function footer(comment, author, currentUser) {
  if (!author) { return null }
  return (
    <CommentTools
      author={author}
      comment={comment}
      currentUser={currentUser}
      key={`CommentTools_${comment.id}`}
    />
  )
}

export function parseComment(comment, json, currentUser, isGridLayout = true) {
  if (!comment) { return null }
  setModels(json)
  const author = json[MAPPING_TYPES.USERS][comment.authorId]
  const cells = []
  // header
  cells.push(header(comment, author))
  // body
  const content = isGridLayout ? comment.summary : comment.content
  cells.push(body(content, comment.id, isGridLayout))
  // footer
  cells.push(footer(comment, author, currentUser))
  setModels({})
  return cells
}
