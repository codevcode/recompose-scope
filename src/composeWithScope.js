import compose from 'recompose/compose'

import setPropTypes from 'recompose/setPropTypes'
import mapProps from 'recompose/mapProps'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'

import omit from 'lodash/fp/omit'
import pick from 'lodash/fp/pick'


function toArray (set) {
  return Array.from(set.values())
}

function composeWithScope (...funcs) {
  let outerProps = null

  const consumingKeys = new Set()
  const exposingKeys = new Set()

  // bind `this` in advance for passing `add` function as an argument
  const addToConsuming = v => consumingKeys.add(v)
  const addToExposing = v => exposingKeys.add(v)

  // receive the same paramater as `recompose/setPropTypes`
  function consumeProps (getPropTypes) {
    const propTypes = getPropTypes()
    const consumedkeys = Object.keys(propTypes)
    consumedkeys.map(addToConsuming)

    const pickConsumedProps = pick(consumedkeys)
    return compose(
      mapProps(props => ({
        ...pickConsumedProps(outerProps),
        ...props,
      })),
      setPropTypes(propTypes),
    )
  }

  // receive the same paramater as `recompose/setPropTypes`
  function injectProps (getPropTypes) {
    const propTypes = getPropTypes()
    const injectedKeys = Object.keys(propTypes)

    const pickInjectedProps = pick(injectedKeys)
    return compose(
      mapProps(props => ({
        ...pickInjectedProps(outerProps),
        ...props,
      })),
      setPropTypes(propTypes),
    )
  }

  // receive the same paramater as `recompose/withProps`
  function exposeProps (getArg) {
    const arg = getArg()

    return withProps(props => {
      const passingProps = (typeof arg === 'function') ? arg(props) : arg
      Object.keys(passingProps).map(addToExposing)
      return passingProps
    })
  }

  // receive the same paramater as `recompose/withHandlers`
  function exposeHandlers (getArg) {
    const arg = getArg()

    return withHandlers(props => {
      const handlerCreators = (typeof arg === 'function') ? arg(props) : arg
      Object.keys(handlerCreators).map(addToExposing)
      return handlerCreators
    })
  }

  function enhancerMapper (func) {
    const { name } = func
    if (name === 'madeByConsumeProps') return consumeProps(func)
    if (name === 'madeByInjectProps') return injectProps(func)
    if (name === 'madeByExposeProps') return exposeProps(func)
    if (name === 'madeByExposeHandlers') return exposeHandlers(func)
    return func
  }

  const enhancers = funcs.map(enhancerMapper)

  return compose(
    mapProps(props => {
      outerProps = props
      return { }
    }),
    ...enhancers,
    mapProps(props => ({
      ...omit(toArray(consumingKeys))(outerProps),
      ...pick(toArray(exposingKeys))(props),
    })),
  )
}

export default composeWithScope
