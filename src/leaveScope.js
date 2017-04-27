import compose from 'recompose/compose'
import createEagerFactory from 'recompose/createEagerFactory'
import withContext from 'recompose/withContext'

import omit from 'lodash/fp/omit'
import pick from 'lodash/fp/pick'

import { SCOPE, scopeContextTypes, selectScope } from './utils'


function toArray (set) {
  return Array.from(set.values())
}

function buildLeavingScopeProps (BaseComponent) {
  const factory = createEagerFactory(BaseComponent)

  const ConsumeAndExpose = (innerProps, context) => {
    const { outerProps, consumingKeys, exposingKeys } = selectScope(context)

    return factory({
      ...omit(toArray(consumingKeys))(outerProps),
      ...pick(toArray(exposingKeys))(innerProps),
    })
  }

  ConsumeAndExpose.contextTypes = scopeContextTypes

  return ConsumeAndExpose
}

function clearScopeContext () {
  return { [SCOPE]: undefined }
}

const leaveScope = compose(
  buildLeavingScopeProps,
  withContext(scopeContextTypes, clearScopeContext),
)


export default leaveScope
