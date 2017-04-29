import compose from 'recompose/compose'

import enterScope from './enterScope'
import leaveScope from './leaveScope'


function composeWithScope (...hocs) {
  return compose(
    enterScope,
    ...hocs,
    leaveScope,
  )
}


export default composeWithScope

