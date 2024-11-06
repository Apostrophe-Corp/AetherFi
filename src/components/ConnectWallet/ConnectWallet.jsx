'use client'

import { useMain } from '@/hooks'
import { Shared as s } from '@/styles'
import { useWallet } from '@txnlab/use-wallet'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { cf, request } from '../../utils'
import { CusImage } from '../CusImage'
import { DottedButton } from '../DottedButton'
import c from './ConnectWallet.module.css'
import UserAddress from './UserAddress'
import { IoMdClose } from 'react-icons/io'
import { BsCopy } from 'react-icons/bs'
import { getActualInputValues, InputField } from '../InputField'

const WalletProvider = ({ activeAccount, provider, address }) => {
	const { userNFD, setUserNFD } = useMain()
	const { getAddress } = useWallet()
	const [avatar, setAvatar] = useState('')
	return !provider.isConnected && activeAccount?.address ? (
		<></>
	) : (
		<div
			className={cf(
				s.wMax,
				s.flex,
				s.spaceXBetween,
				s.spaceYCenter,
				(provider.isConnected && address) || !provider.isConnected
					? s.pointer
					: s.pointerDisabled,
				c.walletProvider,
				!provider.isConnected ? c.walletProvider_ : ''
			)}
			onClick={() => {
				if (!provider.isConnected) {
					provider.connect()
				} else if (provider.isConnected && address) {
					provider.setActiveAccount(address)
				}
			}}
		>
			<div
				className={cf(
					s.flex,
					s.spaceXBetween,
					s.spaceYCenter,
					s.p_relative,
					c.walletProviderInfo,
					s.flexOne
				)}
			>
				{!provider.isConnected ? (
					<Image
						src={provider.metadata.icon}
						alt={`${provider.metadata.name} icon`}
						className={cf(
							s.flex,
							s.p_Relative,
							s.flexCenter,
							c.walletProviderIcon
						)}
						fill
					/>
				) : avatar ? (
					<CusImage
						src={avatar}
						alt={address || 'nft avatar'}
						parentClass={cf(s.flex, s.flexCenter, c.walletCon)}
						imageClass={cf(s.wMax, s.hMax, c.avatar)}
						isLink={false}
						imageProps={{
							quality: 100,
							sizes: '(max-width: 1600px) 10vw, 27px',
						}}
					/>
				) : (
					<div className={cf(s.flex, s.flexCenter, c.walletCon)}>
						<svg
							width='14'
							height='14'
							viewBox='0 0 14 14'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							className={cf(
								s.flex,
								s.p_Relative,
								s.flexCenter,
								c.walletIcon,
								provider.isConnected && activeAccount?.address === address
									? c.connected
									: ''
							)}
						>
							<g id='wallet'>
								<path
									id='Icon'
									fillRule='evenodd'
									clipRule='evenodd'
									d='M6.76592 1.9724C6.48498 1.91969 6.17658 1.91667 5.36663 1.91667H2.33329C2.10317 1.91667 1.91663 2.10322 1.91663 2.33334C1.91663 2.56346 2.10317 2.75 2.33329 2.75H6.99996H8.16663H8.16844L8.23012 2.75L8.33969 2.75C7.89651 2.35149 7.35209 2.08238 6.76592 1.9724ZM2.33329 4.25H6.99996H8.16663C8.80969 4.25 9.05859 4.25162 9.2575 4.27781C10.2352 4.40653 11.0733 4.96476 11.5773 5.7582C10.5233 6.05194 9.74996 7.01899 9.74996 8.16667C9.74996 9.31435 10.5233 10.2814 11.5773 10.5751C11.0733 11.3686 10.2352 11.9268 9.2575 12.0555C9.05859 12.0817 8.80969 12.0833 8.16663 12.0833H6.99996C6.13685 12.0833 5.52394 12.083 5.0408 12.0528C4.56364 12.0229 4.26339 11.966 4.02181 11.875C3.14589 11.5454 2.45461 10.8541 2.12493 9.97815C2.03401 9.73658 1.97707 9.43632 1.94721 8.95917C1.91697 8.47602 1.91663 7.86311 1.91663 7V5.25C1.91663 4.83579 1.58084 4.5 1.16663 4.5C0.752413 4.5 0.416626 4.83579 0.416626 5.25V7L0.416626 7.02506V7.02507C0.416623 7.85756 0.41662 8.51737 0.450138 9.05287C0.484366 9.59973 0.555618 10.0669 0.721073 10.5065C1.2029 11.7867 2.21324 12.7971 3.49344 13.2789C3.93304 13.4443 4.40023 13.5156 4.94709 13.5498C5.4826 13.5833 6.14241 13.5833 6.97492 13.5833H6.99996H8.16663L8.23012 13.5833C8.78864 13.5834 9.1439 13.5834 9.45329 13.5427C11.5848 13.2621 13.262 11.5848 13.5427 9.45334C13.5834 9.14395 13.5834 8.78868 13.5833 8.23016L13.5833 8.16667L13.5833 8.10318C13.5834 7.54466 13.5834 7.18939 13.5427 6.88C13.3111 5.1212 12.1286 3.67166 10.5246 3.06089L10.5166 3.05L10.4466 2.95667L10.4014 2.89636C9.97593 2.3289 9.70226 1.9639 9.37593 1.66483C8.72226 1.06577 7.91397 0.661622 7.04252 0.498124C6.60747 0.416503 6.15126 0.416566 5.44201 0.416663L5.36663 0.41667H2.33329C1.27475 0.41667 0.416626 1.27479 0.416626 2.33334C0.416626 3.39188 1.27475 4.25 2.33329 4.25ZM12.0668 9.14994C12.0822 8.96249 12.0833 8.70028 12.0833 8.16667C12.0833 7.63306 12.0822 7.37085 12.0668 7.1834C11.602 7.26942 11.25 7.67694 11.25 8.16667C11.25 8.65641 11.602 9.06392 12.0668 9.14994Z'
									fill={
										provider.isConnected && activeAccount?.address === address
											? '#038AF1'
											: '#9c9c9c'
									}
								/>
							</g>
						</svg>
					</div>
				)}
				{activeAccount &&
				activeAccount?.address === address &&
				activeAccount?.providerId === provider.metadata.id ? (
					<div
						className={cf(
							s.flex,
							s.flexLeft,
							c.walletProviderDetails,
							provider.isConnected
								? provider.isConnected && activeAccount?.address === address
									? c.isConnected
									: ''
								: c.isConnected
						)}
					>
						<UserAddress
							setUserNFD={setUserNFD}
							address={address}
							isConnected={
								provider.isConnected
									? provider.isConnected && activeAccount?.address === address
									: true
							}
							setAvatar={setAvatar}
						/>
					</div>
				) : (
					<div
						className={cf(
							s.flex,
							s.flexLeft,
							c.walletProviderDetails,
							provider.isConnected
								? provider.isConnected && activeAccount?.address === address
									? c.isConnected
									: ''
								: c.isConnected
						)}
					>
						{address ? (
							<UserAddress
								setUserNFD={() => {}}
								address={address}
								isConnected={
									provider.isConnected
										? provider.isConnected && activeAccount?.address === address
										: true
								}
								setAvatar={() => {}}
							/>
						) : (
							<span
								className={cf(
									s.wMax,
									s.tLeft,
									s.ellipsis,
									c.walletProviderConnectedAccount
								)}
							>
								{provider.metadata.name}
							</span>
						)}

						<span
							className={cf(
								s.wMax,
								s.tLeft,
								s.ellipsis,
								c.walletProviderUserAddress,
								provider.isConnected
									? provider.isConnected && activeAccount?.address === address
										? c.isConnected
										: ''
									: ''
							)}
						>
							Connect {address ? 'Account' : 'Wallet'}
						</span>
					</div>
				)}
			</div>
			{!activeAccount?.address ? (
				<svg
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className={cf(
						s.flex,
						s.flexCenter,
						s.p_relative,
						c.walletProviderChevron
					)}
				>
					<g id='arrow-down'>
						<path
							id='Path 3'
							d='M18 14L12 8L6 14'
							stroke='#038AF1'
							strokeLinecap='round'
						/>
					</g>
				</svg>
			) : (
				<></>
			)}
		</div>
	)
}

