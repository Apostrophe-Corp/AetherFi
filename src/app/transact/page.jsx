'use client'

import { Shared as s } from '@/styles'
import p from './page.module.css'
import { cf, request, trimOverkill } from '@/utils'
import { Container } from '@/components/Container'
import { ConnectedWallet } from '@/components/ConnectWallet'
import { useEffect, useState } from 'react'
import { getActualInputValues, InputField } from '@/components/InputField'
import { IoGiftOutline } from 'react-icons/io5'
import w from '@/assets/svg/withdraw.svg'
import t from '@/assets/svg/transfer.svg'
import Image from 'next/image'
import { InputNFDs } from '@/components/InputNFDs'
import { useDebouncedEffect, useMain } from '@/hooks'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { useWallet } from '@txnlab/use-wallet'

const Transfer = () => {
	const { transfer } = useMain()
	const { activeAccount } = useWallet()
	const [requestBody, setRequestBody] = useState({})
	const [recipient, setRecipient] = useState({})
	const [isDisabled, setIsDisabled] = useState(true)

	useEffect(() => {
		setRecipient(() => {})
	}, [requestBody.phone])

	useDebouncedEffect(
		async () => {
			const res = await request({
				path: 'user-data',
				method: 'post',
				body: {
					phoneNumber: requestBody.phone,
				},
			})
			console.log({ res })
			if (res.success) {
				setRecipient(() => res?.data)
			}
		},
		[requestBody.phone],
		3000
	)

	const handler = (e) => {
		const name = e.target.name
		const value = e.target.value

		const validators = {
			username: true,
			phone: true,
			amount: true,
		}

		switch (name) {
			case '':
				break
			default:
				if (validators[name]) {
					setRequestBody((x) => ({
						...x,
						[name]: value,
					}))
				}
				break
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		// TODO
		await transfer({
			totalASADue: Number(requestBody?.amount),
			res: recipient,
		})
		console.log({ requestBody })
	}

	useEffect(() => {
		const { phone = '', amount = '' } = requestBody
		const phone_ = phone.split(' ').join('')
		setIsDisabled(
			() =>
				!(
					isPossiblePhoneNumber(phone_) &&
					recipient?.walletAddress &&
					Number(amount)
				)
		)
	}, [recipient, requestBody])

	return (
		<form
			onSubmit={handleSubmit}
			className={cf(s.flex, s.flexLeft, p.form)}
		>
			<span className={cf(s.wMax, s.tLeft, p.reg)}>Transfer</span>
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.g20, p.inputs)}>
				<InputField
					tag={'phone'}
					state={requestBody}
					handler={handler}
					type={'tel'}
					label={`Phone number${
						recipient?.username ? ` (${recipient?.username})` : ''
					}`}
					placeholder={''}
					required={true}
				/>
				<InputField
					tag={'amount'}
					state={requestBody}
					handler={handler}
					type={'number'}
					label={'Amount'}
					placeholder={''}
					required={true}
				/>
			</div>
			<button
				type={'submit'}
				className={cf(s.wMax, s.flex, s.spaceXBetween, p.subBtn)}
				disabled={!(!isDisabled && activeAccount?.address)}
			>
				<span className={cf(s.dInlineBlock)}>Transfer</span>
				<Image
					src={t}
					alt={'transfer icon'}
					className={cf(s.dInlineBlock, p.subIcon)}
				/>
			</button>
		</form>
	)
}

