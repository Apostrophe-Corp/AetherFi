'use client'

import { useMain } from '@/hooks'
import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import n from './not-found.module.css'

export default function NotFound() {
	const { requestedURI } = useMain()
	return (
		<div
			className={cf(s.flex, s.flexCenter, s.flex_dColumn, s.hMax, n.section)}
		>
			<span className={cf(s.wMax, s.tCenter, s.dInlineBlock, n.p404)}>
				<span className={cf(n.p4)}>4</span>
				<span className={cf(n.p0)}>0</span>
				<span className={cf(n.p4)}>4</span>
			</span>
			<span className={cf(s.tCenter, s.dInlineBlock, n.pNote)}>
				{requestedURI ? (
					<span className={cf(s.wMax, s.dInlineBlock, s.tCenter, n.m404)}>
						Dear adventurer,
						<br />
						The path you seek—
						<span className={cf(n.requestedURI)}>
							&quot;{requestedURI}&quot;
						</span>
						;&nbsp;falls beyond the explorable bounds of this platform.
					</span>
				) : (
					(s.tCenter,
					(
						<span className={cf(s.wMax, s.dInlineBlock, s.tCenter, n.m404)}>
							I&apos;m actually not meant to be found, but I guess you&apos;ve
							found me now, lol.
						</span>
					))
				)}
			</span>
		</div>
	)
}
