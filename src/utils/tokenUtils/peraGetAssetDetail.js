import { NETWORK } from '@/constants'

const PERA_REST_API_BASE_URL = `https://${NETWORK}.api.perawallet.app/v1/public/assets/`

export const peraGetAssetDetail = async (assetID) => {
	return await fetch(
		`${PERA_REST_API_BASE_URL}${assetID}/?include_collectible=true`
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
