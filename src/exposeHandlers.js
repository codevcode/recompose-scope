import createEagerFactory from 'recompose/createEagerFactory'
import withHandlers from 'recompose/withHandlers'

import { scopeContextTypes, selectScope } from './utils'


const exposeHandlers = arg => BaseComponent => {
  const WrappedComp = withHandlers(arg)(BaseComponent)
  const factory = createEagerFactory(WrappedComp)

  const Expose = (innerProps, context) => {
    const handlerCreators = (typeof arg === 'function') ? arg(innerProps) : arg

    const { addToExposing } = selectScope(context)
    Object.keys(handlerCreators).map(addToExposing)

    return factory(innerProps)
  }

  Expose.contextTypes = scopeContextTypes

  return Expose
}


export default exposeHandlers
