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
    // TODO constructor() {
    //   initScope()
    // }
    constructor (props, context) {
      super(props, context)

      this.scope = createScope(this.props)

      const index = context[INDEX]
      this.scopeIndex = (index === undefined) ? 0 : index + 1
    }
    componentWillReceiveProps (nextProps) {
      this.scope.outerProps = nextProps
    }
    getChildContext () {
      const scopeStack = this.context[SCOPE] || []
      scopeStack[this.scopeIndex] = this.scope
      return {
        [SCOPE]: scopeStack,
        [INDEX]: this.scopeIndex,
      }
    }
    // TODO didUpdate, check if props changed and leaveScope not updated
    // constext.SCOPE[0].forceUpdate leaveScope
    // maintain currentScopeIndex
    // willReceiveProps, this.scope.props = nextProps
    render () {
      return factory({ }) // intent to omit all outer props
    }
  }

  ProvideScope.contextTypes = scopeContextTypes
  ProvideScope.childContextTypes = scopeContextTypes

  return ProvideScope
}


export default enterScope
