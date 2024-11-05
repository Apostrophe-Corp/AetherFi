export function deBounce(func, delay) {
	let timeoutID
	return function (...args) {
		if (timeoutID) {
			clearTimeout(timeoutID) // Clears the previous timer
		}
		timeoutID = setTimeout(() => {
			func.apply(this, args) // Calls the original function
		}, delay)
	}
}
