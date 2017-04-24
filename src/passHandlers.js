function passHandlers (withHandlersArg) {
  return function madeByPassHandlers () {
    return withHandlersArg
  }
}


export default passHandlers
