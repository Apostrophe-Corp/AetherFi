import { NETWORK } from '@/constants'
import algosdk from 'algosdk'
import axios from 'axios'
import { base58btc } from 'multiformats/bases/base58'
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

const getAsset = async (assetID) => {
	const asset = await algodClient.getAssetByID(assetID).do()
	return asset
}

export const algonodeClientFetch = async function (assetID) {
	assetID = Number(assetID)
	try {
		let res = await getAsset(assetID)
		if (!res.asset || !res.asset.params) return { success: false }
		let arc3Parsed = {}

		const _name = String(res.asset.params.name)
		const _url = String(res.asset.params.url)
		if (
			_name === 'arc3' ||
			_name.slice(_name.length >= 5 ? _name.length - 5 : 0, _name.length) ===
				'@arc3' ||
			_url.slice(_url.length >= 5 ? _url.length - 5 : 0, _url.length) ===
				'#arc3'
		) {
			const link =
				_url.indexOf('ipfs://') === 0
					? 'https://gateway.ipfs.io/ipfs/' +
					  _url.slice(7).replace(/{id}/g, res.index)
					: _url.replace(/{id}/g, res.index)
			let arc3Res = await axios.get(link)
			if (arc3Res.headers.getContentType().indexOf('application/json') !== -1) {
				arc3Parsed = { ...arc3Res.data }
			}
		}

		let myJsonParsed = {}
		if (
			res.asset.params.reserve &&
			res.asset.params.reserve !==
				'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ' &&
			_url.indexOf('template-') === 0
		) {
			let account = algosdk.decodeAddress(res.asset.params.reserve)

			let newArray = new Uint8Array(34)

			newArray[0] = 18
			newArray[1] = 32
			let i = 2
			account.publicKey.forEach((byte) => {
				newArray[i] = byte
				i++
			})
			let encoded = base58btc.baseEncode(newArray)

			let myJson = await axios.get(
				'https://ipfs.io/ipfs/' + encoded + '#x-ipfs-companion-no-redirect'
			)
			myJsonParsed =
				myJson.headers.getContentType().indexOf('application/json') !== -1
					? myJson.data
					: myJson.headers.getContentType().indexOf('image') !== -1
					? {
							image:
								'https://ipfs.io/ipfs/' +
								encoded +
								'#x-ipfs-companion-no-redirect',
					  }
					: { ...myJson.data }
		}

		const returnObj = res.asset.params
			? Object.keys(myJsonParsed).length
				? Object.keys(arc3Parsed).length
					? {
							...myJsonParsed,
							...arc3Parsed,
							...res.asset.params,
							unit: res.asset.params?.['unit-name'] ?? res.asset.params?.unit,
							success: true,
							isARC69: false,
					  }
					: {
							...myJsonParsed,
							...res.asset.params,
							unit: res.asset.params?.['unit-name'] ?? res.asset.params?.unit,
							success: true,
							isARC69: false,
					  }
				: Object.keys(arc3Parsed).length
				? {
						...res.asset.params,
						...arc3Parsed,
						unit: res.asset.params?.['unit-name'] ?? res.asset.params?.unit,
						success: true,
						isARC69: false,
				  }
				: {
						...res.asset.params,
						unit: res.asset.params?.['unit-name'] ?? res.asset.params?.unit,
						success: true,
						isARC69: true,
				  }
			: { success: false }
		return returnObj
	} catch (e) {
		return { success: false }
	}
}
