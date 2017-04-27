import compose from 'recompose/compose'
import withContext from 'recompose/withContext'
import mapProps from 'recompose/mapProps'

import { SCOPE, scopeContextTypes } from './utils'


function createScope (props) {
  const consumingKeys = new Set()
  const exposingKeys = new Set()
  return {
    outerProps: props,
    consumingKeys,
    exposingKeys,
    // bind `add` to owner Set in advance for passing it as callback
    addToConsuming: v => consumingKeys.add(v),
    addToExposing: v => exposingKeys.add(v),
  }
}

function createScopeContext (props) {
  return { [SCOPE]: createScope(props) }
}

const enterScope = compose(
  withContext(scopeContextTypes, createScopeContext),
  mapProps(() => ({ })),
)


export default enterScope
