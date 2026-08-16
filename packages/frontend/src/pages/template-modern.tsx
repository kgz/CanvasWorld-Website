import React, { useEffect, useMemo } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../@store/store'
import { setData } from '../@store/WebSlice'
import routes, { type TRoute } from '../@types/routes'
import { isScreenshotMode, resetScreenshotReady } from '../modules/screenshotMode'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import Index from './index-new'
import 'katex/dist/katex.min.css'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { AnimationProvider, useAnimation } from '../context/AnimationContext'

type ModernCanvasPageProps = {
	route: TRoute
	isIframe: boolean
}

function AnimationTransportBar({
	sidebarOpen,
	isIframe,
}: {
	sidebarOpen: boolean
	isIframe: boolean
}) {
	const {
		isPaused,
		setPaused,
		animationSpeed,
		setSpeed,
		isComplete,
		particlesDrawn,
		totalParticles,
		setManualProgress,
		replay,
	} = useAnimation()

	const isPlaying = !isPaused

	return (
		<div
			className="fixed bottom-0 z-50 glass-effect border-t border-gray-700/50"
			style={{ left: sidebarOpen && !isIframe ? '20rem' : '0', right: '0' }}
		>
			<div className="max-w-7xl mx-auto px-4 py-3">
				<div className="flex items-center justify-between gap-4">
					<button
						type="button"
						onClick={() => {
							if (isComplete) {
								replay()
							} else {
								setPaused(!isPaused)
							}
						}}
						className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 text-white flex-shrink-0"
					>
						{isComplete ? <RotateCcw size={24} /> : isPlaying ? <Pause size={24} /> : <Play size={24} />}
					</button>

					<div className="flex items-center gap-2 flex-shrink-0">
						<span className="text-xs text-gray-400">Speed:</span>
						<input
							type="range"
							min="0.1"
							max="5"
							step="0.1"
							value={animationSpeed}
							onChange={(e) => {
								setSpeed(parseFloat(e.target.value))
							}}
							className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
						/>
						<span className="text-xs text-gray-300 font-mono w-8">
							{animationSpeed.toFixed(1)}x
						</span>
					</div>

					<div className="flex-1 mx-4">
						<input
							type="range"
							min="0"
							max={totalParticles}
							value={Math.min(particlesDrawn, totalParticles)}
							onChange={(e) => {
								setManualProgress(parseInt(e.target.value, 10))
							}}
							onMouseUp={() => {
								setManualProgress(null)
							}}
							onTouchEnd={() => {
								setManualProgress(null)
							}}
							className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>

					<div className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-lg flex-shrink-0">
						<span className="font-semibold">n = </span>
						<span>
							{particlesDrawn.toLocaleString()} / {totalParticles.toLocaleString()}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

function ModernCanvasPageInner({ route, isIframe }: ModernCanvasPageProps) {
	const dispatch = useAppDispatch()
	const { datData, data } = useAppSelector(state => state.WebSlice)
	const screenshot = isScreenshotMode()
	const [sidebarOpen, setSidebarOpen] = React.useState(!isIframe && !screenshot)

	useEffect(() => {
		resetScreenshotReady()
	}, [route.name])

	const description = useMemo(() => {
		const getDescription = Reflect.get(route.element, 'getDescription')
		if (typeof getDescription === 'function') {
			return getDescription.call(route.element)
		}
		return <div>Loading description...</div>
	}, [route])

	if (screenshot) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="h-screen w-screen bg-black">
					<route.element />
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button
								type="button"
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
							<Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
							</Link>
							<Link to="/" className="text-2xl font-bold gradient-text">
								CanvasWorld
							</Link>
						</div>
						<h1 className="text-xl font-semibold text-white">{route.name}</h1>
						<div className="flex items-center space-x-4" />
					</div>
				</div>
			</nav>

			<div className="flex pt-16">
				<div
					className={`transition-all duration-300 ease-in-out ${
						sidebarOpen && !isIframe ? 'w-80 opacity-100' : 'w-0 opacity-0'
					} bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 h-[calc(100vh-4rem)] flex-shrink-0 overflow-y-auto overflow-x-hidden`}
				>
					<div className="p-6">
						{datData && Object.keys(datData.options).length > 0 && (
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-white mb-3">Controls</h2>
								<div className="space-y-4">
									{Object.entries(datData.options).map(([key, option]) => (
										<div key={key}>
											<label className="block text-sm font-medium text-gray-300 mb-1">
												{key}
											</label>
											{key === 'x0' || key === 'y0' ? (
												<input
													type="number"
													min={option.min}
													max={option.max}
													step={option.step || 0.001}
													value={data[key] || option.initialValue}
													onChange={(e) => {
														dispatch(setData({ ...data, [key]: parseFloat(e.target.value) }))
													}}
													className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
												/>
											) : (
												<>
													<input
														type="range"
														min={option.min}
														max={option.max}
														step={option.step || 0.001}
														value={data[key] || option.initialValue}
														onChange={(e) => {
															dispatch(setData({ ...data, [key]: parseFloat(e.target.value) }))
														}}
														className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
													/>
													<div className="flex justify-between text-xs text-gray-400 mt-1">
														<span>{option.min}</span>
														<span className="font-mono">{data[key] || option.initialValue}</span>
														<span>{option.max}</span>
													</div>
												</>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{datData.examples && datData.examples.length > 0 && (
							<div className="mb-6">
								<h2 className="text-lg font-semibold text-white mb-3">Examples</h2>
								<div className="space-y-2">
									{datData.examples.map((example, index) => (
										<button
											key={index}
											type="button"
											onClick={() => {
												dispatch(setData(example))
											}}
											className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors duration-300"
										>
											<div className="text-sm text-white font-medium">Example {index + 1}</div>
											<div className="text-xs text-gray-400 mt-1">
												{Object.entries(example).map(([key, value]) => `${key}: ${value}`).join(', ')}
											</div>
										</button>
									))}
								</div>
							</div>
						)}

						<div className="mb-6">
							<h2 className="text-lg font-semibold text-white mb-3">About</h2>
							<div className="text-gray-300 text-sm leading-relaxed">
								{description}
							</div>
						</div>
						<div>
							<h2 className="text-lg font-semibold text-white mb-3">Explore</h2>
							<div className="space-y-1">
								{routes.slice(0, 8).map((exploreRoute) => (
									<Link
										key={exploreRoute.slug}
										to={'/' + exploreRoute.slug}
										className="block p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded transition-colors duration-300"
									>
										{exploreRoute.name}
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="flex-1 ml-0">
					<div className="h-[calc(100vh-4rem)] bg-gray-900 relative">
						<route.element />
					</div>
				</div>
			</div>

			<AnimationTransportBar sidebarOpen={sidebarOpen} isIframe={isIframe} />
		</div>
	)
}

const ModernCanvasPage = ({ route, isIframe }: ModernCanvasPageProps) => (
	<AnimationProvider key={route.slug}>
		<ModernCanvasPageInner route={route} isIframe={isIframe} />
	</AnimationProvider>
)

const Template = () => {
	const { trackPageView } = useMatomo()
	const loc = useLocation()

	useEffect(() => {
		trackPageView({
			href: loc.pathname + loc.search,
		})
	}, [trackPageView, loc])

	const isIframe = useMemo(() => {
		const params = new URLSearchParams(window.location.search)
		return params.get('iframe') !== null
	}, [])

	return (
		<Routes>
			{routes.map((route) => (
				<Route
					key={route.slug}
					path={'/' + route.slug}
					element={<ModernCanvasPage route={route} isIframe={isIframe} />}
				/>
			))}
			<Route path="*" element={<Index />} />
		</Routes>
	)
}

export default ModernCanvasPage
export { Template }
