/**
 * 复现一个精度计算的bug
 * 目前场景是 slippage 计算错误
 *
 * 精度乘法，a * (10002) = b
 * b / a = 10001
 * 原本输入滑点是2，但是计算发现是1

 * 放大精度发现（如果是浮点数）
 * 其实 b / a = 10001.9998
 *
 * 解决思路，如果涉及到除法，一定要扩大额外的一个精度（四舍五入）
 *
 */
function main() {
  testPrecision()
}

function testPrecision() {
  test(0) // 1n
  test(1) // 19n
  test(2) // 199n
  test(3) // 1999n
  test(4) // 19999n
}

function test(precision) {
  var actualAmountOut = 987158034397061298n

  var expectSlippage = 1n // 可理解为 0.01%
  var actualSlippage = 2n // 可理解为 0.02%

  // var expectSlippage = 10n
  // var actualSlippage = 20n

  // var expectAmountOut = 987355466003940710n

  var basic = 4
  var scale1 = BigInt(10 ** (precision + basic))
  var scale2 = BigInt(10 ** precision)

  var expectAmountOut = (actualAmountOut * (scale1 + actualSlippage * scale2)) / scale1
  var calcActualSlippage = (expectAmountOut * scale1) / actualAmountOut - scale1

  console.log(`-- test with precision: ${precision}`)
  // console.log('actualAmountOut:', actualAmountOut)
  // console.log('expectSlippage:', expectSlippage)
  // console.log('actualSlippage:', actualSlippage)
  // console.log('expectAmountOut:', expectAmountOut)
  console.log('recalcActualSlippage:', calcActualSlippage)
  console.log()
}

main()
