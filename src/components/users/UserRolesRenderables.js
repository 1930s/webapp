import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { DismissButtonLG } from './../buttons/Buttons'
import { FilterSelectorControl } from './../forms/FilterSelectorControl'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const userDetailRolesModalStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .mask',
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },

    media(s.minBreak2,
      s.flex,
      s.itemsCenter,
      s.justifyCenter,
    ),
  ),
)
const userDetailRolesStyle = css(
  s.relative,
  s.block,
  s.p20,
  s.mt40,
  s.colorBlack,
  s.fullWidth,
  s.leftAlign,
  s.bgcWhite,
  {
    maxWidth: 780,
    borderRadius: 5,
  },

  media(s.minBreak2,
    s.m0,
    s.pt40,
    { width: '80%' },
  ),
  media(s.minBreak4,
    { width: '60%' },
  ),

  select('& .CloseModal',
    s.colorA,
    { top: 14, right: 20 },
    hover(s.colorBlack),

    media(s.maxBreak2,
      { top: 7, right: 7 },
    ),
  ),

  select('& h1',
    s.sansBlack,
    s.fontSize24,
  ),
)

const roleName = {
  FEATURED: 'Featured User',
  CURATOR: 'Curator',
  MODERATOR: 'Moderator',
}

export default function UserDetailRoles({
  close,
  handleMaskClick,
  isOpen,
  categoryUsers,
  administeredCategories,
  searchCategories,
  userId,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={userDetailRolesModalStyle}>
      <div className="mask" role="presentation" onClick={handleMaskClick}>
        <div className={`${userDetailRolesStyle} content`}>
          <DismissButtonLG
            onClick={close}
          />
          <h1>Role Administrator</h1>
          <CategoryUserForm
            administeredCategories={administeredCategories}
            userId={userId}
            searchCategories={searchCategories}
          />

          {categoryUsers.map(cu => (
            <div key={cu.get('id')}>
              {roleName[cu.get('role')]} in&nbsp;
              <Link to={`/discover/${cu.get('categorySlug')}`}>{cu.get('categoryName')}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
UserDetailRoles.propTypes = {
  close: PropTypes.func.isRequired,
  handleMaskClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  categoryUsers: PropTypes.object.isRequired,
  administeredCategories: PropTypes.object.isRequired,
  searchCategories: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
}

class CategoryUserForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [],
    }
    this.onSelect = this.onSelect.bind(this)
    this.onClear = this.onClear.bind(this)
  }

  onSelect() {
    console.log('do the select thing!')
  }

  onClear() {
    console.log('do the thing on clear!')
  }

  render() {
    const {
      administeredCategories,
      userId,
      searchCategories,
    } = this.props

    const {
      selectedItems,
    } = this.state

    const userRoles = Immutable.fromJS([
      { id: 'FEATURED_USER', name: 'Featured User' },
      { id: 'CURATOR', name: 'Curator' },
      { id: 'MODERATOR', name: 'Moderator' },
    ])

    if (administeredCategories.count() < 1) {
      return null
    }

    // TODO: Should be a nice dropdown, like the editor category select
    return (
      <div>
        <FilterSelectorControl
          searchCallback={searchCategories}
          labelText="Choose Category"
          listItems={administeredCategories}
          onSelect={this.onSelect}
          onClear={this.onClear}
          searchPromptText="Type category name"
          selectedItems={selectedItems}
          type="roleCategoryPicker"
        />
        <FilterSelectorControl
          labelText="Choose position"
          listItems={userRoles}
          onSelect={this.onSelect}
          onClear={this.onClear}
          searchPromptText="Type position"
          selectedItems={selectedItems}
          type="roleCategoryPicker"
        />
        <p>
          form needs to send:<br />
          userId - {userId}<br />
          categoryId<br />
          role
        </p>
      </div>
    )
  }
}
CategoryUserForm.propTypes = {
  administeredCategories: PropTypes.object.isRequired,
  searchCategories: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
}
