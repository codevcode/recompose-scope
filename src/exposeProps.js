import createEagerFactory from 'recompose/createEagerFactory'

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
