function passProps (withPropsArg) {
  return function madeByPassProps () {
    return withPropsArg
  }
}


export default passProps
