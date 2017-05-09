import React from 'react'

import createEagerFactory from 'recompose/createEagerFactory'

import omit from 'lodash/fp/omit'
import pick from 'lodash/fp/pick'

import { SCOPE, INDEX, scopeContextTypes, selectScope } from './utils'


function toArray (set) {
  return Array.from(set.values())
}
const leaveScope = BaseComponent => {
  const factory = createEagerFactory(BaseComponent)

  class RemoveScope extends React.Component {
    getChildContext () {
      const index = this.context[INDEX]
      const scopeStack = this.context[SCOPE]
      return {
        [SCOPE]: scopeStack,
        [INDEX]: (index === 0) ? undefined : index - 1
      }
    }
    // TODO: didMount put this in context.SCOPE[0]
    // preserver this.scope
    // this.setState({ }) to trigger re-render
    render () {
      const {
        consumingKeys,
        outerProps,
        exposingKeys,
        namespace
      } = selectScope(this.context)

      const exposingProps = pick(toArray(exposingKeys))(this.props)

      return factory({
        ...omit(toArray(consumingKeys))(outerProps),
        ...(namespace ? { [namespace]: exposingProps } : exposingProps),
      })
    }
  }

  RemoveScope.contextTypes = scopeContextTypes
  RemoveScope.childContextTypes = scopeContextTypes

  return RemoveScope
}


export default leaveScope
