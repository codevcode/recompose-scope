import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'

import omit from 'lodash/fp/omit'

import mapProps from 'recompose/mapProps'
import withProps from 'recompose/withProps'
import withState from 'recompose/withState'
import shouldUpdate from 'recompose/shouldUpdate'

import scope from '../composeWithScope'
import consumeProps from '../consumeProps'
import exposeProps from '../exposeProps'
import exposeHandlers from '../exposeHandlers'
import injectProps from '../injectProps'
import exposeNamespace from '../exposeNamespace'

import { scopeContextTypes, selectScope } from '../utils'

const { strictEqual: is, deepEqual: deep } = assert
const { spy } = sinon

const { createElement: el } = React
const { string, number, object } = PropTypes


describe('composeWithScope', function () {
  function tester (enhancers, props) {
    const spyBase = spy(() => el('div'))
    spyBase.contextTypes = scopeContextTypes

    const spyScopeProps = spy(ps => ps)

    const Comp = scope(
      ...enhancers,
      mapProps(spyScopeProps),
    )(spyBase)

    mount(el(Comp, props))

    is(spyScopeProps.callCount, 1)
    is(spyBase.callCount, 1)

    return {
      Comp,
      baseProps: spyBase.args[0][0],
      scopeProps: spyScopeProps.args[0][0],
      baseContext: spyBase.args[0][1],
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
  it('can passing props by mapper with `exposeProps`', function () {
    const props = { }
    const enhancers = [
      withProps(() => ({ value: 'value' })),
      exposeProps(({ value }) => ({ value })),
    ]

    const { baseProps } = tester(enhancers, props)

    deep(baseProps, { value: 'value' })
  })
  it('can expose props by keys with `exposeProps`', function () {
    const props = { }
    const enhancers = [
      withProps(() => ({ value: 'value' })),
      exposeProps(['value']),
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
  it('pass function as argument to `injectProps`', function () {
    const props = { coact: { emitter: 'emitter' } }
    const enhancers = [
      injectProps(({ coact }) => ({ emitter: coact.emitter })),
    ]

    const { baseProps, scopeProps } = tester(enhancers, props)

    deep(scopeProps, { emitter: 'emitter' })
    deep(baseProps, { coact: { emitter: 'emitter' } })
  })
  it('pass propTypes as argument to `injectProps`', function () {
    const props = { coact: { emitter: 'emitter' } }
    const enhancers = [
      injectProps({ coact: object }),
    ]

    const { baseProps, scopeProps } = tester(enhancers, props)

    deep(scopeProps, { coact: { emitter: 'emitter' } })
    deep(baseProps, { coact: { emitter: 'emitter' } })
  })
  it('pass array as argument to `injectProps`', function () {
    const props = { coact: { emitter: 'emitter' } }
    const enhancers = [
      injectProps(['coact']),
    ]

    const { baseProps, scopeProps } = tester(enhancers, props)

    deep(scopeProps, { coact: { emitter: 'emitter' } })
    deep(baseProps, { coact: { emitter: 'emitter' } })
  })
  it('build scope each call', function () {
    const enhancers = [
      withState('value', 'setValue', null),
      exposeProps(({ value, setValue }) => ({ value, setValue })),
    ]

    const Base = () => el('div')
    const spyBase = spy(props => el(Base, props))
    const spyScope = spy(ps => ps)

    const Comp = scope(
      ...enhancers,
      mapProps(spyScope),
    )(spyBase)

    const propsA = { a: 'a' }
    const propsB = { b: 'b' }
    const wrapper = mount(el('div', { },
      [
        el(Comp, { key: 1, ...propsA }),
        el(Comp, { key: 2, ...propsB }),
      ],
    ))

    const comp = wrapper.find(Base).at(0)
    comp.props().setValue('value')


    is(spyScope.callCount, 3)
    is(spyBase.callCount, 3)

    const baseArgs = spyBase.args

    deep(baseArgs[0][0].a, 'a')
    deep(baseArgs[0][0].value, null)
    deep(baseArgs[1][0].b, 'b')
    deep(baseArgs[2][0].a, 'a')
    deep(baseArgs[2][0].value, 'value')
  })
  it('out of scope, context.scope should clear', function () {
    const props = { id: 1, name: 'Charles', type: 'object' }
    const enhancers = [
      consumeProps({ id: number }),
      consumeProps({ type: string }),
    ]

    const { baseContext } = tester(enhancers, props)

    deep(selectScope(baseContext), undefined)
  })
  it('`exposeNamespace` wrap all exposed props in an Object', function () {
    const props = { id: 1 }
    const enhancers = [
      exposeProps({ inner: 'inner' }),
      exposeNamespace('ns'),
    ]

    const { baseProps } = tester(enhancers, props)

    deep(baseProps, { id: 1, ns: { inner: 'inner' } })
  })
  it('support nested scope', function () {
    const props = { a: 'a', b: 'b', c: 'c', d: 'd' }

    const spyL2Props = spy(ps => ps)

    const enhancers = [
      consumeProps({ a: string }),
      injectProps({ b: string, c: string, d: string }),
      scope(
        consumeProps({ b: string }),
        injectProps({ c: string }),
        mapProps(spyL2Props),
        exposeProps(() => ({ e: 'e' })),
      ),
      exposeProps(() => ({ f: 'f'})),
    ]

    const { baseContext, scopeProps, baseProps } = tester(enhancers, props)

    deep(selectScope(baseContext), undefined)
    deep(scopeProps, { a: 'a', c: 'c', d: 'd', e: 'e', f: 'f' })
    deep(baseProps, { b: 'b', c: 'c', d: 'd', f: 'f' })
  })
  it('support intermediate shouldUpdate return false', function () {
    const spyL2Props = spy(ps => ps)
    const [a, b, c, d, e, f] = ['a', 'b', 'c', 'd', 'e', 'f']
    const props = { a, b, c, d }
    const enhancers = [
      consumeProps({ a: string }),
      injectProps({ b: string, c: string, d: string }),
      withState('value', 'setValue', null),
      scope(
        consumeProps({ b: string }),
        injectProps({ c: string }),
        shouldUpdate(() => false),
        mapProps(spyL2Props),
        exposeProps(() => ({ e })),
      ),
      withProps(() => ({ f })),
      exposeProps(['value', 'setValue', 'f']),
    ]

    const Base = () => el('div')
    const spyBase = spy(ps => el(Base, ps))
    const spyScope = spy(ps => ps)

    const Comp = scope(
      ...enhancers,
      mapProps(spyScope),
    )(spyBase)

    const wrapper = mount(el(Comp, props))

    const comp = wrapper.find(Base).at(0)
    comp.props().setValue('value')

    is(spyScope.callCount, 2)
    is(spyBase.callCount, 2)
    is(spyL2Props.callCount, 1)

    const baseArgs = spyBase.args

    const propsAt0 = omit('setValue')(baseArgs[0][0])
    const propsAt1 = omit('setValue')(baseArgs[1][0])

    deep(propsAt0, { b, c, d, f, value: null })
    deep(propsAt1, { b, c, d, f, value: 'value' })
  })
})
