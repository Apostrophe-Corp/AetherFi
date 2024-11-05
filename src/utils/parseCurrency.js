import { getASAInfo } from './tokenUtils'

export const parseCurrency = async (tok, amt, dec = null) => {
	const { decimals = 0 } =
		dec !== null ? { decimals: dec } : await getASAInfo(tok)
	const power = 10 ** Number(decimals)
	const newAmt = amt * power
	const secondHalf = String(newAmt % 1).length - 2
	if (secondHalf) {
		return Math.ceil(newAmt)
	}
	return Number(newAmt)
}
