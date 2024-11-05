'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import g from './GetStarted.module.css'
import Link from 'next/link'
import { FaChevronRight } from 'react-icons/fa6'

export default function GetStarted({ link = '/signup' }) {
	return (
		<Link
			href={link}
			className={cf(s.flex, s.flexCenter, s.g5, g.link)}
		>
			<span className={cf(s.dInlineBlock, g.gs)}>Get Started</span>
			<FaChevronRight className={cf(s.dInlineBlock, g.chevron)} />
		</Link>
	)
}
