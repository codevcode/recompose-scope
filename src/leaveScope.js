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
    const {
      consumingKeys,
      outerProps,
      exposingKeys,
      namespace
    } = selectScope(context)

    const exposingProps = pick(toArray(exposingKeys))(innerProps)

    return factory({
      ...omit(toArray(consumingKeys))(outerProps),
      ...(namespace ? { [namespace]: exposingProps } : exposingProps),
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
