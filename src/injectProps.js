function injectProps (setPropTypesArg) {
  return function madeByInjectProps () {
    return setPropTypesArg
  }
}


export default injectProps
