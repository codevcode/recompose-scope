import React from 'react'

import createEagerFactory from 'recompose/createEagerFactory'

import omit from 'lodash/fp/omit'
import pick from 'lodash/fp/pick'

import { SCOPE, INDEX, scopeContextTypes } from './utils'


function toArray (set) {
  return Array.from(set.values())
}
function createScope (props) {
  const consumingKeys = new Set()
  const exposingKeys = new Set()

  let consumeKeys = null
  let exposeKeys = null
  return {
    outerProps: props,
    // bind `add` to owner Set in advance for passing it as callback
    addToConsuming: v => consumingKeys.add(v),
    addToExposing: v => exposingKeys.add(v),
    namespace: null,
    consume (outerProps) {
      if (!consumeKeys) consumeKeys = omit(toArray(consumingKeys))
      return consumeKeys(outerProps)
    },
    expose (innerProps) {
      if (!exposeKeys) exposeKeys = pick(toArray(exposingKeys))
      return exposeKeys(innerProps)
    },
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
