import { NETWORK } from '@/constants'
import algosdk from 'algosdk'
import { getASAInfo } from './tokenUtil'

const indexerServer = `https://${NETWORK}-idx.algonode.cloud`

const port = 443
const token = ''

const indexerClient = new algosdk.Indexer(token, indexerServer, port)

const algodClientParams = {
	token: '',
	server: `https://${NETWORK}-api.algonode.cloud`,
	port: '443',
}

const algodClient = new algosdk.Algodv2(
	algodClientParams.token,
	algodClientParams.server,
	algodClientParams.port
)

export const getAssetsByCreator = async ({
	creator,
	searchKey = '',
	blacklist = [],
} = {}) => {
	if (!creator) return []
	try {
		const accountInfo = await algodClient.accountInformation(creator).do()
		let created_assets = accountInfo['created-assets']
		const data = []
		const noneRedeemable = {}
		blacklist.forEach((e) => {
			noneRedeemable[e] = e
		})

		const len = created_assets.length
		for (let i = 0; i < len; i++) {
			const asset = created_assets[i]
			const asset_id = asset['index']
			const asset_name = asset['params']['name']
			if (
				!noneRedeemable[asset_id] &&
				(searchKey
					? String(asset_name)
							.toLowerCase()
							.indexOf(String(searchKey).toLowerCase()) !== -1
					: true)
			) {
				data.push(asset_id)
			}
		}
		return data
	} catch (err) {
		// console.log(err)
		return []
	}
}

export const getAssetsByAccount = async ({
	address,
	blacklist = [],
	withBalance = true,
	withAmount = false,
	closableAssets = false,
} = {}) => {
	if (!address) return []
	try {
		let account_assets = []
		let nextToken = ''
		do {
			const res = await indexerClient
				.lookupAccountAssets(address)
				.nextToken(nextToken)
				.do()
			account_assets = account_assets.concat(res['assets'])
			nextToken = res['next-token']
		} while (nextToken)
		if (!account_assets.length) {
			return []
		}

		const data = []
		const noneRedeemable = {}
		blacklist.forEach((e) => {
			noneRedeemable[e] = e
		})

		const len = account_assets.length
		for (let i = 0; i < len; i++) {
			const asset = account_assets[i]
			const asset_id = asset['asset-id']
			const is_deleted = asset['deleted']
			const amount = asset['amount']
			if (
				!is_deleted &&
				!noneRedeemable[asset_id] &&
				(withBalance ? (closableAssets ? amount === 0 : amount) : true)
			) {
				data.push(withAmount ? { asset_id, amount } : asset_id)
			}
		}
		return data
	} catch (err) {
		// console.log(err)
		return []
	}
}

export const getAssetConfigNote = async (asset_id) => {
	const url = `${indexerServer}/v2/transactions?asset-id=${asset_id}&tx-type=acfg`
	let transactions
	try {
		transactions = (await fetch(url).then((res) => res.json())).transactions
	} catch (err) {
		console.error(err)
		return null
	}

	// Sort the most recent `acfg` transactions first.
	transactions.sort((a, b) => b['round-time'] - a['round-time'])

	// Attempt to parse each `acf` transaction's note for ARC69 metadata.
	for (const transaction of transactions) {
		try {
			const noteBase64 = transaction.note
			const noteString = atob(noteBase64)
				.trim()
				.replace(/[^ -~]+/g, '')
			const noteObject = JSON.parse(noteString)
			// if (noteObject.standard === 'arc69') {
			return noteObject
			// }
		} catch (err) {
			// Oh well...
		}
	}
	const { success, unit, ...asaBaseInfo } = await getASAInfo(asset_id)
	return {
		standard: 'arc69',
		name: asaBaseInfo?.name,
		description: '',
		media_url: asaBaseInfo?.url,
		mime_type: 'image/png',
		properties: {
			redeemed: 'no',
		},
	}
}
