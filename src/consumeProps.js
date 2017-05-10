import compose from 'recompose/compose'
import setPropTypes from 'recompose/setPropTypes'

import isPlainObject from 'lodash/fp/isPlainObject'

import injectOuterProps from './injectOuterProps'


const consumeProps = arg => {
  const injectEnahncer = injectOuterProps(arg, true)

  if (!isPlainObject(arg)) return injectEnahncer
  return compose(injectEnahncer, setPropTypes(arg))
}


export default consumeProps
