import React, { createFactory } from 'react'

import omit from 'lodash/fp/omit'
import pick from 'lodash/fp/pick'

import { SCOPE, scopeContextTypes } from './utils'


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
    // `addToConsuming: consumingKeys.add` does not bind add, will cause error
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
    notifyOutBound: null,
  }
}

const enterScope = BaseComponent => {
  const factory = createFactory(BaseComponent)

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
      return {
        [SCOPE]: (this.context[SCOPE] || []).concat(this.scope),
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
