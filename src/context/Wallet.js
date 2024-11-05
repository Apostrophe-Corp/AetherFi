'use client'

import { NETWORK } from '@/constants'
import { DeflyWalletConnect } from '@blockshake/defly-connect'
// import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import {
	PROVIDER_ID,
	WalletProvider,
	useInitializeProviders,
} from '@txnlab/use-wallet'
import algosdk from 'algosdk'
// import LuteConnect from 'lute-connect'

const WalletContextProvider = ({ children }) => {
	const ContextValue = useInitializeProviders({
		providers: [
			{ id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
			{ id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
			// { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
			// { id: PROVIDER_ID.EXODUS },
			// {
			// 	id: PROVIDER_ID.LUTE,
			// 	clientStatic: LuteConnect,
			// 	clientOptions: { siteName: 'www.viewreward.app' },
			// },
			// { id: PROVIDER_ID.KIBISIS },
		],
		nodeConfig: {
			network: NETWORK,
			nodeServer: `https://${NETWORK}-api.algonode.cloud`,
			nodeToken: '',
			nodePort: '443',
		},
		algosdkStatic: algosdk,
	})

	return <WalletProvider value={ContextValue}>{children}</WalletProvider>
}

export default WalletContextProvider
