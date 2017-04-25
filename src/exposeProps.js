function exposeProps (withPropsArg) {
  return function madeByExposeProps () {
    return withPropsArg
  }
}


export default exposeProps
