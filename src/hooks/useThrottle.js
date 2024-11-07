'use client'

import { useCallback } from 'react'

export const useThrottle = (func, deps, limit) => {
	const throttle = (func, limit) => {
		let lastFunc
		let lastRan

		return function (...args) {
			if (!lastRan) {
				func.apply(this, args)
				lastRan = Date.now()
			} else {
				clearTimeout(lastFunc)
				lastFunc = setTimeout(() => {
					if (Date.now() - lastRan >= limit) {
						func.apply(this, args)
						lastRan = Date.now()
					}
				}, limit - (Date.now() - lastRan))
			}
		}
	}

	const handler = useCallback(func, deps)

	return useCallback(throttle(handler, limit), [handler])
}
