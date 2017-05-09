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
    constructor (props, context) {
      super(props, context)

      this.state = {}
      this.scope = selectScope(context)
    }
    componentDidMount () {
      this.scope.notifyOutBound = () => this.setState({})
    }
    componentWillUnmount () {
      this.scope.notifyOutBound = null
    }
    getChildContext () {
      const index = this.context[INDEX]
      return {
        [SCOPE]: this.context[SCOPE], // could omit
        [INDEX]: (index === 0) ? undefined : index - 1
      }
    }
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
