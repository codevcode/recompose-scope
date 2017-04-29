import PropTypes from 'prop-types'

const { object } = PropTypes

const SCOPE = 'composeWithScope' // scope key in context
const scopeContextTypes = { [SCOPE]: object }
const selectScope = ctx => ctx[SCOPE]

export {
  SCOPE,
  scopeContextTypes,
  selectScope,
}
