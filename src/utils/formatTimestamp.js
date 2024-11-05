export function formatTimestamp(unixTimestamp) {
	const tag = {
		1: 'st',
		2: 'nd',
		3: 'rd',
		4: 'th',
		5: 'th',
		6: 'th',
		7: 'th',
		8: 'th',
		9: 'th',
		0: 'th',
	}
	// Create a new Date object from the Unix timestamp (in milliseconds)
	const date = new Date(unixTimestamp)

	// Options for formatting the time
	const timeOptions = {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}

	// Options for formatting the date
	const dateOptions = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	}

	// Format the time and date
	const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions)
	const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions)

	// Get the time and date as strings
	const time = timeFormatter.format(date)
	const dayMonth = dateFormatter.format(date)

	// Combine the time and date into the desired format
	return [`${time}, ${dayMonth}`, `${tag[dayMonth[dayMonth.length - 1]]}`]
}

// Example usage:
// const unixTimestamp = Date.now() // Example timestamp
// console.log(formatTimestamp(unixTimestamp))
// // Output: "8:30 PM, Thursday, December 5"

// console.log(Date.now())
