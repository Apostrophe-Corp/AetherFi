'use client'

import { useDebouncedEffect } from '@/hooks'
import { refreshRequest, request } from '@/utils'
import { useWallet } from '@txnlab/use-wallet'
import React, { useEffect, useRef, useState } from 'react'

export const AuthContext = React.createContext()

const AuthContextProvider = ({ children }) => {
	const { activeAccount, getAddress } = useWallet()
	const [user, setUser] = useState('')
	const [requestingLogin, setRequestingLogin] = useState(false)
	const [loginRequest, setLoginRequest] = useState(null)

	const refresh = async () => {
		const jwtRes = await refreshRequest(user?.accessToken)
		if (jwtRes?.accessToken) {
			setUser((x) => ({
				...x,
				accessToken: jwtRes?.accessToken,
			}))
			return jwtRes?.accessToken
		}
		return false
	}

	const makeRequest = async (
		{ path = '', method = 'get', body = {}, prop = 'data' } = {},
		upload = false
	) => {
		let xx
		if (user?.accessToken) {
			xx = user?.accessToken
		} else {
			await new Promise((resolve, reject) => {
				setLoginRequest(() => ({ resolve, reject }))
				setRequestingLogin(() => true)
			})
				.then((x) => {
					xx = x
					return
				})
				.catch(() => {
					return
				})
				.finally(() => {
					setLoginRequest(() => null)
					setRequestingLogin(() => false)
				})
		}
		const response = upload
			? await requestUpload({
					path,
					method,
					file: body,
					accessToken: xx,
			  })
			: await request({
					path,
					method,
					body,
					accessToken: xx,
					prop,
			  })
		if (
			response?.error?.statusCode === 401 ||
			response?.status === 401 ||
			response?.message === 'Token has expired'
		) {
			refresh()
			await new Promise((resolve, reject) => {
				setLoginRequest(() => ({ resolve, reject }))
				setRequestingLogin(() => true)
			})
				.then((x) => {
					return x
				})
				.catch(() => {
					return
				})
				.finally(() => {
					setLoginRequest(() => null)
					setRequestingLogin(() => false)
				})
		}

		return response
	}

	const ContextValue = {
		makeRequest,
		user,
		setUser,
		requestingLogin,
		setRequestingLogin,
		loginRequest,
		setLoginRequest,
	}

	const refreshTimerRef = useRef()
	refreshTimerRef.current = undefined
	const [ticker, setTicker] = useState(0)

	useDebouncedEffect(
		(deps) => {
			const [_, user] = deps
			if (user?.accessToken) {
				clearTimeout(refreshTimerRef.current)
				refreshTimerRef.current = undefined
				refreshTimerRef.current = setTimeout(() => {
					refresh()
						.then(() => {})
						.catch(() => {})
						.finally(() => {
							setTicker((x) => x + 1)
						})
				}, 600000)
			}

			return () => {
				clearTimeout(refreshTimerRef.current)
				refreshTimerRef.current = undefined
			}
		},
		[ticker, user],
		1000
	)

	return (
		<AuthContext.Provider value={ContextValue}>{children}</AuthContext.Provider>
	)
}

export default AuthContextProvider
