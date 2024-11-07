'use client'

import { useMain } from '@/hooks'
import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import f from './Footer.module.css'
import { Container } from '../Container'

const CustomLink = ({ to, target, localLink = false, children, className }) => {
	const router = useRouter()
	const handleRedirect = () =>
		localLink ? router.push(to) : window.open(to, target ?? '_blank')

	return (
		<span
			className={cf(
				s.flex,
				s.flexCenter,
				s.pointer,
				f.pseudoFooterSocial,
				// s.p_relative,
				// 'toolTip',
				className
			)}
			// data-title={to}
			onClick={handleRedirect}
		>
			{children}
		</span>
	)
}

const Footer = () => {
	const { isSmall, isTiny } = useMain()
	return (
		<div
			className={cf(
				s.wMax,
				s.flex,
				s.flexCenter,
				s.p_relative,
				s.container,
				f.footer
			)}
		>
			<Container>
				<div className={cf(s.wMax, s.flex, s.spaceXBetween, f.inner)}>
					<span className={cf(s.dInlineBlock, f.aetherfi)}>AetherFi</span>
					<span className={cf(s.dInlineBlock, f.rights)}>
						&copy; Apostrophe Corp. • 2024
					</span>
				</div>
			</Container>
		</div>
	)
}

export default Footer
