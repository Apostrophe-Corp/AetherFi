'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import { useEffect, useState } from 'react'
import p from './PseudoLoader.module.css'

const LoadingIndicator = ({ id, currentID }) => {
	return (
		<div
			className={cf(
				s.flex,
				s.flexCenter,
				p.indicatorCon,
				id === currentID ? p.active : ''
			)}
		>
			<div
				className={cf(
					s.flex,
					s.flexCenter,
					p.indicator,
					id === currentID ? p.active : ''
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
		<div className={cf(s.flex, s.flexCenter, p.loadingCon_)}>
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
