'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import Link from 'next/link'
import d from './DottedButton.module.css'

const JsxTag = ({
	children,
	useSpan,
	isButton,
	callback,
	disabled,
	type,
	target,
	cName,
}) => {
	return (
		<>
			{!useSpan ? (
				<>
					{isButton ? (
						<button
							className={cf(d.cName, cName)}
							onClick={callback}
							disabled={disabled}
							type={type}
						>
							{children}
						</button>
					) : (
						<Link
							className={cf(d.cName, cName)}
							href={callback}
							target={target}
						>
							{children}
						</Link>
					)}
				</>
			) : (
				<span className={cf(d.cName, cName)}>{children}</span>
			)}
		</>
	)
}

export default function DottedButton({
	cName = '',
	tag = '',
	isButton = false,
	callback = () => {},
	useSpan = false,
	disabled = false,
	type = 'button',
	target = '_self',
}) {
	return (
		<JsxTag
			useSpan={useSpan}
			isButton={isButton}
			callback={callback}
			disabled={disabled}
			type={type}
			target={target}
			cName={cName}
		>
			<span className={cf(s.flex, s.flexCenter, d.boxSpan)}>
				<svg
					width='9'
					height='9'
					viewBox='0 0 9 9'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className={cf(d.rect)}
				>
					<rect
						x='0.5'
						y='0.5'
						width='8'
						height='8'
						fill='#D9D9D9'
					/>
				</svg>
			</span>
			<span className={cf(s.flex, s.flexCenter, d.span)}>{tag}</span>
		</JsxTag>
	)
}
