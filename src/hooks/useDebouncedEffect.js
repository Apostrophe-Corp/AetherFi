'use client'

import { useEffect, useState, useCallback } from 'react'

export const useDebouncedEffect = (
	callback,
	deps,
	delay,
	cleanUpFunc = null
) => {
	const [debouncedValue, setDebouncedValue] = useState(deps)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue((_) => deps)
		}, delay)
		return () => {
			clearTimeout(handler)
		}
	}, [...deps, delay])

	const debouncedCallback = useCallback(() => {
		callback(debouncedValue)
	}, [debouncedValue])

	useEffect(() => {
		debouncedCallback()
		if (cleanUpFunc) return cleanUpFunc()
	}, [debouncedCallback])
}
