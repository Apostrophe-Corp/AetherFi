import { getASAInfo } from './tokenUtils'

/**
 * Sets the background of the element ref to that of the user's pfp
 * @param {any} assetIDs An array of number - []assetID...
 */
export const getAssetMedia = async (assetIDs) => {
	const media = []
	if (assetIDs) {
		const oLen = assetIDs.length
		let i = 0
		for (i; i < oLen; i++) {
			try {
				const assetID = Number(assetIDs[i] ?? 0)
				const asaInfo =
					assetID === 0
						? {
								logo: 'https://asa-list.tinyman.org/assets/0/icon.svg',
								is_collectible: false,
								mediaType: 'image',
								peraFetched: true,
						  }
						: await getASAInfo(assetID)
				const { peraFetched = false, is_collectible = false } = asaInfo
				const prop = peraFetched
					? 'peraFetched'
					: !asaInfo.isARC69
					? 'image'
					: 'url'
				let pfp = null
				if (asaInfo?.[prop]) {
					if (peraFetched) {
						if (is_collectible) {
							const media = asaInfo.collectible.media.find((e) => e.url)
							pfp = {
								name: media?.name,
								mediaURL: media?.url,
								is_collectible,
								mediaType: media?.type,
								extension: media?.extension,
							}
						} else {
							pfp = { logo: asaInfo?.logo, is_collectible }
						}
					} else {
						if (asaInfo?.[prop].indexOf('ipfs://') === 0) {
							asaInfo[prop] =
								'https://gateway.ipfs.io/ipfs/' + asaInfo?.[prop].slice(7)
						}
						pfp = `${asaInfo?.[prop] ?? null}`
					}
				}
				media.push(pfp)
			} catch (error) {
				// Do nothing
			}
		}
		return media
	} else return []
}
