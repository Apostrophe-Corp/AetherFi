'use client'

import { cf, truncate } from '@/utils'
import { Container } from '../Container'
import { Shared as s } from '@/styles'
import n from './Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import branding from '@/assets/img/aether.png'
import { useMain } from '@/hooks'
import GetStarted from '../GetStartedBlue/GetStarted'
import { useWallet } from '@txnlab/use-wallet'

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
	const { showConnectWallet, userNFD, showAlert } = useMain()
	const { activeAccount } = useWallet()
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
						tag={'USDC Trasfer & Withdrawal'}
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
						{activeAccount?.address ? userNFD : 'Connect Wallet'}
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
