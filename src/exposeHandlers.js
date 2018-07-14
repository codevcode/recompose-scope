import React, { createFactory } from 'react'

import withHandlers from 'recompose/withHandlers'

import { scopeContextTypes, selectScope } from './utils'


function getExposeKeys (arg, props) {
  if (typeof arg === 'function') return Object.keys(arg(props))
  return Object.keys(arg)
}

const exposeHandlers = arg => BaseComponent => {
  const WrappedComp = withHandlers(arg)(BaseComponent)
  const factory = createFactory(WrappedComp)

  class Expose extends React.Component {
    constructor (props, context) {
      super(props, context)

      const { addToExposing } = selectScope(context)
      const exposeKeys = getExposeKeys(arg, props)
      exposeKeys.map(addToExposing)
    }
    render () {
      return factory(this.props)
    }
  }

  Expose.contextTypes = scopeContextTypes

  return Expose
}


export default exposeHandlers
