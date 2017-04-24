import 'babel-polyfill'
import { assert } from 'chai'
import sinon from 'sinon'
import jsdom from 'jsdom'

global.assert = assert
global.sinon = sinon

// for enzyme mount environment
const exposedProperties = ['window', 'navigator', 'document']

const { JSDOM } = jsdom
const dom = new JSDOM('')
global.document = dom.window.document
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}
