'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import Link from 'next/link'
import e from './error.module.css'

export default function Error() {
	return (
		<div
			className={cf(s.flex, s.flexCenter, s.flex_dColumn, s.hMax, e.section)}
		>
			<span className={cf(s.wMax, s.tCenter, s.dInlineBlock, e.p404)}>
				<span className={cf(e.p0)}>U</span>
				<span className={cf(e.p4)}>m</span>
				<span className={cf(e.p4)}>m</span>
			</span>
			<span className={cf(s.wMax, s.tCenter, s.dInlineBlock, e.pNote)}>
				<span className={cf(s.wMax, s.dInlineBlock, s.tCenter, e.m404)}>
					We&apos;re not quite sure what went wrong...
					<br />
					It&apos;ll be great if you could{' '}
					<Link
						href={`mailto:viewreward@3bux.com?&subject=Unexpected%20Error&body=I%20ran%20into%20an%20error%20while...`}
						target={'_top'}
						className={cf(s.dInline)}
					>
						relate to us
					</Link>{' '}
					the actions that led up to this, so that we can get it resolved
					promptly.
				</span>
			</span>
		</div>
	)
}
