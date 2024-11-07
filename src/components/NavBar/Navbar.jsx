'use client'

import { cf, getNFD, truncate } from '@/utils'
import { Container } from '../Container'
import { Shared as s } from '@/styles'
import n from './Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import branding from '@/assets/img/aether.png'
import { useMain } from '@/hooks'
import GetStarted from '../GetStartedBlue/GetStarted'
import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'

const Action = ({ isButton, callback, tag, cName }) => {
	const Wrapper = () =>
		isButton ? (
			<button
				className={cf(cName)}
				onClick={callback}
			>
				{tag}
			</button>
		) : (
			<Link
				className={cf(cName)}
				href={callback}
			>
				{tag}
			</Link>
		)

	return <Wrapper />
}

export default function Navbar() {
	const { showConnectWallet, userNFD, showAlert, setUserNFD, isSmall, isTiny } =
		useMain()
	const { activeAccount } = useWallet()
	const [connectedAccount, setConnectedAccount] = useState(null)

	useEffect(() => {
		const setUpNFD = async (address) => {
			const add = address
			const res = await getNFD(add)
			if (res.success && res?.[add]?.name) {
				setUserNFD(() => res?.[add]?.name)
				if (res?.[add]?.properties?.userDefined?.avatar) return res?.[add]?.name
			} else {
				setUserNFD(() => truncate(add, 6))
				return truncate(add, 6)
			}
		}

		const doSomething = async () => {
			const nfd = await setUpNFD(activeAccount?.address ?? '')
			setConnectedAccount(() => nfd)
		}
		doSomething()
		// checkANSForNames(address)
	}, [activeAccount])

	return (
		<Container>
			<div className={cf(s.wMax, s.flex, s.spaceXBetween, n.parent)}>
				<div className={cf(s.flex, s.flexCenter, n.firstPart)}>
					<Link
						href={'/'}
						className={cf(n.branding)}
					>
						<Image
							src={branding}
							alt={'branding'}
							className={n.brandingImage}
						/>
					</Link>
					<Action
						isButton={false}
						callback={'/transact'}
						tag={'USDC Transfer & Withdrawal'}
						cName={cf(n.action)}
					/>
					<Action
						isButton={true}
						callback={() => {
							showAlert({
								title: 'USSD Only Feature',
								message: `Dear user, Ajo is currently only available through our USSD service.`,
								forConfirmation: false,
							})
						}}
						tag={'Ajo'}
						cName={cf(n.action)}
					/>
					<Action
						isButton={false}
						callback={'/transact'}
						tag={'Airdrops'}
						cName={cf(n.action)}
					/>
				</div>
				<div className={cf(s.flex, s.flexCenter, s.g15, n.secondPart)}>
					<button
						className={cf(s.flex, s.flexCenter, n.connectWallet)}
						onClick={() => showConnectWallet()}
					>
						{connectedAccount ?? 'Connect Wallet'}
					</button>
					{/* <GetStarted /> */}
				</div>
			</div>
		</Container>
	)
}

export function MiniNav() {
	return <></>
}
