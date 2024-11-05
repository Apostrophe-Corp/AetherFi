'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import { useRef, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import Select from 'react-select'
import i from './InputField.module.css'

export function getInputValue(prop, requestBody) {
	const el = requestBody[prop]
	if (typeof el === 'object' && el.hasOwnProperty('value')) {
		return el.value
	} else {
		return el
	}
}

export function getActualInputValues(requestBody) {
	let i = 0
	const keys = Object.keys(requestBody)
	const length = keys.length,
		reqBody = {}
	for (i; i < length; i++) {
		const el = requestBody[keys[i]]
		if (typeof el === 'object' && el && el.hasOwnProperty('value')) {
			reqBody[keys[i]] = el.value
		} else {
			reqBody[keys[i]] = el
		}
		if (
			Array.isArray(el) &&
			el?.length &&
			typeof el[0] === 'object' &&
			el[0].hasOwnProperty('value')
		) {
			reqBody[keys[i]] = []
			let o = 0
			const keys_ = Object.keys({ label: true, value: true })
			const length = keys_.length
			for (o; o < length; o++) {
				if (typeof el[o] === 'object' && el[o].hasOwnProperty('value')) {
					reqBody[keys[i]].push(el[o].value)
				}
			}
		} else if (Array.isArray(el)) {
			reqBody[keys[i]] = el
		}
	}

	return reqBody
}

export const SelectOption = ({ selection, setValue, label, value, name }) => {
	return (
		<button
			className={cf(
				s.flex,
				s.flexCenter,
				i.selectionOption,
				selection?.value === value ? i.selected : ''
			)}
			type={'button'}
			onClick={() => {
				setValue((x) => ({
					...x,
					[name]: { label, value },
				}))
			}}
		>
			{label}
		</button>
	)
}

export const InputFieldCon = ({ oClass = '', children }) => {
	return (
		<div
			className={cf(
				s.wMax,
				s.flex,
				s.spaceXBetween,
				s.spaceYEnd,
				s.inputFieldCon,
				oClass
			)}
		>
			{children}
		</div>
	)
}

export const Label = ({
	tag,
	label,
	mini = false,
	required = true,
	children,
}) => {
	return (
		<label
			htmlFor={`${tag}`}
			className={cf(
				s.wMax,
				s.flex,
				s.flexLeft,
				s.tLeft,
				i.label_,
				s.p_relative,
				mini ? i.mini : ''
			)}
		>
			<label
				className={cf(s.wMax, s.tLeft, s.m0, s.p0, i.innerLabel)}
				htmlFor={`${tag}`}
			>
				{label}{' '}
				{required ? <span className={cf(i.requiredMark)}>*</span> : <></>}
			</label>
			{children}
		</label>
	)
}

const InputField = ({
	tag,
	state,
	setState,
	handler,
	type,
	placeholder,
	mini = false,
	required = true,
	selectOptions = null,
	isMulti = false,
	label = '',
	useTextarea = false,
	rows = 4,
	dopple = false,
	useCustomSelect = false,
	cusClass,
	...props
}) => {
	const [isPassword] = useState(type === 'password')
	const [visible, setVisible] = useState(false)
	const inputRef = useRef()

	return type === 'select' ? (
		<label
			htmlFor={`${tag}`}
			className={cf(s.wMax, s.flex, s.flexLeft, mini ? i.mini : '')}
		>
			<label
				className={cf(s.wMax, s.tLeft, s.m0, s.p0, i.innerLabel)}
				htmlFor={`${tag}`}
			>
				{label}{' '}
				{required ? <span className={cf(i.requiredMark)}>*</span> : <></>}
			</label>
			{!useCustomSelect ? (
				<Select
					placeholder={placeholder}
					name={tag}
					onChange={handler}
					options={selectOptions}
					value={dopple ? state[tag.slice(0, tag.length - 1)] : state[tag]}
					isMulti={isMulti}
					isSearchable={false}
					classNamePreFix={'react-select'}
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXBetween,
						s.spaceYCenter,
						s.p0,
						i.select,
						isMulti ? i.ignoreHeight : ''
					)}
					classNames={{
						control: () =>
							cf(s.wMax, s.flex, s.m0, s.bNone, i.input, i.selectControl_),
						option: () => cf(s.wMax, s.flex, s.flexLeft, s.p5, i.selectOption),
						valueContainer: () => cf(s.p0, i.valueContainer),
						selectControl: () => cf(i.selectControl_),
						indicatorsContainer: () => cf(s.p0, s.m0, i.indicatorsContainer),
						placeholder: () => cf(i.placeholder),
						menu: () => cf(i.menu),
					}}
					{...props}
				/>
			) : (
				<>
					<div
						className={cf(s.wMax, s.flex, s.flexLeft, i.selectionOptionWrapper)}
					>
						{selectOptions?.length ? (
							selectOptions.map((el, i) => (
								<SelectOption
									name={tag}
									setValue={setState}
									label={el?.label}
									value={el?.value}
									selection={state[tag]}
									key={i}
								/>
							))
						) : (
							<></>
						)}
					</div>
				</>
			)}
		</label>
	) : (
		<label
			htmlFor={`${tag}`}
			className={cf(
				s.wMax,
				s.flex,
				s.flexLeft,
				s.tLeft,
				i.label_,
				mini ? i.mini : '',
				type === 'range' || type === 'date' ? i.ignoreHeight : ''
			)}
		>
			<label
				className={cf(s.wMax, s.tLeft, s.m0, s.p0, i.innerLabel)}
				htmlFor={`${tag}`}
			>
				{label}{' '}
				{required ? <span className={cf(i.requiredMark)}>*</span> : <></>}
			</label>
			{!useTextarea ? (
				<div
					className={cf(
						s.wMax,
						s.flex,
						s.spaceXBetween,
						s.p_relative,
						s.spaceYCenter
					)}
				>
					<input
						id={`${tag}`}
						name={`${tag}`}
						type={`${isPassword ? (visible ? 'text' : type) : type}`}
						placeholder={placeholder}
						ref={inputRef}
						className={cf(
							s.flex,
							i.input_,
							isPassword ? i.password : '',
							type === 'date' && state[tag] ? i.filled : '',
							s.wMax,
							cusClass
						)}
						onChange={handler}
						value={
							(dopple ? state[tag.slice(0, tag.length - 1)] : state[tag]) || ''
						}
						required={required}
						onWheel={type === 'number' ? (e) => e.target.blur() : undefined}
						{...props}
					/>
					{isPassword ? (
						!visible ? (
							<FaRegEye
								onClick={() => setVisible(() => true)}
								className={cf(s.flex, s.pointer, i.setVisible)}
							/>
						) : (
							<FaRegEyeSlash
								onClick={() => setVisible(() => false)}
								className={cf(s.flex, s.pointer, i.setVisible)}
							/>
						)
					) : (
						<></>
					)}
				</div>
			) : (
				<textarea
					id={`${tag}`}
					name={`${tag}`}
					type={`${isPassword ? (visible ? 'text' : type) : type}`}
					placeholder={placeholder}
					ref={inputRef}
					rows={rows}
					className={cf(
						s.wMax,
						s.flex,
						i.input_,
						isPassword ? i.password : '',
						type === 'date' && state[tag] ? i.filled : '',
						cusClass
					)}
					onChange={handler}
					value={
						(dopple ? state[tag.slice(0, tag.length - 1)] : state[tag]) || ''
					}
					required={required}
					{...props}
				/>
			)}
		</label>
	)
}

export default InputField
