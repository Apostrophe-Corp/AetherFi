'use client'

import { useDebouncedEffect } from '@/hooks'
import { Shared as s } from '@/styles'
import Image from 'next/image'
import { memo, useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { GoDotFill } from 'react-icons/go'
import { cf, getAssetMedia } from '../../utils'
import { Skeleton } from '../Skeleton'
import a from './Token.module.css'

const Token = memo(
	({
		assetID,
		table = {},
		token = null,
		handler = null,
		round = false,
		fallback = false,
		tokenClass,
		mustBeCollectible = null,
	}) => {
		const [media, setMedia] = useState('')
		const [loaded, setLoaded] = useState(false)
		const [banner, setBanner] = useState(null)
		const [retries, setRetries] = useState(0)
		const [errored, setErrored] = useState(false)
		const [isRound, setIsRound] = useState(round)
		const [retrievedAsset, setRetrievedAsset] = useState({})
		const [incompatible, setIncompatible] = useState(
			mustBeCollectible !== null ? true : false
		)

		const videoRef = useRef()

		const [ticker, setTicker] = useState(0)
		useDebouncedEffect(
			async (deps) => {
				const [assetID, ticker, fallback, round, mustBeCollectible] = deps
				const medias = await getAssetMedia([assetID])
				const media = medias.length
					? fallback && medias[0] === null
						? (() => {
								setIsRound(() => true)
								return `https://asa-list.tinyman.org/assets/${assetID}/icon.png`
						  })()
						: medias[0]
					: null
				if (Object.keys(media).length) {
					if (!media.is_collectible) setIsRound(() => true)
					else setIsRound(() => round || false)
					if (mustBeCollectible !== null) {
						if (
							(mustBeCollectible && !media.is_collectible) ||
							(!mustBeCollectible && media.is_collectible)
						)
							setIncompatible(() => true)
						else setIncompatible(() => false)
					}
				}
				const resolvedMedia = Object.keys(media).length
					? media.is_collectible
						? media.mediaURL
						: media.logo
					: media
				setMedia(() => resolvedMedia)
				setRetrievedAsset(() => media)
				if (ticker < 1) setTicker((x) => x + 1)
			},
			[assetID, ticker, fallback, round, mustBeCollectible],
			1000
		)

		useDebouncedEffect(
			() => {
				setTicker(() => 0)
			},
			[assetID],
			100
		)

		useEffect(() => {
			if (retrievedAsset?.mediaType === 'video' && videoRef.current) {
				try {
					videoRef.current.disablePictureInPicture = true
				} catch (error) {}
				function attemptVideoLoad(
					videoElement,
					maxRetries = 5,
					interval = 5000
				) {
					let retries = 0

					function checkVideoLoaded() {
						try {
							// Check if the video is ready to play
							if (videoElement.readyState >= 3) {
								// console.log('Video loaded successfully.')
								return
							}

							retries++
							if (retries <= maxRetries) {
								// console.log(`Retrying video load: Attempt ${retries}`)
								// Reload the video
								videoElement.load()
								setTimeout(checkVideoLoaded, interval)
							} else {
								// console.error('Failed to load the video after multiple attempts.')
							}
						} catch (err) {
							// console.log({ err })
						}
					}

					// Start the first check
					setTimeout(checkVideoLoaded, interval)
				}
				attemptVideoLoad(videoRef.current)
			}
		}, [retrievedAsset])

		return (
			<>
				{' '}
				{incompatible ? (
					<></>
				) : media !== null ? (
					<div
						className={cf(
							s.flex,
							s.flexCenter,
							s.pointer,
							s.p_relative,
							a.tokenCon,
							a.loader,
							table[assetID] ? a.tokenConFocused : '',
							!handler ? a.noHandler : '',
							isRound ? a.round : '',
							tokenClass
						)}
						onClick={
							handler
								? () => handler()
								: assetID || assetID === 0
								? () =>
										window.open(
											`https://explorer.perawallet.app/asset/${assetID}/`,
											'_blank'
										)
								: null
						}
					>
						{media ? (
							<div
								className={cf(
									s.wMax,
									s.hMax,
									s.flex,
									s.flexCenter,
									s.p_relative,
									a.mediaCon
								)}
							>
								{(
									retrievedAsset?.mediaType
										? retrievedAsset?.mediaType === 'image'
										: true
								) ? (
									<Image
										src={banner !== null ? banner : media}
										alt={'Token'}
										className={cf(
											s.wMax,
											s.flex,
											s.flexCenter,
											s.p_Relative,
											a.token,
											!loaded ? a.notLoaded : a.loaded
										)}
										sizes={'33vw'}
										fill={true}
										onLoad={() => setLoaded(() => true)}
										onError={() => {
											setErrored(() => true)
											if (fallback) {
												if (retries === 0) {
													setIsRound(() => true)
													setBanner(
														() =>
															`https://asa-list.tinyman.org/assets/${assetID}/icon.png`
													)
													setRetries((x) => x + 1)
												} else if (retries === 1) {
													setBanner(
														() =>
															`https://asa-list.tinyman.org/assets/${assetID}/icon.svg`
													)
													setRetries((x) => x + 1)
												} else if (retries === 2) {
													setMedia(() => null)
												}
											} else {
												setMedia(() => null)
											}
										}}
									/>
								) : retrievedAsset?.mediaType === 'video' ? (
									<>
										<video
											ref={videoRef}
											controls={true}
											onCanPlay={() => setLoaded(() => true)}
											onError={() => {
												setErrored(() => true)
												setMedia(() => null)
											}}
											className={cf(
												s.wMax,
												s.hMax,
												s.flex,
												s.flexCenter,
												s.p_Relative,
												a.bNone,
												!loaded ? a.notLoaded : a.loaded
											)}
											muted
											loop={true}
											controlsList={
												'nodownload nofullscreen noremoteplayback noplaybackrate novolume'
											}
											disablePictureInPicture
											disableRemotePlayback
											x-webkit-airplay={'deny'}
											autoPlay
										>
											<source
												src={media}
												type={`video/${String(retrievedAsset?.extension).slice(
													1
												)}`}
											/>
										</video>
									</>
								) : retrievedAsset?.mediaType === 'audio' ? (
									<figure
										className={cf(
											s.wMax,
											s.flex,
											s.flexCenter,
											s.p_Relative,
											s.m0
										)}
									>
										<audio
											controls={false}
											onCanPlay={() => setLoaded(() => true)}
											onError={() => {
												setErrored(() => true)
												setMedia(() => null)
											}}
											className={cf(s.wMax, s.flex)}
											src={media}
										></audio>
									</figure>
								) : (
									<></>
								)}
								{!loaded ? (
									<Skeleton
										className={cf(s.wMax, a.tokenCover)}
										containerClassName={cf(s.wMax, s.p_absolute, a.tokenCover)}
									/>
								) : (
									<></>
								)}
							</div>
						) : (
							<Skeleton
								className={cf(s.wMax, a.tokenCover)}
								containerClassName={cf(s.wMax, s.p_Relative, a.tokenCover)}
							/>
						)}
						{assetID === token ? (
							<span className={cf(s.flex, s.flexCenter, a.checkMark)}>
								<GoDotFill />
							</span>
						) : (
							<></>
						)}
						{table[assetID] ? (
							<span className={cf(s.flex, s.flexCenter, a.checkMark)}>
								<FaCheck />
							</span>
						) : (
							<></>
						)}
					</div>
				) : (
					<Skeleton
						className={cf(s.wMax, a.tokenCover)}
						containerClassName={cf(s.wMax, s.p_Relative, a.tokenCover)}
						enableAnimation={false}
					/>
				)}
			</>
		)
	}
)

export default Token
