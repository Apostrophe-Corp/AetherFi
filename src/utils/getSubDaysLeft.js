export function getSubDaysLeft(renewalTimestamp, daysRenewed) {
	// Create a Date object from the ISO string timestamp
	const renewalDate = new Date(renewalTimestamp) // No need for conversion here

	// Calculate the end date by adding the renewal days to the renewal date
	const endDate = new Date(renewalDate)
	endDate.setDate(renewalDate.getDate() + daysRenewed)

	// Get the current date
	const currentDate = new Date()

	// Calculate the time difference between the end date and the current date (in milliseconds)
	const timeDifference = endDate - currentDate

	// Convert the time difference from milliseconds to days
	const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

	// Return the days remaining, if negative, return 0 (subscription expired)
	return daysRemaining > 0 ? daysRemaining : 0
}
