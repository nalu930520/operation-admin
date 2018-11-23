// 加
const accAdd = (arg1, arg2) => {
  var decimals = 1000000
  var a = arg1 * decimals
  var b = arg2 * decimals
  return Math.round(a + b) / decimals
}

// 减
const accSub = (arg1, arg2) => {
  var decimals = 1000000
  var a = arg1 * decimals
  var b = arg2 * decimals
  return Math.round(a - b) / decimals
}

// 除
const accDiv = (arg1, arg2) => {
  var decimals = 1000000
  var a = arg1 * decimals
  var b = arg2 * decimals
  return Math.round(a / b)
}

// 乘
const accMul = (arg1, arg2) => {
  var decimals = 1000000
  var a = arg1 * decimals
  var b = arg2 * decimals
  return Math.round(a * b) / (decimals * decimals)
}

export {
  accAdd,
  accSub,
  accMul,
  accDiv
}
