import { getASAInfo } from './tokenUtils'

export const getTokenAndMedia = async (assetIDs) => {
	const media = []
	if (assetIDs?.length) {
		await Promise.all(
			assetIDs.map(async (assetID_) => {
				const assetID = Number(assetID_ ?? 0)
				try {
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
					media.push({
						token:
							assetID === 0
								? {
										success: true,
										decimals: 6,
										name: 'ALGO',
										unit: 'ALGO',
										index: assetID,
								  }
								: asaInfo,
						media: pfp,
					})
				} catch (error) {
					// Do nothing
					console.log('getTokenAndMedia', { error })
				}
			})
		)
		return media
	} else return []
}
