import compose from 'recompose/compose'
import setPropTypes from 'recompose/setPropTypes'

import pick from 'lodash/fp/pick'
import isArray from 'lodash/fp/isArray'
import isPlainObject from 'lodash/fp/isPlainObject'

import injectOuterProps from './injectOuterProps'


function getMapper (arg) {
  if (typeof arg === 'function') return arg
  if (isArray(arg)) return pick(arg)
  return pick(Object.keys(arg))
}

const consumeProps = arg => {
  const injectEnahncer = injectOuterProps(getMapper(arg), true)

  if(!isPlainObject(arg)) return injectEnahncer
  return compose(injectEnahncer, setPropTypes(arg))
}


export default consumeProps
