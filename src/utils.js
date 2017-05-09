import PropTypes from 'prop-types'

const { array, number } = PropTypes

const SCOPE = 'recompose-scope' // scope key in context
const INDEX = 'recompose-scope-index' // scope key in context
const scopeContextTypes = { [SCOPE]: array, [INDEX]: number }
const selectScope = ctx => {
  const scopeStack = ctx[SCOPE]
  const index = ctx[INDEX]
  return scopeStack[index]
}

export {
  SCOPE,
  INDEX,
  scopeContextTypes,
  selectScope,
}
