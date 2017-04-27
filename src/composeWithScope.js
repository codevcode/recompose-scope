import compose from 'recompose/compose'

import enterScope from './enterScope'
import leaveScope from './leaveScope'


// 放在 props 會放漏掉
// 用 Symbol 中間太容易漏傳
// const scopeSym = Symbol()
// const scopeSym = 'scopeSym'

// TODO 一層一層 push 到 context.composeWithScopeStack 裡
// TODO custmize storeKey?
// TODO 分開處理 static expose and dynamic expose?


function composeWithScope (...hocs) {
  return compose(
    enterScope,
    ...hocs,
    leaveScope,
  )
}


export default composeWithScope

