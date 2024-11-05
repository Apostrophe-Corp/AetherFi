/**
 * Takes a given number of days and returns an easily readable time period
 * @param {number} days a given number of days
 * @returns {string} a time period
 */
export const getDuration = (days) => {
	if (days < 1) return `Less than a Day`
	const durations = [
		{ value: 1, symbol: 'Day' },
		{ value: 7, symbol: 'Week' },
		{ value: 30, symbol: 'Month' },
		{ value: 356, symbol: 'Year' },
	]
	const duration = durations.findLast((duration) => days >= duration.value)
	const period = Math.round(Number(days) / duration.value)
	const returningPeriod = `${period} ${duration.symbol}${period > 1 ? 's' : ''}`
	return returningPeriod
}
