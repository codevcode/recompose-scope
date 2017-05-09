import React from 'react'

import createEagerFactory from 'recompose/createEagerFactory'

import { SCOPE, INDEX, scopeContextTypes } from './utils'


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
    constructor (props, context) {
      super(props, context)

      this.scope = createScope(this.props)
    }
    componentWillReceiveProps (nextProps) {
      this.scope.outerProps = nextProps
      if (this.scope.notifyOutBound) this.scope.notifyOutBound()
    }
    getChildContext () {
      const index = this.context[INDEX]
      const scopeIndex = (index === undefined) ? 0 : index + 1

      const scopeStack = this.context[SCOPE] || []
      scopeStack[scopeIndex] = this.scope
      return {
        [SCOPE]: scopeStack,
        [INDEX]: scopeIndex,
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
