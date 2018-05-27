import React, { createFactory } from 'react'

import { scopeContextTypes, selectScope } from './utils'


function exposeProps (ns) {
  return BaseComponent => {
    const factory = createFactory(BaseComponent)

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
