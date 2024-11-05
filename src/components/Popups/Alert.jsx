'use client'

import cancel from '@/assets/svg/cancel.svg'
import { useMain } from '@/hooks'
import { Shared as s } from '@/styles'
import Image from 'next/image'
import { cf } from '../../utils'
import { DottedButton } from '../DottedButton'
import p from './Popups.module.css'

const Alert = ({ children }) => {
	const {
		alertInfo: { forConfirmation = false, neg, pos, ...alertInfo },
		setShowModal,
		promiseOfConfirmation,
	} = useMain()

	return (
		<div className={cf(s.flex, s.flexCenter, p.popup, p.aPopup)}>
			<div
				className={cf(
					s.wMax,
					s.flex,
					s.flexTop,
					p.popupTitleBox,
					p.aPopupTitleBox
				)}
			>
				<span
					className={cf(
						s.wMax,
						s.flex,
						s.flexOne,
						s.tLeft,
						s.flexLeft,
						p.popupTitle,
						p.aPopupTitle
					)}
				>
					{alertInfo?.title ?? 'Alert!'}
				</span>
			</div>
			<div
				className={cf(s.wMax, s.tLeft, p.popupMessageCon, p.aPopupMessageCon)}
			>
				<span className={cf(s.wMax, s.tLeft, p.popupMessage, p.aPopupMessage)}>
					{alertInfo?.message ?? 'Hi'}
				</span>
				{children}
			</div>
			<div
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					p.popupActionButtonBox,
					p.aPopupActionButtonBox
				)}
			>
				<DottedButton
					cName={cf(
						s.flexOne,
						p.confirmationBtn,
						forConfirmation ? p.firstType : p.nthType
					)}
					tag={forConfirmation ? neg?.tag : 'Okay'}
					isButton={true}
					callback={() => {
						if (promiseOfConfirmation?.reject)
							promiseOfConfirmation.reject(neg?.value)
						setShowModal(() => false)
					}}
				/>
				{forConfirmation ? (
					<DottedButton
						cName={cf(
							s.flexOne,
							p.confirmationBtn,
							forConfirmation ? p.nthType : ''
						)}
						tag={pos?.tag}
						isButton={true}
						callback={() => {
							if (forConfirmation && promiseOfConfirmation?.resolve)
								promiseOfConfirmation.resolve(pos?.value)
							setShowModal(() => false)
						}}
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}

export default Alert
