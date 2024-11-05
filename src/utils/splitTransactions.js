export const splitTransactions = (txns) => {
	const batch_ = txns
	const batchLen_ = batch_.length
	const steps_ = Math.ceil(batchLen_ / 16)
	let step_ = 1
	const wrapperTxn = []
	while (step_ <= steps_) {
		const point = (step_ - 1) * 16
		const end = step_ * 16
		const stop = end > batchLen_ ? batchLen_ : end
		let i = point
		const txns = []
		while (i < stop) {
			txns.push(batch_[i])
			i++
		}
		wrapperTxn.push(txns)
		step_++
	}

	return wrapperTxn
}
