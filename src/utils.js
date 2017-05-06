import PropTypes from 'prop-types'

const { array } = PropTypes

const SCOPE = 'composeWithScope' // scope key in context
const scopeContextTypes = { [SCOPE]: array }
const selectScope = ctx => {
  const scopeStack = ctx[SCOPE]
  return scopeStack[0]
}

export {
  SCOPE,
  scopeContextTypes,
  selectScope,
}
