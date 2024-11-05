import { getASAInfo } from './tokenUtils'

export const fmtCurrency = async (tok, amt, dec = null) => {
	const { decimals = 0 } =
		dec !== null ? { decimals: dec } : await getASAInfo(tok)
	const power = 10 ** Number(decimals)
	const newAmt = amt / power
	return Number(newAmt)
}
