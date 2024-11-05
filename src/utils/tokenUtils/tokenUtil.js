import { algonodeClientFetch } from './algonodeClient'
import { algonodeIndexerFetch } from './algonodeIndexer'
import { peraGetAssetDetail } from './peraGetAssetDetail'

export const assetQueries = {}

/**
 * @param asset ASA ID
 * @returns An Object: { name, unit, url, result } | {}
 */
export const getASAInfo = async (asset) => {
	asset = Number(asset)
	if (asset === 0)
		return {
			success: true,
			decimals: 6,
			name: 'ALGO',
			unit: 'ALGO',
			index: asset,
		}
	let res = await peraGetAssetDetail(asset)
	if (res.success && (res.name || res['unit_name'])) {
		return {
			...res,
			index: asset,
			peraFetched: true,
			unit: res['unit_name'],
			decimals: res['fraction_decimals'],
			supply: res['total_supply'],
		}
	} else {
		res = await algonodeIndexerFetch(asset)
		if (res.success && (res.name || res['unit-name'])) {
			return { ...res, index: asset, unit: res['unit-name'] }
		} else {
			res = await algonodeClientFetch(asset)
			return { ...res, index: asset, unit: res['unit-name'] }
		}
	}
}
