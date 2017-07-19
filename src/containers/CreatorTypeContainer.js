/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { selectCreatorTypeCategories } from 'ello-brains/selectors/categories'
import { selectCreatorTypeCategoryIds } from 'ello-brains/selectors/profile'
import { getCategories } from '../actions/discover'
import { saveProfile } from '../actions/profile'
import { css, hover, media, modifier, parent, select } from '../styles/jss'
import * as s from '../styles/jso'

const containerStyle = css(
  { maxWidth: 490 },
)

const headerStyle = css(
  s.colorA,
  s.sansRegular,
  s.fontSize24,
  s.mb20,
  s.transitionHeight,
)

const catHeaderStyle = css(
  { ...headerStyle },
  { marginTop: 60 },
  parent('.inSettings', s.mt20),
)

const buttonStyle = css(
  s.bgcWhite,
  s.borderA,
  s.center,
  s.colorA,
  s.mb10,
  s.mr10,
  s.px5,
  s.truncate,
  {
    borderRadius: 5,
    height: 40,
    maxWidth: 230,
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    width: 'calc(50% - 5px)',
  },
  hover(s.colorWhite, s.bgcBlack, s.borderBlack),
  modifier('.isActive', s.colorWhite, s.bgcBlack, s.borderBlack),
  select(':nth-child(2n)', s.mr0),
)

const catButtonStyle = css(
  { ...buttonStyle },
  { maxWidth: 150 },
  modifier('.isActive', hover(s.bgc6, { border: '1px solid #666' })),
  media('(min-width: 26.25em)', // 420 / 16 = 26.25em
    { width: 'calc(33% - 6px)' },
    select(':nth-child(2n)', s.mr10),
    select(':nth-child(3n)', s.mr0),
  ),
)

export class CategoryButton extends PureComponent {

  static propTypes = {
    category: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    onCategoryClick: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = { isActive: this.props.isActive }
  }

  onClick = () => {
    const { category, onCategoryClick } = this.props
    this.setState({ isActive: !this.state.isActive })
    onCategoryClick(Number(category.get('id')))
  }

  render() {
    const { category } = this.props
    const { isActive } = this.state
    return (
      <button
        className={`${catButtonStyle} ${isActive ? 'isActive' : ''}`}
        onClick={this.onClick}
      >
        {category.get('name')}
      </button>
    )
  }
}

function mapStateToProps(state) {
  return {
    categories: selectCreatorTypeCategories(state),
    creatorTypeIds: selectCreatorTypeCategoryIds(state).toArray(),
  }
}

class CreatorTypeContainer extends PureComponent {

  static propTypes = {
    categories: PropTypes.array.isRequired,
    classModifier: PropTypes.string,
    creatorTypeIds: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    classModifier: '',
    creatorTypeIds: [],
  }

  componentWillMount() {
    const { classModifier, creatorTypeIds, dispatch } = this.props
    this.state = {
      artistActive: creatorTypeIds.length > 0,
      categoryIds: creatorTypeIds,
      fanActive: creatorTypeIds.length === 0 && classModifier !== 'inOnboarding',
    }
    this.updateCreatorTypes = debounce(this.updateCreatorTypes, 1000)
    dispatch(getCategories())
  }

  onCategoryClick = (id) => {
    const ids = [...this.state.categoryIds]
    const index = ids.indexOf(id)
    if (index === -1) {
      ids.push(id)
    } else {
      ids.splice(index, 1)
    }
    this.setState({ categoryIds: ids }, this.updateCreatorTypes)
  }

  onClickArtist = () => {
    this.setState({ artistActive: true, fanActive: false })
  }

  onClickFan = () => {
    this.setState({
      artistActive: false,
      categoryIds: [],
      fanActive: true,
    }, this.updateCreatorTypes)
  }

  updateCreatorTypes = () => {
    const { dispatch } = this.props
    const { categoryIds } = this.state
    dispatch(saveProfile({ creator_type_category_ids: categoryIds }))
  }

  render() {
    const { categories, classModifier } = this.props
    const { artistActive, categoryIds, fanActive } = this.state
    return (
      <div className={`${classModifier} ${containerStyle}`}>
        <h2 className={headerStyle}>I am here as:</h2>
        <div>
          <button
            className={`${buttonStyle} ${artistActive ? 'isActive' : ''}`}
            disabled={artistActive}
            onClick={this.onClickArtist}
          >
            An Artist
          </button>
          <button
            className={`${buttonStyle} ${fanActive ? 'isActive' : ''}`}
            disabled={fanActive}
            onClick={this.onClickFan}
          >
            A Fan
          </button>
        </div>
        {artistActive &&
          <div>
            <h2 className={catHeaderStyle}>I make:</h2>
            <div>
              {categories.map(cat => (
                <CategoryButton
                  category={cat}
                  isActive={categoryIds.indexOf(Number(cat.get('id'))) > -1}
                  key={`category_${cat.get('id')}`}
                  onCategoryClick={this.onCategoryClick}
                />
              ))}
            </div>
          </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(CreatorTypeContainer)

