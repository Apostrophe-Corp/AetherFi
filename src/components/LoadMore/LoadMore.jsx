'use client'

import roulette from '@/assets/svg/roulette.svg'
import { useMain } from '@/hooks'
import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import Image from 'next/image'
import { useState } from 'react'
import l from './LoadMore.module.css'

/**
 * Options:
 * {getMore:'getMoreAirdrops', noMore:'noMoreAirdrops'},
 * {getMore:'getMoreSoftPools', noMore:'noMorePools'},
 * {getMore:'getMoreUAirdrops', noMore:'noMoreUAirdrops'},
 * {getMore:'getMoreUPools', noMore:'noMoreUPools'},
 * {getMore:'getMoreUAdverts', noMore:'noMoreUAdverts'}
 */
const LoadMore = ({ getMore, noMore }) => {
	const [loading, setLoading] = useState(false)
	const { [getMore]: _getMore, [noMore]: _noMore } = useMain()
	const handleClick = async () => {
		setLoading(() => true)
		await _getMore()
		setLoading(() => false)
	}

	return (
		<div className={cf(s.wMax, s.flex, s.flexCenter, l.loadMoreCon)}>
			<button
				className={cf(
					s.flex,
					s.flexCenter,
					l.loadMore,
					loading ? l.loading : ''
				)}
				onClick={handleClick}
				disabled={_noMore}
			>
				<span className={cf(s.flex, s.flexCenter, l.loadMoreTxt)}>
					{_noMore ? 'No' : 'Load'} more
				</span>
				{!_noMore ? (
					<Image
						src={roulette}
						alt={'load more icon'}
						className={cf(s.flex, s.flexCenter, l.loadMoreIcon)}
					/>
				) : (
					<></>
				)}
			</button>
		</div>
	)
}

export default LoadMore
