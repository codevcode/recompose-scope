import createEagerFactory from 'recompose/createEagerFactory'

import { scopeContextTypes, selectScope } from './utils'


function injectOuterProps (mapper, willConsume) {
  return BaseComponent => {
    const factory = createEagerFactory(BaseComponent)

    const Inject = (innerProps, context) => {
      const { outerProps, addToConsuming } = selectScope(context)

      const toInjectProps = mapper(outerProps)
      if (willConsume) Object.keys(toInjectProps).map(addToConsuming)

      return factory({
        ...toInjectProps,
        ...innerProps,
      })
    }

    Inject.contextTypes = scopeContextTypes

    return Inject
  }
}


export default injectOuterProps
