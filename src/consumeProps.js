function consumeProps (setPropTypesArg) {
  return function madeByConsumeProps () {
    return setPropTypesArg
  }
}


export default consumeProps
