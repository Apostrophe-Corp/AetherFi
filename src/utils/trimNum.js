export const trimNum = (el) => {
	if (el === 0) return el
	const el_ = el
	let strDp = String(+(Math.round((el_ % 1) + `e+${2}`) + `e-${2}`))
	if (el_ < 0) strDp = String((strDp *= -1))
	const _ = 2 + 2,
		__ = 2 + 1,
		___ = 2 * 2
	if (el_ > 0) {
		if (strDp.length > _)
			if (strDp[__] === strDp[_]) {
				strDp = strDp.substring(0, _)
			} else if (strDp[_] > __) {
				strDp[__] = strDp[__] + 1
				strDp = strDp.substring(0, _)
			}
	} else if (strDp.length > ___) {
		if (strDp[_] === strDp[___]) strDp = strDp.substring(0, ___)
		else if (strDp[___] > 4) {
			strDp[_] = strDp[_] + 1
			strDp = strDp.substring(0, ___)
		}
	}
	let str = String(
		el_ - (el_ % 1) + Number(strDp.substring(0, el_ < 0 ? 2 : 1))
	)
	str += strDp.substring(1, ___)
	return el_ < 0 && el_ - (el_ % 1) === 0 ? Number(str) * -1 : Number(str)
}
