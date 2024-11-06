'use client'

import { ADMIN_ADDRESS, NETWORK, USDC } from '@/constants'
import { useAuth, useDebouncedEffect } from '@/hooks'
import {
	deBounce,
	getASAInfo,
	getAssetsByAccount,
	msToTime,
	request,
	splitTransactions,
	trimOverkill,
} from '@/utils'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export const MainContext = React.createContext()

const MainContextProvider = ({ children }) => {
	const { makeRequest, user, setUser, requestingLogin, loginRequest } =
		useAuth()
	const {
		activeAccount,
		signTransactions,
		sendTransactions,
		isReady,
		isActive,
		providers,
		getAddress,
	} = useWallet()
	const pathname = usePathname()
	const router = useRouter()

	const getProviderLimit = () => {
		const currentProvider = providers
			? providers.find((x) => activeAccount?.providerId === x.metadata.id) ?? {}
			: {}
		const providerName = String(
			currentProvider?.metadata?.name ?? ''
		).toLowerCase()
		return providerName === 'pera'
			? 64 // 1000
			: providerName === 'lute'
			? 64 // 500
			: 64
	}

	const [algodClientParams, indexerClientParams] = [
		{
			token: '',
			server: `https://${NETWORK}-api.algonode.cloud`,
			port: '443',
		},
		{
			token: '',
			server: `https://${NETWORK}-idx.algonode.cloud`,
			port: '443',
		},
	]

	const algodClient = new algosdk.Algodv2(
		algodClientParams.token,
		algodClientParams.server,
		algodClientParams.port
	)
	const indexerClient = new algosdk.Indexer(
		indexerClientParams.token,
		indexerClientParams.server,
		indexerClientParams.port
	)

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text)
	}

	const [modal, setModal] = useState('loading')
	const [showModal, setShowModal] = useState(false)
	const [isSmall, setIsSmall] = useState(false)
	const [isTiny, setIsTiny] = useState(false)
	const [dashboardViewIsAdmin, setDashboardViewIsAdmin] = useState(false)
	const [[stage1, setStage1], [stage2, setStage2], [stage3, setStage3]] = [
		useState({
			success: false,
			tag: 'Creation Request',
			description: 'Sending creation request',
			processing: true,
			complete: false,
		}),
		useState({
			success: false,
			tag: 'ALGO Payment',
			description: 'Pending...',
			processing: false,
			complete: false,
		}),
		useState({
			success: false,
			tag: 'Token Transfer',
			description: 'Queued',
			processing: false,
			complete: false,
		}),
	]
	const [optInAsset, setOptInAsset] = useState('')
	const [canCloseModal, setCanCloseModal] = useState(true)
	const [complete, setComplete] = useState(false)
	const [forCreation, setForCreation] = useState(true)
	const [promiseOfConfirmation, setPromiseOfConfirmation] = useState({})
	const [alertInfo, setAlertInfo] = useState({
		title: 'Alert',
		message: `
		 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		 Sed in pharetra orci, in aliquam tellus.
		 Sed consectetur felis elit, nec posuere magna tincidunt vel.
		 Aliquam vel interdum lacus.
		 Morbi nec metus ipsum.
		 Ut eleifend, lacus at lobortis hendrerit, risus libero.
		`,
		forConfirmation: true,
		neg: {
			tag: 'Cancel',
			value: null,
		},
		pos: {
			tag: 'Continue',
			value: true,
		},
	})
	const [response, setResponse] = useState(false)
	const [optInStatus, setOptInStatus] = useState(null)
	const [toppings, setToppings] = useState(0)
	const [showingConnectWalletModal, setShowingConnectWalletModal] =
		useState(false)
	const [roleIsAdmin, setRoleIsAdmin] = useState('')
	const [requestedURI, setRequestedURI] = useState('')
	const [airdrops, setAirdrops] = useState([])
	const [airdropSize, setAirdropSize] = useState(0)
	const [noMoreAirdrops, setNoMoreAirdrops] = useState(false)
	const [userAirdrops, setUserAirdrops] = useState([])
	const [uAirdropsSize, setUAirdropsSize] = useState(0)
	const [noMoreUAirdrops, setNoMoreUAirdrops] = useState(false)
	const [uAirdrop, setUAirdrop] = useState({})
	const [userAddress, setUserAddress] = useState('')
	const [tempAddress, setTempAddress] = useState('')
	const [showMiniNav, setShowMiniNav] = useState(false)
	const [userNFD, setUserNFD] = useState('')
	const [vendors, setVendors] = useState([])
	const [vendorInfo, setVendorInfo] = useState({})

	const sleep = async (ms) =>
		await new Promise((resolve) => setTimeout(resolve, ms))

	const getErrorMessage = (err) => {
		if (typeof err !== 'object' || !Object.keys(err).length) return null
		if (
			(err.hasOwnProperty('message') &&
				err.name === 'DeflyWalletConnectError' &&
				err.message === 'Rejected by user') ||
			(err.name === 'PeraWalletConnectError' &&
				err.message.indexOf('user has rejected the transaction request') !== -1)
		)
			return `Transaction request rejected by user`
		return null
	}

	const showConnectWallet = (canCloseModal = true) => {
		setCanCloseModal(() => canCloseModal)
		setModal(() => 'connectWallet')
		setShowModal(() => true)
	}

	const showLoading = () => {
		setCanCloseModal(() => false)
		setModal(() => 'loading')
		setShowModal(() => true)
	}

	const showOptInProgress = () => {
		setCanCloseModal(() => false)
		setModal(() => 'optInProgress')
		setShowModal(() => true)
	}

	/**
	 *
	 * @param {String} title A string title for the alert
	 * @param {String} message The alert message
	 * @param {Boolean} forConfirmation A boolean indicating whether a prompt should be presented to theh user and a promise returned with the user's resolution
	 * @param {Object} neg An object with two properties-tag and value; used to express the user's negative response
	 * @param {Object} pos An object with two properties-tag and value; used to express the user's positive response
	 */
	const showAlert = async ({
		title = 'Alert',
		message = `
		 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
		 Sed in pharetra orci, in aliquam tellus.
		 Sed consectetur felis elit, nec posuere magna tincidunt vel.
		 Aliquam vel interdum lacus.
		 Morbi nec metus ipsum.
		 Ut eleifend, lacus at lobortis hendrerit, risus libero.
		`,
		forConfirmation = false,
		neg = {},
		pos = {},
	}) => {
		setAlertInfo(() => ({
			title,
			message,
			forConfirmation,
			neg:
				Object.keys(neg).length === 2
					? neg
					: {
							tag: neg?.tag ?? 'Cancel',
							value: neg?.value ?? null,
					  },
			pos:
				Object.keys(pos).length === 2
					? pos
					: {
							tag: pos?.tag ?? 'Continue',
							value: pos?.value ?? true,
					  },
		}))
		setCanCloseModal(() => false)
		setModal(() => 'alert')
		setShowModal(() => true)
		return await new Promise((resolve, reject) => {
			setPromiseOfConfirmation({ resolve, reject })
		})
			.then((e) => {
				return e
			})
			.catch((e) => {
				return e
			})
	}

	const checkOptIn = async (id = 0, address = activeAccount?.address) => {
		id = Number(id)
		if (id === 0) return true
		const algodAccountInfo = await algodClient.accountInformation(address).do()

		const indexerAccountInfo = await indexerClient
			.lookupAccountAssets(address)
			.do()

		const indexerAccountCreatedInfo = await indexerClient
			.lookupAccountCreatedAssets(address)
			.do()

		if (algodAccountInfo?.['created-assets'].length) {
			const isOptedIn = id
				? algodAccountInfo?.['created-assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => Number(el.amount))?.length > 0
				: true
			if (isOptedIn) return isOptedIn
		} else if (indexerAccountCreatedInfo?.assets.length) {
			const isOptedIn = id
				? indexerAccountCreatedInfo?.['assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => Number(el.amount))?.length > 0
				: true
			if (isOptedIn) return isOptedIn
		}

		if (algodAccountInfo?.['assets'].length) {
			const isOptedIn = id
				? algodAccountInfo?.['assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => el?.['amount'])?.length > 0
				: true
			return isOptedIn
		} else if (indexerAccountInfo?.assets.length) {
			const isOptedIn = id
				? indexerAccountInfo?.['assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => el?.['amount'])?.length > 0
				: true
			return isOptedIn
		} else {
			return false
		}
	}

	const handleAssetOptIn = async (assetID) => {
		const algoBal = (await getBalance(0)) / 10 ** 6
		const minimumBal =
			(await getMinimumBal(activeAccount?.address ?? getAddress())) / 10 ** 6
		const hasOptedIn = await checkOptIn(
			assetID,
			activeAccount?.address ?? getAddress()
		)
		if (!hasOptedIn) {
			const asaInfo = await getASAInfo(assetID)
			if (algoBal < minimumBal + 1 + 0.001) {
				showAlert({
					title: 'Asset Opt-in',
					message: `You're not opted-in to the asset: ${
						asaInfo?.name
					} (#${assetID}), and we cannot send you the asset opt-in transaction, as your ALGO balance: ${trimOverkill(
						algoBal,
						3
					)}, minimum balance: ${trimOverkill(
						minimumBal,
						3
					)}, is insufficient to complete this process. Required amount: ${trimOverkill(
						minimumBal + 1 + 0.001,
						3
					)}`,
					forConfirmation: false,
				})
				return false
			}
			setStage1((x) => ({
				...x,
				tag: 'Token Opt-In',
				description: `Awaiting opt-in confirmation...`,
				processing: true,
			}))
			setOptInAsset(() => asaInfo?.unit)
			showOptInProgress(false)
			const waitRoundsToConfirm = 8
			try {
				const suggestedParams = await algodClient.getTransactionParams().do()
				const opInTxn =
					algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
						from: activeAccount?.address ?? getAddress(),
						to: activeAccount?.address ?? getAddress(),
						assetIndex: assetID,
						suggestedParams,
						note: new Uint8Array(
							Buffer.from(
								`Asset opt-in transaction initiated by ViewReward.app | #${Date.now()}-${Math.random()}.`
							)
						),
						amount: 0,
					})

				const encOpInTxn = algosdk.encodeUnsignedTransaction(opInTxn)
				const signedTxn = await signTransactions([encOpInTxn])
				const { id } = await sendTransactions(signedTxn, waitRoundsToConfirm)
				setStage1((x) => ({
					...x,
					processing: false,
					description: `Opt-in confirmed`,
					complete: true,
					success: true,
				}))
				setComplete(() => true)
				await new Promise((resolve) => setTimeout(resolve, 2000))
				showLoading()
				return true
			} catch (err) {
				const errorMessage = getErrorMessage(err)
				setCanCloseModal(() => true)
				setStage1((x) => ({
					...x,
					processing: false,
					description: errorMessage ?? `Opt-in failed`,
					complete: true,
				}))
				return false
			}
		}
		return true
	}

	const handleBatchNFTTransfer = async ({
		nfts,
		from = activeAccount?.address,
		to,
		note,
		txID = null,
		waitRoundsToConfirm = 8,
		callback = null,
	}) => {
		const suggestedParams = await algodClient.getTransactionParams().do()
		const providerLimit = getProviderLimit()
		const assetLength = nfts?.length
		const hops = Math.ceil(assetLength / providerLimit)
		let hop = 1
		let transferredAssets = []
		while (hop <= hops) {
			const point = (hop - 1) * providerLimit
			const end = hop * providerLimit
			const stop = end > assetLength ? assetLength : end
			const batch = nfts.slice(point, stop)
			const batchLen = batch.length
			const steps = Math.ceil(batchLen / 16)
			let step = 1
			const wrapperTxns = []
			while (step <= steps) {
				const point = (step - 1) * 16
				const end = step * 16
				const stop = end > batchLen ? batchLen : end
				let i = point
				const txns = []
				while (i < stop) {
					try {
						const user_aXferTxn =
							algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
								from,
								to,
								assetIndex: batch[i],
								suggestedParams,
								note: new Uint8Array(Buffer.from(note(batch[i]))),
								amount: 1,
							})
						txns.push(user_aXferTxn)
					} catch (err) {
						const errorMessage = getErrorMessage(err)
						// console.log({ err })
					}
					i++
				}
				const txnGroup = algosdk.assignGroupID(txns, activeAccount?.address)
				const lenLen = txnGroup.length
				const encodedTxns = []
				let ii = 0
				while (ii < lenLen) {
					encodedTxns.push(algosdk.encodeUnsignedTransaction(txnGroup[ii]))
					ii++
				}
				wrapperTxns.push(encodedTxns)
				step++
			}

			const signedTxn = await signTransactions(wrapperTxns)
			const txns = splitTransactions(signedTxn)

			await Promise.all(
				txns.map(async (txns) => {
					const sendTxn = txns
					const { id } = await sendTransactions(sendTxn, waitRoundsToConfirm)
					if (txID !== null) txID = id
				})
			)

			transferredAssets = transferredAssets.concat(batch)
			if (callback !== null) {
				callback(transferredAssets)
			}
			hop++
		}
	}

	const handleBatchOptIn = async ({
		assets: assets_ = [],
		ping = true,
		handleOptIn = true,
	}) => {
		const assetsObj = {}
		assets_.map((el) => {
			if (el) assetsObj[el] = el
		})
		const assets = Object.keys(assetsObj).map((el) => Number(el))
		const userAssets = await getAssetsByAccount({
			address: activeAccount?.address,
			withBalance: false,
		})
		const uAssetsObj = {}
		userAssets.map((el) => {
			uAssetsObj[el] = el
		})

		const yetToOptIn = assets.filter((el) => el && !uAssetsObj[el])

		if (!handleOptIn) {
			return yetToOptIn
		}

		if (!yetToOptIn?.length)
			return {
				success: true,
				optIns: [],
				assets,
			}
		const algoBal = (await getBalance(0, activeAccount?.address)) / 10 ** 6
		const minimumBal = (await getMinimumBal(activeAccount?.address)) / 10 ** 6
		if (algoBal < minimumBal + 1.001 + yetToOptIn?.length * 0.101) {
			showAlert({
				title: 'Asset Opt-in',
				message: `You're not opted-in to ${yetToOptIn?.length} assets${
					yetToOptIn?.length > 1 ? 's' : ''
				}, and we cannot send you the asset opt-in transaction, as your ALGO balance: ${trimOverkill(
					algoBal,
					3
				)}, minimum balance: ${trimOverkill(
					minimumBal,
					3
				)}, is insufficient to complete this process. Required amount: ${trimOverkill(
					minimumBal + 1.001 + yetToOptIn?.length * 0.101,
					3
				)}`,
			})
			return {
				success: false,
				optIns: [],
				assets,
			}
		}
		let optedInAssets = [],
			txID = ''
		const waitRoundsToConfirm = 8
		const suggestedParams = await algodClient.getTransactionParams().do()
		try {
			const providerLimit = getProviderLimit()
			const assetLength = yetToOptIn?.length
			const hops = Math.ceil(assetLength / providerLimit)
			let hop = 1
			while (hop <= hops) {
				const point = (hop - 1) * providerLimit
				const end = hop * providerLimit
				const stop = end > assetLength ? assetLength : end
				const batch = yetToOptIn.slice(point, stop)
				const batchLen = batch.length
				const steps = Math.ceil(batchLen / 16)
				let step = 1
				const wrapperTxns = []
				while (step <= steps) {
					const point = (step - 1) * 16
					const end = step * 16
					const stop = end > batchLen ? batchLen : end
					let i = point
					const txns = []
					while (i < stop) {
						try {
							const uniqueNote = `Asset opt-in transaction initiated by ViewReward.app | #${Date.now()}-${Math.random()}.`
							const user_aXferTxn =
								algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
									from: activeAccount?.address,
									to: activeAccount?.address,
									assetIndex: batch[i],
									suggestedParams,
									note: new Uint8Array(Buffer.from(uniqueNote)),
									amount: 0,
								})
							txns.push(user_aXferTxn)
						} catch (err) {
							const errorMessage = getErrorMessage(err)
							// console.log({ err })
						}
						i++
					}
					const txnGroup = algosdk.assignGroupID(txns, activeAccount?.address)
					const lenLen = txnGroup.length
					const encodedTxns = []
					let ii = 0
					while (ii < lenLen) {
						encodedTxns.push(algosdk.encodeUnsignedTransaction(txnGroup[ii]))
						ii++
					}
					wrapperTxns.push(encodedTxns)
					step++
				}

				const signedTxn = await signTransactions(wrapperTxns)
				const txns = splitTransactions(signedTxn)

				await Promise.all(
					txns.map(async (txns) => {
						const sendTxn = txns
						const { id } = await sendTransactions(sendTxn, waitRoundsToConfirm)
						txID = id
					})
				)

				optedInAssets = optedInAssets.concat(batch)
				hop++
			}

			if (ping) {
				showAlert({
					title: 'Asset Opt-in',
					message: `You've successfully opted-in to ${
						optedInAssets?.length
					} assets${optedInAssets?.length > 1 ? 's' : ''}`,
				})
			}
			await new Promise((resolve) => setTimeout(resolve, 2000))
			return {
				success: true,
				txID,
				optIns: optedInAssets,
				assets,
			}
		} catch (err) {
			const errorMessage = getErrorMessage(err)
			// console.log({ err })
			showAlert({
				title: 'Asset Opt-in',
				message: `Unable to process the opt-in to ${
					(yetToOptIn?.length ?? 0) - (optedInAssets?.length ?? 0)
				} assets${
					(yetToOptIn?.length ?? 0) - (optedInAssets?.length ?? 0) > 1
						? 's'
						: ''
				}`,
			})
			return {
				success: false,
				optIns: optedInAssets,
				assets,
			}
		}
	}

	const handleBatchOptOut = async ({
		assets: assets_ = [],
		handleOptOut = true,
		useAssets = true,
		ping = true,
	}) => {
		const assetsObj = {}
		assets_.map((el) => {
			if (el) assetsObj[el] = el
		})
		const assets = Object.keys(assetsObj).map((el) => Number(el))
		const userAssets = await getAssetsByAccount({
			address: activeAccount?.address,
			withBalance: false,
			closableAssets: true,
		})
		const uAssetsObj = {}
		userAssets.map((el) => {
			uAssetsObj[el] = el
		})

		const yetToOptOut = (useAssets ? assets : userAssets).filter(
			(el) => uAssetsObj[el]
		)

		if (!handleOptOut) {
			return yetToOptOut
		}

		if (!yetToOptOut?.length)
			return {
				success: true,
				optOuts: [],
				assets,
			}
		let optedOutAssets = [],
			txID = ''
		const algoBal = (await getBalance(0, activeAccount?.address)) / 10 ** 6
		const minimumBal = (await getMinimumBal(activeAccount?.address)) / 10 ** 6
		if (algoBal < minimumBal + yetToOptOut?.length * 0.001) {
			showAlert({
				title: 'Asset Opt-in',
				message: `You're unable to opt-out of all ${yetToOptIn?.length} assets${
					yetToOptIn?.length > 1 ? 's' : ''
				}, as your ALGO balance: ${trimOverkill(
					algoBal,
					3
				)}, minimum balance: ${trimOverkill(
					minimumBal,
					3
				)}, is insufficient to complete this process. Required amount: ${trimOverkill(
					minimumBal + yetToOptOut?.length * 0.101,
					3
				)}`,
			})
			return {
				success: false,
				optOuts: [],
				assets,
			}
		}
		const waitRoundsToConfirm = 8
		const suggestedParams = await algodClient.getTransactionParams().do()
		try {
			const providerLimit = getProviderLimit()
			const assetLength = yetToOptOut?.length
			const hops = Math.ceil(assetLength / providerLimit)
			let hop = 1
			while (hop <= hops) {
				const point = (hop - 1) * providerLimit
				const end = hop * providerLimit
				const stop = end > assetLength ? assetLength : end
				const batch = yetToOptOut.slice(point, stop)
				const batchLen = batch.length
				const steps = Math.ceil(batchLen / 16)
				let step = 1
				const wrapperTxns = []
				while (step <= steps) {
					const point = (step - 1) * 16
					const end = step * 16
					const stop = end > batchLen ? batchLen : end
					let i = point
					const txns = []
					while (i < stop) {
						try {
							const uniqueNote = `Asset opt-out transaction initiated by ViewReward.app | #${Date.now()}-${Math.random()}.`
							const creator = (await getASAInfo(batch[i]))?.creator ?? ''
							const user_aXferTxn =
								algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
									from: activeAccount?.address,
									to: creator,
									assetIndex: batch[i],
									suggestedParams,
									closeRemainderTo: creator,
									note: new Uint8Array(Buffer.from(uniqueNote)),
								})
							txns.push(user_aXferTxn)
						} catch (err) {
							const errorMessage = getErrorMessage(err)
							// console.log({ err })
						}
						i++
					}
					const txnGroup = algosdk.assignGroupID(txns, activeAccount?.address)
					const lenLen = txnGroup.length
					const encodedTxns = []
					let ii = 0
					while (ii < lenLen) {
						encodedTxns.push(algosdk.encodeUnsignedTransaction(txnGroup[ii]))
						ii++
					}
					wrapperTxns.push(encodedTxns)
					step++
				}

				const signedTxn = await signTransactions(wrapperTxns)
				const txns = splitTransactions(signedTxn)

				await Promise.all(
					txns.map(async (txns) => {
						const sendTxn = txns
						const { id } = await sendTransactions(sendTxn, waitRoundsToConfirm)
						txID = id
					})
				)

				optedOutAssets = optedOutAssets.concat(batch)
				hop++
			}

			if (ping) {
				showAlert({
					title: 'Asset Opt-in',
					message: `You've successfully opted-out of ${
						optedOutAssets?.length
					} assets${optedOutAssets?.length > 1 ? 's' : ''}`,
				})
			}
			await new Promise((resolve) => setTimeout(resolve, 2000))
			return {
				success: true,
				txID,
				optOuts: optedOutAssets,
				assets,
			}
		} catch (err) {
			const errorMessage = getErrorMessage(err)
			// console.log({ err })
			showAlert({
				title: 'Asset Opt-out',
				message: `Unable to process the opt-out of ${
					(yetToOptOut?.length ?? 0) - (optedOutAssets?.length ?? 0)
				} assets${
					(yetToOptOut?.length ?? 0) - (optedOutAssets?.length ?? 0) > 1
						? 's'
						: ''
				}`,
			})
			return {
				success: false,
				optOuts: optedOutAssets,
				assets,
			}
		}
	}

	const getMinimumBal = async (address = activeAccount?.address) => {
		const algodAccountInfo = await algodClient.accountInformation(address).do()

		if (algodAccountInfo?.['min-balance'])
			return algodAccountInfo?.['min-balance']
		else return 0
	}

	const getBalance = async (id = 0, wallet = activeAccount?.address) => {
		if (!wallet) return 0
		id = Number(id)
		const algodAccountInfo = await algodClient.accountInformation(wallet).do()

		const indexerAccountInfo = {}
		let account_assets = []
		let nextToken = ''
		do {
			const res = await indexerClient
				.lookupAccountAssets(wallet)
				.nextToken(nextToken)
				.do()
			account_assets = account_assets.concat(res['assets'])
			nextToken = res['next-token']
		} while (nextToken)
		indexerAccountInfo['assets'] = account_assets

		const indexerAccountCreatedInfo = {}
		let account_assets_ = []
		let nextToken_ = ''
		do {
			const res = await indexerClient
				.lookupAccountCreatedAssets(wallet)
				.nextToken(nextToken_)
				.do()
			account_assets_ = account_assets_.concat(res['assets'])
			nextToken_ = res['next-token']
		} while (nextToken_)
		indexerAccountCreatedInfo['assets'] = account_assets_

		if (id === 0 && algodAccountInfo?.['amount'] !== undefined) {
			return algodAccountInfo?.['amount'] ?? 0
		} else if (algodAccountInfo?.['created-assets'].length) {
			const balance = id
				? algodAccountInfo?.['created-assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => Number(el.amount))?.[0] ?? 0
				: algodAccountInfo?.['amount']
			if (balance) return balance
		} else if (indexerAccountCreatedInfo?.assets.length) {
			const balance = id
				? indexerAccountCreatedInfo?.['assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => Number(el.amount))?.[0] ?? 0
				: algodAccountInfo?.['amount'] ?? 0
			if (balance) return balance
		}

		if (algodAccountInfo?.['assets'].length) {
			const balance = id
				? algodAccountInfo?.['assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => el?.['amount'])?.[0] ?? 0
				: algodAccountInfo?.['amount']
			return balance
		} else if (indexerAccountInfo?.assets.length) {
			const balance = id
				? indexerAccountInfo?.['assets']
						.filter((el) => Number(el['asset-id']) === Number(id))
						.map((el) => el?.['amount'])?.[0] ?? 0
				: algodAccountInfo?.['amount'] ?? 0
			return balance
		} else {
			return 0
		}
	}

	const getAvailBal = async (address = activeAccount?.address) => {
		const actualBal = await getBalance(0, address)
		const minimumBal = await getMinimumBal(address)
		const availBal = Math.round(actualBal - minimumBal - 1000)
		return availBal
	}

	const getAirdrop = async (id, isNFT = false) => {
		if (!id) return { success: false }
		const res = await request({
			path: `${!isNFT ? 'airdrops' : 'nft-airdrop'}/${id}`,
		})
		return res
	}

	const getAirdrops = async (status = 'active') => {
		const res = await request({
			path: `airdrops`,
		})

		if (res.success) {
			setAirdrops(() => res.data.airdrops)
			setNoMoreAirdrops(() => res.data.total === res.data.airdrops.length)
		}
	}

	const getMoreAirdrops = async () => {
		const res = await request({
			path: `all-airdrops?status=active&limit=${airdropSize + 4}`,
		})

		if (res.success && res.data.airdrops.length) {
			const {
				data: { airdrops = [] },
			} = res
			setAirdrops(() => airdrops)
			setAirdropSize(() => airdrops.length)
			setNoMoreAirdrops(() => res.data.total === airdrops.length)
		} else {
			setAirdrops(() => [])
			setAirdropSize(() => 0)
			setNoMoreAirdrops(() => true)
		}
		return res.success && res?.data?.airdrops?.length ? res?.data?.airdrops : []
	}

	const getUserAirdrops = async () => {
		const res1 = await request({
			path: `all-airdrops?userID=${user?.userID}&limit=${
				uAirdropsSize ? uAirdropsSize : 8
			}`,
		})
		if (res1.success) {
			const {
				data: { airdrops = [] },
			} = res1
			setUserAirdrops(() => airdrops)
			setNoMoreUAirdrops(() => res1.data.total === airdrops.length)
		}
	}

	const getMoreUAirdrops = async () => {
		const res = await request({
			path: `all-airdrops?userID=${user?.userID}&limit=${uAirdropsSize + 4}`,
		})

		if (res.success && res.data.airdrops.length) {
			const {
				data: { airdrops = [] },
			} = res
			setUserAirdrops(() => airdrops)
			setUAirdropsSize(() => airdrops.length)
			setNoMoreUAirdrops(() => res.data.total === airdrops.length)
		} else {
			setUserAirdrops(() => [])
			setUAirdropsSize(() => 0)
			setNoMoreUAirdrops(() => true)
		}
		return res.success && res.data.airdrops.length ? res.data.airdrops : []
	}

	const getVendors = async () => {
		const res = await request({
			path: 'vendors',
		})

		if (res.success && res.data?.vendors) {
			const addrs = res.data.vendors.map((el) => el?.walletAddress)
			setVendors(() => addrs)
			const vInfo = (res.data?.vendors ?? []).find(
				(el) => el?.walletAddress === activeAccount?.address
			)
			if (vInfo) setVendorInfo(() => vInfo)
		}
	}

	const retrievePlatformData = async () => {
		getAirdrops('active')
		getVendors()
		if (user?.userID && user?.accessToken) {
			getUserAirdrops()
		}
		if (roleIsAdmin) {
		}
	}

	const hardRetrieval = async () => {
		showLoading()
		let baseRequests = [await getVendors(), await getAirdrops('active')]
		if (user?.userID && user?.accessToken) {
			// baseRequests = baseRequests.concat([await getUserAirdrops()])
		}
		if (roleIsAdmin) {
			// baseRequests = baseRequests.concat([])
		}
		await Promise.all(baseRequests)
			.then(() => true)
			.catch(() => false)
			.finally(() => setShowModal(() => false))
	}

	const transfer = async ({ totalASADue, res }) => {
		showLoading()
		let asaInfo = {}
		if (res.walletAddress) {
			asaInfo = await getASAInfo(USDC)
			const asaBal = (await getBalance(USDC)) / 10 ** asaInfo?.decimals
			if (asaBal < totalASADue) {
				showAlert({
					title: 'Insufficient Balance',
					message: `Insufficient ${asaInfo.unit} balance: ${trimOverkill(
						asaBal,
						2
					)}. Required balance: ${trimOverkill(totalASADue, 2)}`,
				})
				setCanCloseModal(() => true)
				return {
					success: false,
					message: `Insufficient ${asaInfo.unit} balance: ${trimOverkill(
						asaBal,
						2
					)}. Required balance: ${trimOverkill(totalASADue, 2)}`,
				}
			}

			const waitRoundsToConfirm = 8
			const suggestedParams = await algodClient.getTransactionParams().do()
			try {
				let txID = ''
				const user_aXferTxn =
					algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
						amount: Number(
							trimOverkill(
								trimOverkill(totalASADue, 6) * 10 ** asaInfo.decimals,
								0
							)
						),
						assetIndex: Number(USDC ?? 0),
						from: activeAccount?.address,
						note: new Uint8Array(
							Buffer.from(
								`Transfer of ${trimOverkill(
									totalASADue,
									asaInfo?.decimals ?? 0
								)} ${asaInfo?.unit} to ${
									res?.username
								} | #${Date.now()}-${Math.random()}.`
							)
						),
						to: res?.walletAddress,
						suggestedParams,
					})

				const encUser_aXferTxn =
					algosdk.encodeUnsignedTransaction(user_aXferTxn)
				const signedTxn = await signTransactions([encUser_aXferTxn])
				const { id } = await sendTransactions(signedTxn, waitRoundsToConfirm)
				txID = id

				showAlert({
					title: 'Complete',
					message: `Your transfer of ${trimOverkill(
						totalASADue,
						2
					)} USDC is complete.`,
				})
				return txID
			} catch (err) {
				const errorMessage = getErrorMessage(err)
				// console.log({ err })
				showAlert({
					title: 'Failed',
					message: `Your transfer of ${trimOverkill(
						totalASADue,
						2
					)} USDC was unsuccessful.`,
				})
				setCanCloseModal(() => true)
				return {
					success: false,
					message: `Transfer unsuccessful`,
				}
			}
		}
		showAlert({
			title: 'Failed',
			message: `Your transfer of ${trimOverkill(
				totalASADue,
				2
			)} USDC was unsuccessful.`,
		})
		setCanCloseModal(() => true)
		return {
			success: false,
			message: `Transfer unsuccessful`,
		}
	}

	const createAirdrop = async ({
		beneficiaries,
		req,
		totalALGODue,
		totalASADue,
	}) => {
		showLoading()
		const res = await request({
			path: 'airdrops',
			method: 'post',
			body: {
				organizationName: req.org,
				amount: trimOverkill(Number(req.amount), 6),
				beneficiaries: beneficiaries,
				creatorAddress: activeAccount?.address,
				period: req.period,
			},
		})

		if (res.success && res.data?.walletAddress) {
			const algoDec = 10 ** 6
			const waitRoundsToConfirm = 8
			const suggestedParams = await algodClient.getTransactionParams().do()
			const algoBal = (await getBalance(0)) / 10 ** 6
			const minimumBal = (await getMinimumBal(activeAccount?.address)) / 10 ** 6
			let asaInfo = {}
			let asaBal = 0

			if (algoBal < totalALGODue + minimumBal + 0.001) {
				showAlert({
					title: 'Insufficient balance',
					message: `Insufficient ALGO balance: ${trimOverkill(
						algoBal,
						2
					)}. Required balance: ${trimOverkill(
						totalALGODue + minimumBal + 0.001,
						2
					)}`,
				})
				return {
					success: false,
					message: `Insufficient ALGO balance: ${trimOverkill(
						algoBal,
						2
					)}. Required balance: ${trimOverkill(
						totalALGODue + minimumBal + 0.001,
						2
					)}`,
				}
			}

			asaInfo = await getASAInfo(USDC)
			asaBal = (await getBalance(USDC)) / 10 ** asaInfo?.decimals
			if (asaBal < totalASADue) {
				showAlert({
					title: 'Insufficient balance',
					message: `Insufficient ${asaInfo.unit} balance: ${trimOverkill(
						asaBal,
						2
					)}. Required balance: ${trimOverkill(totalASADue, 2)}`,
				})
				return {
					success: false,
					message: `Insufficient ${asaInfo.unit} balance: ${trimOverkill(
						asaBal,
						2
					)}. Required balance: ${trimOverkill(totalASADue, 2)}`,
				}
			}

			try {
				let txID = ''
				const txnsWrapper = []
				const initGroupTxns = []
				const user_PayTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject(
					{
						from: activeAccount?.address,
						amount: Number(
							trimOverkill(trimOverkill(totalALGODue, 6) * algoDec, 0)
						),
						note: new Uint8Array(
							Buffer.from(
								`Payment of ${trimOverkill(
									totalALGODue,
									6
								)} ALGO for airdrop distribution transactional costs on to AetherFi | #${Date.now()}-${Math.random()}.`
							)
						),
						to: res.data?.walletAddress,
						suggestedParams,
					}
				)
				initGroupTxns.push(user_PayTxn)
				const user_aXferTxn =
					Number(USDC) === 0
						? algosdk.makePaymentTxnWithSuggestedParamsFromObject({
								from: activeAccount?.address,
								amount: Math.round(
									trimOverkill(totalASADue, 6) * 10 ** asaInfo.decimals
								),
								note: new Uint8Array(
									Buffer.from(
										`Payment of ${trimOverkill(
											totalASADue,
											asaInfo?.decimals ?? 0
										)} ${
											asaInfo?.unit
										} for airdrop distribution to AetherFi | #${Date.now()}-${Math.random()}.`
									)
								),
								to: res.data?.walletAddress,
								suggestedParams,
						  })
						: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
								amount: Number(
									trimOverkill(
										trimOverkill(totalASADue, 6) * 10 ** asaInfo.decimals,
										0
									)
								),
								assetIndex: Number(USDC ?? 0),
								from: activeAccount?.address,
								note: new Uint8Array(
									Buffer.from(
										`Transfer of ${trimOverkill(
											totalASADue,
											asaInfo?.decimals ?? 0
										)} ${
											asaInfo?.unit
										} for airdrop distribution to AetherFi | #${Date.now()}-${Math.random()}.`
									)
								),
								to: res.data?.walletAddress,
								suggestedParams,
						  })
				initGroupTxns.push(user_aXferTxn)
				const txnGroup1 = algosdk.assignGroupID(
					initGroupTxns,
					activeAccount?.address
				)
				const encodedPayTxn = algosdk.encodeUnsignedTransaction(txnGroup1[0])
				const encUser_aXferTxn = algosdk.encodeUnsignedTransaction(txnGroup1[1])
				txnsWrapper.push(encodedPayTxn)
				txnsWrapper.push(encUser_aXferTxn)
				const signedTxn = await signTransactions([...txnsWrapper])
				const { id } = await sendTransactions(signedTxn, waitRoundsToConfirm)
				txID = id
				const res1 = await makeRequest({
					path: `airdrop/${res1.data?.airdropID}`,
					method: 'patch',
					body: {},
				})
				retrievePlatformData()
				if (res1.success) {
					showAlert({
						title: 'Success',
						message: `Airdrop successfully created`,
					})
					return res1
				}
			} catch (err) {
				const errorMessage = getErrorMessage(err)
				console.log({ err })
				// setCanCloseModal((x) => true)
				showAlert({
					title: 'Failed',
					message: `Unable to create airdrop`,
				})
				return {
					success: false,
					message: `Project top-up unsuccessful`,
				}
			}
		}
		showAlert({
			title: 'Failed',
			message: `Unable to create airdrop`,
		})
	}

	const ContextValue = {
		modal,
		setModal,
		showModal,
		setShowModal,
		isSmall,
		setIsSmall,
		isTiny,
		setIsTiny,
		dashboardViewIsAdmin,
		setDashboardViewIsAdmin,
		stage1,
		setStage1,
		stage2,
		setStage2,
		stage3,
		setStage3,
		optInAsset,
		setOptInAsset,
		canCloseModal,
		setCanCloseModal,
		complete,
		setComplete,
		forCreation,
		setForCreation,
		promiseOfConfirmation,
		setPromiseOfConfirmation,
		alertInfo,
		setAlertInfo,
		response,
		setResponse,
		optInStatus,
		setOptInStatus,
		toppings,
		setToppings,
		showingConnectWalletModal,
		setShowingConnectWalletModal,
		roleIsAdmin,
		setRoleIsAdmin,
		requestedURI,
		setRequestedURI,
		airdrops,
		setAirdrops,
		airdropSize,
		setAirdropSize,
		noMoreAirdrops,
		setNoMoreAirdrops,
		userAirdrops,
		setUserAirdrops,
		uAirdropsSize,
		setUAirdropsSize,
		noMoreUAirdrops,
		setNoMoreUAirdrops,
		uAirdrop,
		setUAirdrop,
		userAddress,
		setUserAddress,
		tempAddress,
		setTempAddress,
		showMiniNav,
		setShowMiniNav,
		sleep,
		showConnectWallet,
		showLoading,
		showOptInProgress,
		showAlert,
		checkOptIn,
		handleAssetOptIn,
		handleBatchNFTTransfer,
		handleBatchOptIn,
		handleBatchOptOut,
		getMinimumBal,
		getBalance,
		getAvailBal,
		getAirdrop,
		getAirdrops,
		getMoreAirdrops,
		getUserAirdrops,
		getMoreUAirdrops,
		retrievePlatformData,
		hardRetrieval,
		userNFD,
		setUserNFD,
		copyToClipboard,
		transfer,
		vendors,
		setVendors,
		getVendors,
		vendorInfo,
		setVendorInfo,
		createAirdrop,
	}

	useEffect(() => {
		if (
			window.innerWidth <= 834 ||
			(window.innerWidth <= 950 &&
				window.innerWidth >= 600 &&
				window.innerHeight <= 440)
		) {
			setIsSmall(() => true)
		} else {
			setIsSmall(() => false)
		}
		if (window.innerWidth <= 481) {
			setIsTiny(() => true)
		} else {
			setIsTiny(() => false)
		}
		let timer = undefined
		timer = setInterval(() => {
			if (
				window.innerWidth <= 834 ||
				(window.innerWidth <= 950 &&
					window.innerWidth >= 600 &&
					window.innerHeight <= 440)
			) {
				setIsSmall(() => true)
			} else {
				setIsSmall(() => false)
			}
			if (window.innerWidth <= 481) {
				setIsTiny(() => true)
			} else {
				setIsTiny(() => false)
			}
		}, 1000)
		const viewReset = () => {
			if (
				window.innerWidth <= 834 ||
				(window.innerWidth <= 950 &&
					window.innerWidth >= 600 &&
					window.innerHeight <= 440)
			) {
				setIsSmall(() => true)
			} else {
				setIsSmall(() => false)
			}
			if (window.innerWidth <= 481) {
				setIsTiny(() => true)
			} else {
				setIsTiny(() => false)
			}
		}
		if (window !== undefined) window.addEventListener('resize', viewReset)
		// showLoading()
		return () => {
			if (window !== undefined) window.removeEventListener('resize', viewReset)
			clearInterval(timer)
			timer = undefined
		}
	}, [])

	const alertForLutePerms = useCallback(
		deBounce(() => {
			const currentProvider = providers
				? providers.find((x) => activeAccount?.providerId === x.metadata.id) ??
				  {}
				: {}
			const providerName = String(
				currentProvider?.metadata?.name ?? ''
			).toLowerCase()

			if (providerName === 'lute') {
				const testPopup = window.open('', '', 'width=100,height=100')
				if (
					!testPopup ||
					testPopup.closed ||
					typeof testPopup.closed === 'undefined'
				)
					showAlert({
						title: 'Pop-up Permission: Lute',
						message: `It's been detected that you're connected to the platform through the Lute Web Wallet, please grant ViewReward.app permissions to show pop-ups. This is required for a smooth flow of operations on the platform.`,
					})
				else testPopup.close()
			}
		}, 300),
		[activeAccount?.providerId, providers]
	)

	useEffect(() => {
		alertForLutePerms()
	}, [alertForLutePerms])

	const timer = useRef()
	useDebouncedEffect(
		() => {
			clearInterval(timer.current)
			timer.current = undefined
			timer.current = setInterval(() => {
				retrievePlatformData()
			}, 120000)
			retrievePlatformData()
		},
		[tempAddress],
		3000,
		() => {
			clearTimeout(timer.current)
			timer.current = undefined
		}
	)

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'instant',
		})
		setShowMiniNav(() => false)
		if (pathname !== '/not-found') {
			setRequestedURI(() => pathname)
		}
	}, [pathname])

	return (
		<MainContext.Provider value={ContextValue}>{children}</MainContext.Provider>
	)
}

export default MainContextProvider
