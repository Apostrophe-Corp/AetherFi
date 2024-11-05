/**
 * Formats a given number to currency format
 * @param {number} _n number
 * @param {boolean} _ad add blank decimals
 * @param {number} _d decimal count
 * @returns string  value of the formatted number or a rounded number if no decimal count is given
 */
export const currencyFormat = (_n, _ad = true, _d = 2) => {
	const _3 = 3,
		_1 = 1,
		_4 = 4,
		_0 = 0
	if (!_d) return Math.round(_n)
	let _rn = String(+(Math.round((_n % _1) + `e+${_d}`) + `e-${_d}`))
	if (_n < 0) _rn = String((_rn *= -1))
	const _dd = _d + _d,
		_1d = _d + _1,
		_d2 = _d * _d
	if (_n > _0) {
		if (_rn.length > _dd)
			if (_rn[_1d] === _rn[_dd]) {
				_rn = _rn.substring(_0, _dd)
			} else if (_rn[_dd] > _1d) {
				_rn[_1d] = _rn[_1d] + _1
				_rn = _rn.substring(_0, _dd)
			}
	} else if (_rn.length > _d2) {
		if (_rn[_dd] === _rn[_d2]) _rn = _rn.substring(_0, _d2)
		else if (_rn[_d2] > _4) {
			_rn[_dd] = _rn[_dd] + _1
			_rn = _rn.substring(_0, _d2)
		}
	}
	let _sn = String(
		_n - (_n % _1) + Number(_rn.substring(_0, _n < _0 ? _d : _1))
	)
	let _snl = _sn.length
	const _nm3 = Math.floor(_snl / _3)
	if (_nm3) {
		_snl -= _3
		for (_snl; _snl > _0; _snl -= _3) {
			if (_nm3 !== _0) {
				const _ = _sn.slice(_0, _snl)
				const __ = _sn.slice(_snl)
				_sn = `${_},${__}`
			}
		}
	}
	_sn += _rn.substring(_1, _dd)
	return `${_sn}${_rn === '0' && _ad ? '.00' : ''}`
}