const Withdraw = () => {
	const [requestBody, setRequestBody] = useState({})
	const { showLoading, showAlert } = useMain()

	const handler = (e) => {
		const name = e.target.name
		const value = e.target.value

		const validators = {
			withdrawalCode: true,
		}

		switch (name) {
			case '':
				break
			default:
				if (validators[name]) {
					setRequestBody((x) => ({
						...x,
						[name]: value,
					}))
				}
				break
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		// TODO
		showLoading()
		const res = await request({
			path: 'withdrawals',
			method: 'post',
			body: {
				withdrawalCode: requestBody['withdrawalCode'],
			},
		})
		if (res.success) {
			showAlert({
				title: 'Success',
				message: 'Withdrawal successful',
			})
		} else {
			showAlert({
				title: 'Failed',
				message: 'Withdrawal unsuccessful',
			})
		}
	}
	return (
		<form
			onSubmit={handleSubmit}
			className={cf(s.flex, s.flexLeft, p.form)}
		>
			<span className={cf(s.wMax, s.tLeft, p.reg)}>Withdraw</span>
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.g20, p.inputs)}>
				<InputField
					tag={'withdrawalCode'}
					state={requestBody}
					handler={handler}
					type={'password'}
					label={'Transaction code'}
					placeholder={''}
					required={true}
				/>
			</div>
			<button
				type={'submit'}
				className={cf(s.wMax, s.flex, s.spaceXBetween, p.subBtn)}
				disabled={!requestBody['withdrawalCode']}
			>
				<span className={cf(s.dInlineBlock)}>Withdraw</span>
				<Image
					src={w}
					alt={'withdraw icon'}
					className={cf(s.dInlineBlock, p.subIcon)}
				/>
			</button>
		</form>
	)
}

const Airdrop = () => {
	const { showAlert, showLoading, createAirdrop } = useMain()
	const { activeAccount } = useWallet()
	const [requestBody, setRequestBody] = useState({
		period: { value: 'weekly', label: 'Weekly' },
		beneficiaries: [],
	})
	const [isDisabled, setIsDisabled] = useState(true)
	const [totalASADue, setTotalASADue] = useState(0)
	const [totalALGODue, setTotalALGODue] = useState(0)

	const [claimDurationOptions] = useState([
		{ value: 'daily', label: 'Daily' },
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'monthly', label: 'Monthly' },
	])

	const handler = (e) => {
		const name = e.target.name
		const value = e.target.value

		const validators = {
			org: true,
			amount: true,
			fund: true,
		}

		switch (name) {
			case '':
				break
			default:
				if (validators[name]) {
					setRequestBody((x) => ({
						...x,
						[name]: value,
					}))
				}
				break
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		// TODO
		const { beneficiaries, ...req } = getActualInputValues(requestBody)
		const newBeneficiaries = beneficiaries.map((string) =>
			string.split(' ').join('')
		)

		await createAirdrop({
			beneficiaries: newBeneficiaries,
			req,
			totalALGODue,
			totalASADue,
		})

		console.log({ requestBody, req, newBeneficiaries })
	}

	useEffect(() => {
		const { amount = '', fund = '' } = requestBody
		const amt = Number(amount)
		const total = Number(fund)

		const totalA = total && amt ? Math.ceil(total / amt) : 0
		setTotalALGODue(() => trimOverkill(totalA * 0.001, 6))
		setTotalASADue(() => trimOverkill(total, 6))
	}, [requestBody])

	useEffect(() => {
		const { org } = requestBody
		setIsDisabled(() => !(org && totalALGODue && totalASADue))
	}, [requestBody, totalALGODue, totalASADue])

	return (
		<form
			onSubmit={handleSubmit}
			className={cf(s.flex, s.flexLeft, p.form)}
		>
			<span className={cf(s.wMax, s.tLeft, p.reg)}>Create Airdrop</span>
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.g20, p.inputs)}>
				<InputField
					tag={'org'}
					state={requestBody}
					handler={handler}
					type={'text'}
					label={'Name of organization'}
					placeholder={''}
					required={true}
				/>

				<InputField
					tag={'period'}
					state={requestBody}
					type={'select'}
					selectOptions={claimDurationOptions}
					label={'Distribution Interval'}
					required={true}
					setState={setRequestBody}
					useCustomSelect={true}
					// disabled={Boolean(getInputValue('sameAsCreator', requestBody))}
				/>
				<InputNFDs
					setRequestBody={setRequestBody}
					tag={'beneficiaries'}
					label={'Beneficiaries (Leave empty to send to all)'}
					type={'tel'}
					placeholder={''}
					useValidator={true}
					validTag={'phonesAreValid'}
				/>
				<InputField
					tag={'amount'}
					state={requestBody}
					handler={handler}
					type={'number'}
					label={'Amount per individual'}
					placeholder={''}
					required={true}
				/>
				<InputField
					tag={'fund'}
					state={requestBody}
					handler={handler}
					type={'number'}
					label={'Total Airdrop Fund'}
					placeholder={''}
					required={true}
				/>
			</div>
			<span className={cf(s.wMax, s.dInlineBlock, p.quote)}>
				Amount Due: {totalASADue} USDC {'&'} {totalALGODue} ALGO
			</span>
			<button
				type={'submit'}
				className={cf(s.wMax, s.flex, s.spaceXBetween, p.subBtn)}
				disabled={isDisabled}
			>
				<span className={cf(s.dInlineBlock)}>Create</span>
				<IoGiftOutline className={cf(s.dInlineBlock, p.subIcon)} />
			</button>
		</form>
	)
}

