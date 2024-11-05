'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import { memo, useCallback, useEffect, useState } from 'react'
import { InputField } from '../InputField'
import m from './InputNFDs.module.css'
import { isPossiblePhoneNumber } from 'react-phone-number-input'

const CustomInput = memo(function ({
	i,
	valueState,
	handler,
	placeholder,
	type,
	label,
	hasDopple,
	duplicates,
	useValidator,
}) {
	const [nfdIsValid, setNFDIsValid] = useState(false)

	const validateNFDInput = useCallback(async () => {
		const isValid = await validateNFD(valueState[i])
		setNFDIsValid(() => isValid)
	}, [valueState, i])

	useEffect(() => {
		validateNFDInput()
	}, [validateNFDInput])

	return (
		<InputField
			tag={`${i}`}
			state={valueState}
			handler={handler}
			placeholder={placeholder}
			type={type}
			required={false}
			label={
				i === 0 ? `${label}${hasDopple ? ' (Duplicates detected!)' : ''}` : ''
			}
			cusClass={cf(
				(duplicates[valueState[i]] ?? 0) > 1
					? m.invalid
					: useValidator
					? valueState[i]
						? nfdIsValid
							? m.valid
							: m.invalid
						: ''
					: ''
			)}
		/>
	)
})

export default memo(function InputNFDs({
	setRequestBody,
	tag,
	label,
	placeholder,
	type,
	useValidator = false,
	validTag = 'multiInputsIsValid',
}) {
	const [inputsArray, setInputsArray] = useState([0])
	const [valueArray, setValueArray] = useState([''])
	const [valueState, setValueState] = useState({ 0: '' })
	const [validators, setValidators] = useState({ 0: true })
	const [validValues, setValidValues] = useState([])
	const [hasDopple, setHasDopple] = useState(false)
	const [duplicates, setDuplicates] = useState({})

	const handler = (e) => {
		const index = Number(e.target.name)
		const value = e.target.value
		switch (validators) {
			default:
				if (validators[index]) {
					if (value) {
						setValueState((x) => ({
							...x,
							[index]: value,
						}))
						if (index === inputsArray.length - 1) {
							setValueState((x) => ({
								...x,
								[index]: value,
								[index + 1]: '',
							}))
							setInputsArray((x) => x.concat(index + 1))
							setValidators((x) => ({
								...x,
								[index + 1]: true,
							}))
						} else {
							setValueState((x) => ({
								...x,
								[index]: value,
							}))
						}
					} else {
						if (index === 0) {
							if (inputsArray.length > 1) {
								const xx = Object.keys(valueState)
									.filter((_y, i) => i !== index)
									.reduce((obj, key, i) => {
										obj[i] = valueState[key]
										return obj
									}, {})
								setValueState((_x) => xx)
							} else {
								setValueState((x) => ({
									...x,
									[index]: value,
								}))
							}
						} else {
							const xx = Object.keys(valueState)
								.filter((_y, i) => i !== index)
								.reduce((obj, key, i) => {
									obj[i] = valueState[key]
									return obj
								}, {})
							setValueState((_x) => xx)
						}
					}
				}
		}
	}

	useEffect(() => {
		const doSomething = async () => {
			const keys = Object.keys(valueState)
			const validStates = []
			const dopples = {}
			const array = await Promise.all(
				keys
					.filter((el) => valueState[el])
					.map(async (el, i) => {
						validStates[i] = useValidator
							? isPossiblePhoneNumber(valueState[i])
							: true
						if (dopples[valueState[i]])
							dopples[valueState[i]] = dopples[valueState[i]] + 1
						else dopples[valueState[i]] = 1
						return valueState[el]
					})
			)
			setValueArray((_x) => array)
			const duplicatesExists = Boolean(
				Object.keys(dopples).find((el) => dopples[el] > 1)
			)
			setInputsArray((_x) => (keys.length > 0 ? keys : [0]))
			setValidValues((_x) => validStates)
			setHasDopple((_x) => duplicatesExists)
			setDuplicates((_x) => dopples)
		}
		doSomething()
	}, [valueState])

	useEffect(() => {
		setRequestBody((x) => ({
			...x,
			[tag]: valueArray,
			[validTag]:
				validValues.reduce(
					(acc, next) => (acc === false || next === false ? false : true),
					true
				) && !hasDopple,
		}))
		return () => {
			setRequestBody((x) => ({
				...x,
				[tag]: [],
				[validTag]: false,
			}))
		}
	}, [valueArray, validValues, hasDopple])

	return (
		<div className={cf(s.wMax, s.flex, s.flexCenter)}>
			{inputsArray.map((_el, i) => (
				<div
					className={cf(s.wMax, s.flex, s.flexCenter)}
					key={i}
				>
					<CustomInput
						i={i}
						valueState={valueState}
						handler={handler}
						placeholder={placeholder}
						type={type}
						label={label}
						hasDopple={hasDopple}
						duplicates={duplicates}
						useValidator={useValidator}
					/>
				</div>
			))}
		</div>
	)
})
