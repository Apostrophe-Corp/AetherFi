export async function asyncFilter(arr, predicate) {
	// Step 1: Map array to promises
	const results = await Promise.all(
		arr.map(async (item) => ({
			item,
			result: await predicate(item),
		}))
	)

	// Step 2: Filter results based on resolved predicate
	return results.filter(({ result }) => result).map(({ item }) => item)
}

// // Example usage:
// const array = [1, 2, 3, 4, 5]

// async function isEven(num) {
// 	// Simulate an async operation
// 	return new Promise((resolve) => {
// 		setTimeout(() => resolve(num % 2 === 0), 100)
// 	})
// }

// asyncFilter(array, isEven).then((filteredArray) => {
// })
