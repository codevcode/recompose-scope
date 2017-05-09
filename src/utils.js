import PropTypes from 'prop-types'

const { array, number } = PropTypes

const SCOPE = 'composeWithScope' // scope key in context
const INDEX = 'composeWithScopeCurrentIndex' // scope key in context
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