const Navigator = ({ tag, setView, currentView, view }) => {
	return (
		<button
			type={'button'}
			className={cf(
				s.wMax,
				s.flex,
				s.flexLeft,
				p.navBtn,
				currentView === view ? p.navActive : ''
			)}
			onClick={() => setView(() => view)}
		>
			{tag}
		</button>
	)
}

const Airdrop_ = ({ x }) => {
	return (
		<div className={cf(s.wMax, s.flex, s.flexCenter, p.airdrop_)}>
			<span className={cf(s.wMax, s.dInlineBlock, p.airSpan)}>
				<span className={cf(p.title)}>Airdrop by</span>
				{x?.organizationName}
			</span>
			<span className={cf(s.wMax, s.dInlineBlock, p.airSpan)}>
				{x?.amount} USDC to{' '}
				{x?.beneficiaries?.length ? x?.beneficiaries?.length : 'all '}users{' '}
				{x?.period}.
			</span>
		</div>
	)
}

export default function Page() {
	const [view, setView] = useState('transfer')
	const { vendorInfo, airdrops } = useMain()

	return (
		<Container>
			<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
				<span className={cf(s.wMax, s.dInlineBlock, s.tLeft, p.welcome)}>
					Welcome back{' '}
					{vendorInfo?._id ? `(Vendor ID: ${vendorInfo?._id})` : ''}
				</span>
				<div className={cf(s.wMax, s.flex, s.flexTop, p.wrapper)}>
					<div className={cf(s.flex, s.flexLeft, s.flex_dColumn, p.navigator)}>
						<ConnectedWallet />
						<div className={cf(s.wMax, s.flex, s.flexCenter, p.navigators)}>
							<Navigator
								tag={'Transfer'}
								setView={setView}
								view={'transfer'}
								currentView={view}
							/>
							<Navigator
								tag={'Withdraw'}
								setView={setView}
								view={'withdraw'}
								currentView={view}
							/>
							<Navigator
								tag={'Airdrop'}
								setView={setView}
								view={'airdrop'}
								currentView={view}
							/>
						</div>
					</div>
					<div className={cf(s.flex, s.spaceXBetween, p.viewPort)}>
						{view === 'transfer' ? (
							<Transfer />
						) : view === 'withdraw' ? (
							<Withdraw />
						) : view === 'airdrop' ? (
							<Airdrop />
						) : (
							<></>
						)}
						<div className={cf(s.flex, s.flexTop, p.airdrops)}>
							{airdrops?.length ? (
								airdrops.map((el) => (
									<Airdrop_
										x={el}
										key={el?._id}
									/>
								))
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			</div>
		</Container>
	)
}
