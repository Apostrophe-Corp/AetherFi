'use client'

import { useMain } from '@/hooks'
import { Shared as s } from '@/styles'
import { useEffect } from 'react'
import { cf } from '../../utils'
import p from './Popups.module.css'

const TopUpAirdropPopUp = () => {
	const { setUAirdrop } = useMain()

	useEffect(() => {
		return () => {
			setUAirdrop(() => ({}))
		}
	}, [])

	return (
		<div
			className={cf(s.flex, s.flexCenter, p.popup, p.pPopup, p.specialPopup)}
		>
			<div
				className={cf(s.flex, s.flexCenter, p.popupTitleBox, p.pPopupTitleBox)}
			>
				<span
					className={cf(
						s.wMax,
						s.flex,
						s.flexCenter,
						s.tCenter,
						s.tTransUpper,
						p.popupTitle
					)}
				>
					Airdrop Top-up
				</span>
				<span
					className={cf(
						s.wMax,
						s.flex,
						s.flexCenter,
						s.tCenter,
						p.popupSubTitle
					)}
				>
					Top up your airdrop to keep the rewards flowing.
				</span>
			</div>
		</div>
	)
}

export default TopUpAirdropPopUp
