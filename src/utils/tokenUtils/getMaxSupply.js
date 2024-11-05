export function getMaxSupply(dec) {
	const max = 2n ** 64n - 1n
	const supp = max / BigInt(10) ** BigInt(dec)
	return supp
}
