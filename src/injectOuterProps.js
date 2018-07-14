import React, { createFactory } from 'react'

import pick from 'lodash/fp/pick'
import isArray from 'lodash/fp/isArray'

import { scopeContextTypes, selectScope } from './utils'


function getMapper (arg) {
  if (typeof arg === 'function') return arg
  if (isArray(arg)) return pick(arg)
  return pick(Object.keys(arg))
}

function injectOuterProps (arg, willConsume) {
  const mapper = getMapper(arg)

  return BaseComponent => {
    const factory = createFactory(BaseComponent)

    class Inject extends React.Component {
      constructor (props, context) {
        super(props, context)

        if (willConsume) {
          const { outerProps, addToConsuming } = selectScope(this.context)
          Object.keys(mapper(outerProps)).map(addToConsuming)
        }
      }
      render () {
        const scope = selectScope(this.context)

        return factory({
          ...mapper(scope.outerProps),
          ...this.props,
        })
      }
    }

    Inject.contextTypes = scopeContextTypes

    return Inject
  }
}


export default injectOuterProps
