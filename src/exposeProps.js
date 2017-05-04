import createEagerFactory from 'recompose/createEagerFactory'

import isPlainObject from 'lodash/fp/isPlainObject'

import { scopeContextTypes, selectScope } from './utils'


function exposeProps (arg) {
  return BaseComponent => {
    const factory = createEagerFactory(BaseComponent)

    const Expose = (innerProps, context) => {
      const { addToExposing } = selectScope(context)

      if (typeof arg === 'function') {
        const toExposeProps = arg(innerProps)
        Object.keys(toExposeProps).map(addToExposing)
        return factory({
          ...innerProps,
          ...toExposeProps,
        })
      } else if (isPlainObject(arg)) {
        Object.keys(arg).map(addToExposing)
        return factory({
          ...innerProps,
          ...arg,
        })
      } else {
        arg.map(addToExposing)
        return factory(innerProps)
      }
    }

    Expose.contextTypes = scopeContextTypes

    return Expose
  }
}


export default exposeProps
