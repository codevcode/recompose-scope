import React from 'react'

import createEagerFactory from 'recompose/createEagerFactory'

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
    namespace: null,
  }
}

const enterScope = BaseComponent => {
  const factory = createEagerFactory(BaseComponent)

  class ProvideScope extends React.Component {
    getChildContext () {
      const scopeStack = this.context[SCOPE]
      const scope = createScope(this.props)
      return {
        [SCOPE]: [scope].concat(scopeStack),
      }
    }
    render () {
      return factory({ }) // intent to omit all outer props
    }
  }

  ProvideScope.contextTypes = scopeContextTypes
  ProvideScope.childContextTypes = scopeContextTypes

  return ProvideScope
}


export default enterScope
