'use client'

import { Shared as s } from '@/styles'
import p from './page.module.css'
import { cf } from '@/utils'
import { Container } from '@/components/Container'
import { ConnectedWallet } from '@/components/ConnectWallet'
import { useEffect, useState } from 'react'
import { getActualInputValues, InputField } from '@/components/InputField'
import { IoGiftOutline } from 'react-icons/io5'
import w from '@/assets/svg/withdraw.svg'
import t from '@/assets/svg/transfer.svg'
import Image from 'next/image'
import { InputNFDs } from '@/components/InputNFDs'
import { useDebouncedEffect } from '@/hooks'

const Transfer = () => {
	const [requestBody, setRequestBody] = useState({})
	const [recipient, setRecipient] = useState({})

	useEffect(() => {
		setRecipient(() => {})
	}, [requestBody.phone])

	useDebouncedEffect(
		async () => {
			const res = await request({
				path: 'user-data',
				method: 'post',
				body: {
					phoneNumber: phone,
				},
			})
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
		console.log({ requestBody })
	}
	return (
		<form
			onSubmit={handleSubmit}
			className={cf(s.flex, s.flexLeft, p.form)}
		>
			<span className={cf(s.wMax, s.tLeft, p.reg)}>Transfer</span>
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.g20, p.inputs)}>
				<InputField
					tag={'username'}
					state={requestBody}
					handler={handler}
					type={'text'}
					label={'Username'}
					placeholder={''}
					required={true}
				/>
				<InputField
					tag={'phone'}
					state={requestBody}
					handler={handler}
					type={'tel'}
					label={'Phone number'}
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

	const handler = (e) => {
		const name = e.target.name
		const value = e.target.value

		const validators = {
			recipient: true,
			pin: true,
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
		console.log({ requestBody })
	}
	return (
		<form
			onSubmit={handleSubmit}
			className={cf(s.flex, s.flexLeft, p.form)}
		>
			<span className={cf(s.wMax, s.tLeft, p.reg)}>Withdraw</span>
			<div className={cf(s.wMax, s.flex, s.flexCenter, s.g20, p.inputs)}>
				<InputField
					tag={'recipient'}
					state={requestBody}
					handler={handler}
					type={'text'}
					label={"Recipient's phone number"}
					placeholder={''}
					required={true}
				/>
				<InputField
					tag={'pin'}
					state={requestBody}
					handler={handler}
					type={'password'}
					label={'4-digit transaction code'}
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
	const [requestBody, setRequestBody] = useState({
		period: { value: 'weekly', label: 'Weekly' },
		beneficiaries: [],
	})
	const [isDisabled, setIsDisabled] = useState(true)

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
		console.log({ requestBody, req, newBeneficiaries })
	}

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
			<button
				type={'submit'}
				className={cf(s.wMax, s.flex, s.spaceXBetween, p.subBtn)}
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

export default function Page() {
	const [view, setView] = useState('transfer')

	return (
		<Container>
			<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
				<span className={cf(s.wMax, s.dInlineBlock, s.tLeft, p.welcome)}>
					Welcome back
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
					<div className={cf(s.flex, s.flexLeft, p.viewPort)}>
						{view === 'transfer' ? (
							<Transfer />
						) : view === 'withdraw' ? (
							<Withdraw />
						) : view === 'airdrop' ? (
							<Airdrop />
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</Container>
	)
}
