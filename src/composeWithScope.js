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


  function pickByPropTypes (propTypes) {
    const pickKeys = pick(Object.keys(propTypes))
    return compose(
      mapProps(props => ({
        ...pickKeys(outerProps),
        ...props,
      })),
      setPropTypes(propTypes),
    )
  }
  function pickByMapper (mapper) {
    return mapProps(props => ({
      ...mapper(outerProps),
      ...props,
    }))
  }

  function consumeProps (getPropTypes) {
    const propTypes = getPropTypes()
    Object.keys(propTypes).map(addToConsuming)

    return pickByPropTypes(propTypes)
  }
  function injectProps (getArg) {
    const arg = getArg()
    return (typeof arg === 'function') ?
      pickByMapper(arg) :
      pickByPropTypes(arg)
  }


  function exposeStatic (enhancer, arg) {
    Object.keys(arg).map(addToExposing)
    return enhancer(arg)
  }
  function exposeDynamic (enhancer, getArg) {
    return enhancer(props => {
      const arg = getArg(props)
      Object.keys(arg).map(addToExposing)
      return arg
    })
  }
  const exposeBy = enhancer => arg => (
    (typeof arg === 'function') ?
      exposeDynamic(enhancer, arg) :
      exposeStatic(enhancer, arg)
  )

  function exposeProps (getArg) {
    return exposeBy(withProps)(getArg())
  }
  function exposeHandlers (getArg) {
    return exposeBy(withHandlers)(getArg())
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
