'use client'

import { Shared as s } from '@/styles'
import { cf, nFormatter } from '@/utils'
import Image from 'next/image'
import p from './page.module.css'
import { useMain } from '@/hooks'
import users from '@/assets/img/users.avif.png'
import base from '@/assets/img/base.png'
import { GetStartedBlue } from '@/components/GetStartedBlue'
import shield from '@/assets/svg/shield-heart.svg.svg'
import Link from 'next/link'
import { Container } from '@/components/Container'

const Home = () => {
	const { isSmall, isTiny, showConnectWallet } = useMain()
	return (
		<div className={cf(s.wMax, s.flex, s.flexTop, p.page)}>
			{/* Top Section */}
			<Container>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, p.bannerCon)}>
					<div
						className={cf(
							s.flex,
							s.flexLeft,
							s.flex_dColumn,
							isSmall ? s.wMax : s.flexOne,
							p.b1
						)}
					>
						<div
							className={cf(
								s.wMax,
								s.flex,
								isSmall ? s.flexCenter : s.flexLeft,
								p.bSection
							)}
						>
							<div className={cf(s.flex, s.flexCenter, p.usersCon)}>
								<Image
									src={users}
									alt={'users image'}
									className={cf(p.usersImg)}
								/>
								<span className={cf(s.dInlineBlock, p.usersTxt)}>
									10K+ users worldwide
								</span>
							</div>
						</div>
						<div
							className={cf(
								s.wMax,
								s.flex,
								isSmall ? s.flexCenter : s.flexLeft,
								p.bSection
							)}
						>
							<span className={cf(s.dInlineBlock, p.bText)}>
								Empowering Payments Beyond Borders — No Internet Required.
							</span>
						</div>
						<div
							className={cf(
								s.wMax,
								s.flex,
								isSmall ? s.flexCenter : s.flexLeft,
								p.bSection
							)}
						>
							<span className={cf(s.dInlineBlock, p.bMiniText)}>
								With AetherFi, make seamless payments on the Algorand blockchain
								using only USSD. Accessible, secure, and designed for everyone.
							</span>
						</div>
						<div
							className={cf(
								s.wMax,
								s.flex,
								isSmall ? s.flexCenter : s.flexLeft,
								p.bSection
							)}
						>
							<div className={cf(s.flex, s.flexCenter, s.g15, p.bBtnCon)}>
								<GetStartedBlue />
								<Link
									href={'/vendors'}
									className={cf(s.flex, s.flexCenter, p.bLink)}
								>
									Vender&apos;s Portal
								</Link>
							</div>
						</div>
						{!isSmall ? (
							<div
								className={cf(
									s.wMax,
									s.flex,
									isSmall ? s.flexCenter : s.flexLeft,
									s.g15,
									p.bSection
								)}
							>
								<Image
									src={shield}
									alt={'shield'}
									className={cf(s.dInlineBlock, p.shield)}
								/>
								<span className={cf(s.dInlineBlock, p.bPrivacy)}>
									Our customer privacy is top priority
								</span>
							</div>
						) : (
							<></>
						)}
					</div>
					<div className={cf(s.flex, s.flexBottom, p.b2)}>
						<Image
							src={base}
							alt={'phone cropped'}
							className={cf(s.flex, s.flexCenter, p.baseImage)}
						/>
					</div>
				</div>
			</Container>
		</div>
	)
}

export default Home