const ConnectWallet = ({ showRegister = true }) => {
	const { activeAccount, providers } = useWallet()
	const {
		setUserNFD,
		isTiny,
		logout,
		copyToClipboard,
		vendors,
		showAlert,
		retrievePlatformData,
		showLoading,
	} = useMain()
	const [showAccounts, setShowAccounts] = useState(false)
	const [userIsUnregistered, setUserIsUnregistered] = useState(false)
	const [requestBody, setRequestBody] = useState({})

	const handler = (e) => {
		const name = e.target.name
		const value = e.target.value

		const validators = {
			username: true,
			phone: true,
			address: true,
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
		showLoading()
		// TODO
		const { phone, ...req } = getActualInputValues(requestBody)
		const phone_ = phone.split(' ').join('')
		const res = await request({
			path: 'vendors',
			method: 'post',
			body: {
				phoneNumber: phone_,
				walletAddress: activeAccount?.address,
				...req,
			},
		})
		retrievePlatformData()
		if (res.success) {
			showAlert({
				title: 'Success',
				message: `You've been registered as a Vendor`,
			})
		} else {
			showAlert({
				title: 'Failed',
				message: `Unable to complete registration`,
			})
		}
	}

	useEffect(() => {
		const userExists = vendors.some((el) => el === activeAccount?.address)
		setUserIsUnregistered(() => !userExists)
	}, [activeAccount, vendors])

	return (
		<div className={cf(s.flex, s.flexCenter, c.connectWallet)}>
			<ConnectedWallet />
			{showRegister &&
			activeAccount &&
			activeAccount?.address &&
			userIsUnregistered ? (
				<form
					onSubmit={handleSubmit}
					className={cf(s.flex, s.flexTop, c.form)}
				>
					<span className={cf(s.wMax, s.tCenter, c.reg)}>
						Register as a Vendor
					</span>
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
						tag={'address'}
						state={requestBody}
						handler={handler}
						type={'text'}
						label={'Address'}
						placeholder={''}
						required={true}
					/>
					<button
						type={'submit'}
						className={cf(s.flex, s.flexCenter, c.subBtn)}
					>
						Submit
					</button>
				</form>
			) : (
				<></>
			)}
		</div>
	)
}

export function ConnectedWallet() {
	const { activeAccount, providers } = useWallet()
	const { setUserNFD, isTiny, copyToClipboard } = useMain()
	return (
		<div className={cf(s.wMax, s.flex, s.flexCenter, s.g10, c.wrapOrWrappers)}>
			<div
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					s.g15,
					c.connectWalletProviders
				)}
			>
				{providers?.map((provider) => (
					<div
						className={cf(s.wMax, s.flex, s.flexCenter)}
						key={provider.metadata.id}
					>
						<WalletProvider
							provider={provider}
							activeAccount={activeAccount}
							address={activeAccount?.address}
						/>
					</div>
				))}
			</div>
			{activeAccount && activeAccount?.address ? (
				<>
					{providers
						?.filter((provider) => provider.isConnected && provider.isActive)
						?.map((provider) => (
							<div
								className={cf(
									s.wMax,
									s.flex,
									s.spaceXBetween,
									c.connectWalletDisconnectBox
								)}
							>
								<button
									className={cf(s.flex, s.flexCenter, s.g10, c.copyBtn)}
									onClick={() => copyToClipboard(activeAccount?.address)}
								>
									<BsCopy className={cf(s.dInlineBlock, c.closeIcon)} />
									<span className={cf(s.dInlineBlock)}>Copy Address</span>
								</button>
								<button
									className={cf(s.flex, s.flexCenter, s.g10, c.closeBtn)}
									onClick={async () => {
										setUserNFD((x) => null)
										provider.disconnect()
									}}
								>
									<IoMdClose className={cf(s.dInlineBlock, c.closeIcon)} />
									<span className={cf(s.dInlineBlock)}>Disconnect</span>
								</button>
							</div>
						))}
				</>
			) : (
				<></>
			)}
		</div>
	)
}

export default ConnectWallet
