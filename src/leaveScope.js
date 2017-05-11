import React from 'react'

import createEagerFactory from 'recompose/createEagerFactory'

import { SCOPE, scopeContextTypes, selectScope } from './utils'


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
      return {
        [SCOPE]: this.context[SCOPE].slice(0, -1),
      }
    }
    render () {
      const { outerProps, consume, expose, namespace } = selectScope(this.context)

      return factory({
        ...consume(outerProps),
        ...(namespace ? { [namespace]: expose(this.props) } : expose(this.props)),
      })
    }
  }

  RemoveScope.contextTypes = scopeContextTypes
  RemoveScope.childContextTypes = scopeContextTypes

  return RemoveScope
}


export default leaveScope
