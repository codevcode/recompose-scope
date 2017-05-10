import React from 'react'

import createEagerFactory from 'recompose/createEagerFactory'

import isPlainObject from 'lodash/fp/isPlainObject'
import isArray from 'lodash/fp/isArray'

import { scopeContextTypes, selectScope } from './utils'


function getExposeKeys (arg, props) {
  if (typeof arg === 'function') return Object.keys(arg(props))
  if (isPlainObject(arg)) return Object.keys(arg)
  if (isArray(arg)) return arg
  return [arg]
}

function getProps (arg, props) {
  if (typeof arg === 'function') return arg(props)
  if (isPlainObject(arg)) return arg
  return {}
}

function exposeProps (arg) {
  return BaseComponent => {
    const factory = createEagerFactory(BaseComponent)

    class Expose extends React.Component {
      constructor (props, context) {
        super(props, context)

        const { addToExposing } = selectScope(context)
        const exposeKeys = getExposeKeys(arg, props)
        exposeKeys.map(addToExposing)
      }
      render () {
        return factory({
          ...this.props,
          ...getProps(arg, this.props),
        })
      }
    }
    Expose.contextTypes = scopeContextTypes

    return Expose
  }
}


export default exposeProps
