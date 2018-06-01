import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

const relationshipStyle = css(
  modifier('.inUserProfile', s.inlineBlock, s.alignTop),
  modifier('.inUserProfileCard', s.inlineBlock, s.alignTop),
)

const Relationship = props => (
  <div
    className={classNames(`RelationshipContainer ${relationshipStyle}`, props.className)}
    data-priority={props.relationshipPriority}
  >
    {props.children}
  </div>
)

Relationship.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  relationshipPriority: PropTypes.string,
}
Relationship.defaultProps = {
  relationshipPriority: null,
}

export default Relationship
