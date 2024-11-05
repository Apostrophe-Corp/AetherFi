import {
	AuthContextProvider,
	MainContextProvider,
	WalletContextProvider,
} from '@/context'
import { bungee, inter, luckiest_g, manrope, roboto } from '@/fonts'
import { cf } from '@/utils'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import './global.css'
import { App } from './_components/_App'

/**
 * @type {import("next").Viewport}
 */
export const viewport = {
	colorScheme: 'dark',
	// TODO Resume here: ViewPort
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#038AF1' },
		{ media: '(prefers-color-scheme: dark)', color: '#000000' },
	],
}

/**
 * @typedef {object} Props
 * @property {{id: string}} params
 * @property {[key: string: string | string[]]} searchParams
 */

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata(
	/** @type {Props} */ { params, searchParams },
	/** @type {import("next").ResolvingMetadata} */ parent
) {
	const previousImages = (await parent).openGraph?.images || []

	return {
		metadataBase: new URL('https://aetherfi.vercel.app'),
		title: {
			template: '%s | AetherFi',
			default: 'AetherFi',
			absolute: 'AetherFi',
		},
		description: 'Empowering Payments Beyond Borders — No Internet Required.',
		openGraph: {
			title: 'AetherFi',
			description: 'Empowering Payments Beyond Borders — No Internet Required.',
			url: 'https://aetherfi.vercel.app',
			siteName: 'AetherFi',
			images: [
				{
					url: 'https://aetherfi.vercel.app/opengraph-image.jpg',
					width: 800,
					height: 600,
					alt: 'AetherFi OpenGraph Image',
				},
				{
					url: 'https://aetherfi.vercel.app/opengraph-image.jpg',
					width: 1800,
					height: 1600,
					alt: 'AetherFi OpenGraph Image',
				},
				...previousImages,
			],
			locale: 'en_US',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: 'AetherFi',
			description: 'Empowering Payments Beyond Borders — No Internet Required.',
			siteId: '1467726470533754880',
			creator: '@AetherFi',
			creatorId: '1467726470533754880',
			images: [
				{
					url: 'https://aetherfi.vercel.app/twitter-image.jpg',
					width: 800,
					height: 600,
					alt: 'AetherFi Twitter Image',
				},
				{
					url: 'https://aetherfi.vercel.app/twitter-image.jpg',
					width: 1800,
					height: 1600,
					alt: 'AetherFi Twitter Image',
				},
				...previousImages,
			],
			app: {
				name: 'twitter_app',
				id: {
					iphone: 'twitter_app://iphone',
					ipad: 'twitter_app://ipad',
					googleplay: 'twitter_app://googleplay',
				},
				url: {
					iphone: 'https://x.com/AetherFi',
					ipad: 'https://x.com/AetherFi',
				},
			},
		},
		appleWebApp: {
			title: 'AetherFi',
			statusBarStyle: 'black-translucent',
			startupImage: [
				'/opengraph-image.jpg',
				{
					url: '/opengraph-image.jpg',
					media: '(device-width: 768px) and (device-height: 1024px)',
				},
			],
		},
		appLinks: {
			ios: {
				url: 'https://aetherfi.vercel.app/ios',
				app_store_id: 'app_store_id',
			},
			android: {
				package: 'com.example.android/package',
				app_name: 'app_name_android',
			},
			web: {
				url: 'https://aetherfi.vercel.app/web',
				should_fallback: true,
			},
		},
		generator: 'AetherFi',
		applicationName: 'AetherFi',
		referrer: 'origin-when-cross-origin',
		keywords: ['Payments', 'Finance'],
		formatDetection: {
			email: true,
			address: false,
			telephone: false,
		},
		robots: {
			index: true,
			follow: true,
			nocache: true,
			googleBot: {
				index: true,
				follow: true,
				noimageindex: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		icons: {
			icon: [
				{ url: '/icon.png', sizes: '32x32' },
				{ url: '/icon-48.png', sizes: '48x48' },
				{ url: '/icon-96.png', sizes: '96x96' },
				{ url: '/icon-192.png', sizes: '192x192' },
				new URL('/icon.png', 'https://aetherfi.vercel.app/icon.png'),
				{ url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' },
			],
			shortcut: ['/shortcut-icon.png'],
			apple: [
				{ url: '/apple-icon.png' },
				{ url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
			],
			other: [
				{
					rel: 'apple-touch-icon-precomposed',
					url: '/apple-touch-icon-precomposed.png',
				},
			],
		},
		category: 'finance',
		manifest: 'https://aetherfi.vercel.app/manifest.json',
		assets: ['https://aetherfi.vercel.app/assets'],
	}
}

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body
				className={cf(
					luckiest_g.className,
					manrope.className,
					inter.className,
					bungee.className,
					roboto.className,
					luckiest_g.variable,
					manrope.variable,
					inter.variable,
					bungee.variable,
					roboto.variable
				)}
			>
				<WalletContextProvider>
					<AuthContextProvider>
						<MainContextProvider>
							<SkeletonTheme
								baseColor='#038AF133'
								highlightColor='#038AF1'
							>
								<App>{children}</App>
							</SkeletonTheme>
						</MainContextProvider>
					</AuthContextProvider>
				</WalletContextProvider>
			</body>
		</html>
	)
}
