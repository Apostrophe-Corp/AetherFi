export function truncate(string, displayLength) {
	const truncatedString = `${string.substring(
		0,
		displayLength
	)}...${string.substring(string.length - displayLength)}`
	return truncatedString
}
