import PropTypes from 'prop-types'

const { array } = PropTypes

const SCOPE = 'recompose-scope' // scope key in context
const scopeContextTypes = { [SCOPE]: array }
const selectScope = ctx => {
  const stack = ctx[SCOPE]
  return stack[stack.length - 1]
}

export {
  SCOPE,
  scopeContextTypes,
  selectScope,
}
