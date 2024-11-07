'use client'

import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import a from './AetherFi.module.css'

export default function AetherFi() {
	return (
		<div className={cf(s.flex, s.flexLeft, a.parent)}>
			<span className={cf(s.wMax, s.flex, s.flexLeft, s.tLeft, a.aetherFi)}>
				AetherFi
			</span>
			<ol className={cf(s.wMax, s.flex, s.flexLeft, a.menu)}>
				<li className={cf(s.dInlineBlock, s.tLeft, a.option)}>
					1. Transfer Money
				</li>
				<li className={cf(s.dInlineBlock, s.tLeft, a.option)}>
					2. Witdraw Money
				</li>
				<li className={cf(s.dInlineBlock, s.tLeft, a.option)}>3. Savings</li>
				<li className={cf(s.dInlineBlock, s.tLeft, a.option)}>4. Loans</li>
				<li className={cf(s.dInlineBlock, s.tLeft, a.option)}>
					5. Ajo (Contribution)
				</li>
				<li className={cf(s.dInlineBlock, s.tLeft, a.option)}>
					6. Create Account
				</li>
			</ol>
			<div className={cf(s.wMax, s.flex, s.flexLeft, a.inputCon)}>
				<span className={cf(s.flex, s.flexLeft, a.input)}>6</span>
			</div>
			<div className={cf(s.wMax, s.flex, s.flexCenter, a.controls)}>
				<span className={cf(s.flex, s.flexCenter, a.control)}>CANCEL</span>
				<span className={cf(s.flex, s.flexCenter, a.control)}>SEND</span>
			</div>
		</div>
	)
}
