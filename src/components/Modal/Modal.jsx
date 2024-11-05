'use client'

import { useMain } from '@/hooks'
import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import { ConnectWallet } from '../ConnectWallet'
import { Alert, Loading, TopUpAirdrop } from '../Popups'
import m from './Modal.module.css'

const Modal = () => {
	const { modal, showModal, setShowModal, canCloseModal } = useMain()

	const modals = {
		connectWallet: <ConnectWallet />,
		loading: <Loading />,
		alert: <Alert />,
		topUpAirdrop: <TopUpAirdrop />,
	}

	return showModal ? (
		<div className={cf(s.flex, s.flexCenter, s.wMax, s.hMax, m.modal)}>
			<div
				className={cf(
					s.wMax,
					s.flex,
					s.flexCenter,
					s.p_relative,
					m.modalWrapper
				)}
			>
				<div
					className={cf(s.flex, s.wMax, s.hMax, s.p_absolute, m.modalMask)}
					onClick={() => {
						if (canCloseModal) setShowModal(() => false)
					}}
				></div>
				{modals[modal]}
			</div>
		</div>
	) : (
		<></>
	)
}

export default Modal
