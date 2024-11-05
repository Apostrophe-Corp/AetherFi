'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import c from './Container.module.css'

export default function Container({ children }) {
	return (
		<div className={cf(s.wMax, s.flex, s.flexCenter, c.container)}>
			{children}
		</div>
	)
}
