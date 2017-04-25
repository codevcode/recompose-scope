import React from 'react'
import propTypes from 'prop-types'
import { mount } from 'enzyme'

import mapProps from 'recompose/mapProps'
import withProps from 'recompose/withProps'

import scope from '../composeWithScope'
import consumeProps from '../consumeProps'
import exposeProps from '../exposeProps'
import exposeHandlers from '../exposeHandlers'
import injectProps from '../injectProps'

const { strictEqual: is, deepEqual: deep } = assert
const { spy } = sinon

const { createElement: el } = React
const { string, number, object } = propTypes

describe('composeWithScope', function () {
  function tester (enhancers, props) {
    const spyBaseProps = spy(() => el('div'))
    const spyScopeProps = spy(ps => ps)

    const Comp = scope(
      ...enhancers,
      mapProps(spyScopeProps),
    )(spyBaseProps)

    mount(el(Comp, props))

    is(spyScopeProps.callCount, 1)
    is(spyBaseProps.callCount, 1)

    return {
      baseProps: spyBaseProps.args[0][0],
      scopeProps: spyScopeProps.args[0][0],
    }
  }

  it('it only pass consumed props in scope', function () {
    const props = { a: 1, b: 'b' }
    const enhancers = []

    const { scopeProps } = tester(enhancers, props)

    deep(scopeProps, { })
  })
  it('pass through not consumed props', function () {
    const props = { a: 1 }
    const enhancers = []

    const { baseProps } = tester(enhancers, props)

    deep(baseProps, { a: 1 })
  })
  it('can assign consumed props by `consumeProps`', function () {
    const props = { id: 1, b: 'b' }
    const enhancers = [
      consumeProps({ b: string }),
    ]

    const { baseProps, scopeProps } = tester(enhancers, props)

    deep(scopeProps, { b: 'b' })
    deep(baseProps, { id: 1 })
  })
  it('can keep props create in scope private`', function () {
    const props = { id: 1, b: 'b' }
    const enhancers = [
      withProps({ pvt: 'pvt' }),
    ]

    const { baseProps, scopeProps } = tester(enhancers, props)

    deep(scopeProps, { pvt: 'pvt' })
    deep(baseProps, { id: 1, b: 'b' })
  })
  it('can passing props by `exposeProps`', function () {
    const props = { }
    const enhancers = [
      withProps(() => ({ value: 'value' })),
      exposeProps(({ value }) => ({ value })),
    ]

    const { baseProps } = tester(enhancers, props)

    deep(baseProps, { value: 'value' })
  })
  it('can passing handler props by `exposeHandlers`', function () {
    const props = { id: 1, b: 'b' }
    const enhancers = [
      exposeHandlers({ save: () => () => {} }),
    ]

    const { baseProps } = tester(enhancers, props)

    is(typeof baseProps.save, 'function')
  })
  it('`exposeHandlers` with handlerCreatorsFactory', function () {
    const props = { id: 1, b: 'b' }
    const save = () => { }
    const enhancers = [
      exposeHandlers(initProps => ({
        save: prs => data => save({ initProps, prs, data }),
      })),
    ]

    const { baseProps } = tester(enhancers, props)

    is(typeof baseProps.save, 'function')
  })
  it('call `consumeProps` twice', function () {
    const props = { id: 1, name: 'Charles', type: 'object' }
    const enhancers = [
      consumeProps({ id: number }),
      consumeProps({ type: string }),
    ]

    const { baseProps } = tester(enhancers, props)

    deep(baseProps, { name: 'Charles' })
  })
  it('inject outer props not to be consumed by `injectProps`', function () {
    const props = { coact: { emitter: 'emitter' } }
    const enhancers = [
      injectProps({ coact: object }),
      mapProps(({ coact, ...rest }) => ({ emitter: coact.emitter, ...rest })),
    ]

    const { baseProps, scopeProps } = tester(enhancers, props)

    deep(scopeProps, { emitter: 'emitter' })
    deep(baseProps, { coact: { emitter: 'emitter' } })
  })
})


describe('recognize function that higher-order function return', function () {
  it('use function name', function () {
    const result = consumeProps()

    is(result.name, 'madeByConsumeProps')
  })
})
