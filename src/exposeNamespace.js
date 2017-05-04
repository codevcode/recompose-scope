import createEagerFactory from 'recompose/createEagerFactory'

import { scopeContextTypes, selectScope } from './utils'


function exposeProps (ns) {
  return BaseComponent => {
    const factory = createEagerFactory(BaseComponent)

    const Expose = (innerProps, context) => {
      const scope = selectScope(context)
      scope.namespace = ns
      return factory(innerProps)
    }

    Expose.contextTypes = scopeContextTypes

    return Expose
  }
}


export default exposeProps
