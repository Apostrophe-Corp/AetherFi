'use client'

import { Shared as s } from '@/styles'
import { cf, getNFD, truncate } from '@/utils'
import { useEffect, useState } from 'react'
import { Skeleton } from '../Skeleton'
import c from './ConnectWallet.module.css'

const UserAddress = ({ setUserNFD, address, isConnected, setAvatar }) => {
	const [connectedAccount, setConnectedAccount] = useState('')

	useEffect(() => {
		const setUpNFD = async (address) => {
			const add = address
			const res = await getNFD(add)
			if (res.success && res?.[add]?.name) {
				setUserNFD(() => res?.[add]?.name)
				if (res?.[add]?.properties?.userDefined?.avatar)
					setAvatar(() => res?.[add]?.properties?.userDefined?.avatar)
				else setAvatar(() => '')
				return res?.[add]?.name
			} else {
				setUserNFD(() => truncate(add, 6))
				setAvatar(() => '')
				return truncate(add, 10)
			}
		}

		const doSomething = async () => {
			const nfd = await setUpNFD(address)
			setConnectedAccount(() => nfd)
		}
		doSomething()
		// checkANSForNames(address)
	}, [address])

	return (
		<span
			className={cf(
				s.wMax,
				s.tLeft,
				s.ellipsis,
				c.walletProviderConnectedAccount,
				!isConnected ? c.notConnected : ''
			)}
		>
			{connectedAccount || (
				<Skeleton
					height={19.8}
					containerClassName={cf(s.wMax)}
				/>
			)}
		</span>
	)
}

export default UserAddress
