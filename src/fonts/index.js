import {
	Bungee,
	Inter,
	Luckiest_Guy,
	Manrope,
	Roboto_Mono,
} from 'next/font/google'

const roboto = Roboto_Mono({
	subsets: ['latin'],
	variable: '--font-roboto',
})

const luckiest_g = Luckiest_Guy({
	subsets: ['latin'],
	variable: '--font-luckiest-g',
	weight: ['400'],
})

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

const bungee = Bungee({
	subsets: ['latin'],
	variable: '--font-bungee',
	weight: ['400'],
})

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope',
})

export { bungee, inter, luckiest_g, manrope, roboto }
