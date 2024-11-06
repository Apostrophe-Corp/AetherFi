'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import p from './page.module.css'

export default function Page() {
	return (
		<div className={cf(s.wMax, s.flex, s.flexCenter, p.page)}>
			<span className={cf(s.dInlineBlock, p.comingSoon)}>Coming Soon!</span>
		</div>
	)
}
