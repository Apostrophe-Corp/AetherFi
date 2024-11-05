'use client'

import l from '@/app/_components/_PseudoLoader/PseudoLoader.module.css'
import { Shared as s } from '@/styles'
import { useEffect, useState } from 'react'
import { cf } from '../../utils'
import p from './Popups.module.css'

const LoadingIndicator = ({ id, currentID }) => {
	return (
		<div
			className={cf(
				s.flex,
				s.flexCenter,
				l.indicatorCon,
				id === currentID ? l.active : ''
			)}
		>
			<div
				className={cf(
					s.flex,
					s.flexCenter,
					l.indicator,
					id === currentID ? l.active : ''
				)}
			></div>
		</div>
	)
}

const Loading = () => {
	const [currentID, setCurrentID] = useState(1)

	useEffect(() => {
		let x = setInterval(() => {
			setCurrentID((x) => (x === 5 ? 1 : x + 1))
		}, 300)

		return () => {
			clearInterval(x)
			x = undefined
		}
	}, [])

	return (
		<div className={cf(s.flex, s.flexCenter, p.popup, l.loadingCon)}>
			<LoadingIndicator
				id={1}
				currentID={currentID}
			/>
			<LoadingIndicator
				id={2}
				currentID={currentID}
			/>
			<LoadingIndicator
				id={3}
				currentID={currentID}
			/>
			<LoadingIndicator
				id={4}
				currentID={currentID}
			/>
		</div>
	)
}

export default Loading
