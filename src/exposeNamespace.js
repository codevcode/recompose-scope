import React from 'react'

import createEagerFactory from 'recompose/createEagerFactory'

import { scopeContextTypes, selectScope } from './utils'


function exposeProps (ns) {
  return BaseComponent => {
    const factory = createEagerFactory(BaseComponent)

    class Expose extends React.Component {
      constructor (props, context) {
        super(props, context)

        const scope = selectScope(context)
        scope.namespace = ns
      }
      render () {
        return factory(this.props)
      }
    }

    Expose.contextTypes = scopeContextTypes

    return Expose
  }
}


export default exposeProps
