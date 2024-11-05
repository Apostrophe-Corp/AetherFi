import { NETWORK } from '@/constants'
const NFD_REST_API_BASE_URL = `https://api${NETWORK === 'testnet' ? '.testnet' : ''
	}.nf.domains/nfd/`

export const getNFD = async (address) => {
	if (!address) return { success: false }
	return await fetch(
		`${NFD_REST_API_BASE_URL}lookup?address=${address}&view=thumbnail`
	)
		.then((res) => res.json())
		.then((data) => ({ ...data, success: Boolean(Object.keys(data)?.length) }))
		.catch((error) => {
			return {
				...error,
				success: false,
			}
		})
}

export const getAddress = async (nfd) => {
	if (!nfd) return { success: false }
	return await fetch(`${NFD_REST_API_BASE_URL}${String(nfd).toLowerCase()}`)
		.then((res) => res.json())
		.then((data) => ({ ...data, success: Boolean(Object.keys(data)?.length) }))
		.catch((error) => {
			return {
				...error,
				success: false,
			}
		})
}

export const getNFDs = async (address) => {
	if (!address) return { success: false }
	return await fetch(
		`${NFD_REST_API_BASE_URL}v2/search?owner=${address}&view=thumbnail&limit=200`
	)
		.then((res) => res.json())
		.then((data) => ({ ...data, success: Boolean(Object.keys(data)?.length) }))
		.catch((error) => {
			return {
				...error,
				success: false,
			}
		})
}

export const getSegmentsOfNFD = async (nfd) => {
	if (!nfd) return { success: false }
	return await fetch(
		`${NFD_REST_API_BASE_URL}v2/search?name=${String(nfd).toLowerCase()}&view=thumbnail`
	)
		.then((res) => res.json())
		.then((data) => ({ ...data, success: data?.nfds?.length }))
		.catch((error) => {
			return {
				...error,
				success: false,
			}
		})
}

export const verifySegment = ({
	nfd,
	segment,
	includeRoot = false,
	standardSegment = true,
}) => {
	if (!nfd || !segment) return false
	const nfdParts = String(nfd).toLowerCase().split('.')
	const segmentParts = String(segment).toLowerCase().split('.')
	let qualified = true,
		n = nfdParts.length - 1,
		s = segmentParts.length - 1

	if (!includeRoot && n === s) return false
	if (standardSegment && s !== 2) return false

	while (n > 0) {
		qualified = String(nfdParts[n]) === String(segmentParts[s])
		if (!qualified) break
		n--
		s--
	}

	return qualified
}

export const validateNFDFormat = (x, isBase = false) => {
	if (!x) return false
	const split = String(x).toLowerCase().split('.')
	return (
		split.length > 1 &&
		split.length < (isBase ? 3 : 4) &&
		split.reduce(
			(accu, next) =>
				accu === false || Boolean(next) === false ? false : true,
			true
		) &&
		split[split.length - 1] === 'algo'
	)
}

export const validateNFD = async (x, isBase = false) => {
	if(!x) return false
	const formatValid = validateNFDFormat(x, isBase)
	if (formatValid) {
		const res = await getAddress(x)
		return (res.success && res?.name && res?.state === 'owned' && res?.owner)
	}
	return false
}
