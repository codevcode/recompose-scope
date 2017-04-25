function exposeHandlers (withHandlersArg) {
  return function madeByExposeHandlers () {
    return withHandlersArg
  }
}


export default exposeHandlers
