import { Shared as s } from '@/styles'
import { cf } from '@/utils'
import l from './loading.module.css'

export default function Loading() {
	return (
		<div
			className={cf(s.wMax, s.flex, s.flexCenter, s.flex_dColumn, l.section)}
		></div>
	)
}
