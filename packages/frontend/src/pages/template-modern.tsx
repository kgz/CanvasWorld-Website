import React, { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../@store/store'
import { setData } from '../@store/WebSlice'
import routes, { type TRoute } from '../@types/routes'
import { isScreenshotMode, resetScreenshotReady } from '../modules/screenshotMode'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import Index from './index-new'
import 'katex/dist/katex.min.css'
import { AnimationProvider, useAnimation } from '../context/AnimationContext'
import styles from './canvasChrome.module.css'

const FONT_HREF =
	'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Literata:opsz,wght@7..72,500;600;700&family=Source+Sans+3:wght@400;600&display=swap'

const SPEED_PRESETS = [0.5, 1, 2, 4] as const

type ModernCanvasPageProps = {
	route: TRoute
	isIframe: boolean
}

function formatCategory(category: string): string {
	if (!category) return 'Viz'
	return category.charAt(0).toUpperCase() + category.slice(1)
}

function useCanvasFonts() {
	useEffect(() => {
		const id = 'cw-canvas-fonts'
		if (document.getElementById(id)) return
		const link = document.createElement('link')
		link.id = id
		link.rel = 'stylesheet'
		link.href = FONT_HREF
		document.head.appendChild(link)
	}, [])
}

function FpsCounter() {
	const [fps, setFps] = useState(60)

	useEffect(() => {
		let smoothed = 60
		let last = 0
		let lastPaint = 0
		let raf = 0

		const tick = (t: number) => {
			const dtMs = last === 0 ? 16 : Math.min(t - last, 48)
			last = t
			smoothed = smoothed * 0.88 + (1000 / dtMs) * 0.12
			if (lastPaint === 0 || t - lastPaint >= 200) {
				lastPaint = t
				setFps(Math.max(1, Math.round(smoothed)))
			}
			raf = requestAnimationFrame(tick)
		}

		raf = requestAnimationFrame(tick)
		return () => {
			cancelAnimationFrame(raf)
		}
	}, [])

	return (
		<div className={styles.fpsCounter} aria-hidden="true">
			<span className={styles.fpsValue}>{fps}</span>
			<span className={styles.fpsUnit}>FPS</span>
		</div>
	)
}

function AnimationTransportBar({
	enabled,
	progressLabel,
}: {
	enabled: boolean
	progressLabel: string
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

	if (!enabled) {
		return null
	}

	const isPlaying = !isPaused

	return (
		<footer className={styles.transport}>
			<button
				type="button"
				className={`${styles.transportBtn} ${styles.transportPlay}`}
				aria-label={isPlaying ? 'Pause' : 'Play'}
				onClick={() => {
					if (isComplete) {
						replay()
					} else {
						setPaused(!isPaused)
					}
				}}
			>
				{isPlaying && !isComplete ? (
					<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
						<rect x="3.5" y="2.5" width="3" height="11" rx="1" />
						<rect x="9.5" y="2.5" width="3" height="11" rx="1" />
					</svg>
				) : (
					<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
						<path d="M4 2.6c0-.9 1-1.4 1.7-.9l8 5.4c.6.4.6 1.3 0 1.7l-8 5.4c-.7.5-1.7 0-1.7-.9V2.6Z" />
					</svg>
				)}
			</button>
			<button
				type="button"
				className={styles.transportBtn}
				aria-label="Replay"
				onClick={() => {
					replay()
				}}
			>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M13.5 8a5.5 5.5 0 1 1-1.9-4.16"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
					<path
						d="M13.5 2.6v3.2h-3.2"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<div className={styles.transportScrub}>
				<input
					type="range"
					min={0}
					max={Math.max(totalParticles, 1)}
					value={Math.min(particlesDrawn, totalParticles)}
					aria-label="Trajectory progress"
					onChange={(e) => {
						setManualProgress(parseInt(e.target.value, 10))
					}}
					onMouseUp={() => {
						setManualProgress(null)
					}}
					onTouchEnd={() => {
						setManualProgress(null)
					}}
				/>
				<span className={styles.transportCount}>
					{progressLabel} = {particlesDrawn.toLocaleString()} / {totalParticles.toLocaleString()}
				</span>
			</div>

			<div className={styles.speedGroup}>
				{SPEED_PRESETS.map((speed) => (
					<button
						key={speed}
						type="button"
						className={`${styles.speedBtn}${animationSpeed === speed ? ` ${styles.speedBtnActive}` : ''}`}
						onClick={() => {
							setSpeed(speed)
						}}
					>
						{speed}×
					</button>
				))}
			</div>
		</footer>
	)
}

function ModernCanvasPageInner({ route, isIframe }: ModernCanvasPageProps) {
	const dispatch = useAppDispatch()
	const { datData, data } = useAppSelector((state) => state.WebSlice)
	const screenshot = isScreenshotMode()
	const bareStage = screenshot || isIframe
	const [panelOpen, setPanelOpen] = React.useState(!bareStage)

	useCanvasFonts()

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

	const transportEnabled =
		Reflect.get(route.element, 'usesTransportBar') === true ||
		(route.renderMode !== 'shader' && Reflect.get(route.element, 'isShaderViz') !== true)
	const progressLabelRaw = Reflect.get(route.element, 'progressLabel')
	const progressLabel = typeof progressLabelRaw === 'string' ? progressLabelRaw : 'n'

	const hasParams = Boolean(datData && Object.keys(datData.options).length > 0)
	const hasExamples = Boolean(datData.examples && datData.examples.length > 0)

	if (bareStage) {
		return (
			<div className={styles.stageOnly}>
				<div className={styles.stageOnlyInner}>
					<route.element />
				</div>
			</div>
		)
	}

	return (
		<div className={`${styles.app}${panelOpen ? ` ${styles.panelOpen}` : ''}`}>
			<header className={styles.topbar}>
				<Link className={styles.wordmark} to="/">
					CanvasWorld
				</Link>

				<div className={styles.topbarTitle}>
					<span className={styles.vizTag}>{formatCategory(route.category)}</span>
					<h1>{route.name}</h1>
				</div>

				<div className={styles.topbarSpacer} />

				<div className={styles.topbarActions}>
					<button
						type="button"
						className={styles.chromeBtn}
						aria-expanded={panelOpen}
						aria-controls="side-panel"
						onClick={() => {
							setPanelOpen(!panelOpen)
						}}
					>
						<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<rect
								x="1.5"
								y="2.5"
								width="13"
								height="11"
								rx="1.5"
								stroke="currentColor"
								strokeWidth="1.3"
							/>
							<line x1="6" y1="2.5" x2="6" y2="13.5" stroke="currentColor" strokeWidth="1.3" />
						</svg>
						<span className={styles.chromeBtnLabel}>Params</span>
					</button>
					<Link className={styles.chromeBtn} to="/#gallery">
						<span className={styles.chromeBtnLabel}>Gallery</span>
					</Link>
				</div>
			</header>

			<div className={styles.body}>
				<section className={styles.stage}>
					<div className={styles.stageHost}>
						<route.element />
					</div>
					<div className={styles.vignette} aria-hidden="true" />
					<FpsCounter />
				</section>

				<button
					type="button"
					className={styles.scrim}
					aria-label="Close parameters"
					onClick={() => {
						setPanelOpen(false)
					}}
				/>

				<aside className={styles.sidePanel} id="side-panel">
					<div className={styles.sidePanelInner}>
						{hasParams && (
							<section className={styles.panelSection}>
								<h2 className={styles.panelSectionTitle}>Parameters</h2>
								<p className={styles.panelLede}>
									Tune the constants that govern the system. Changes re-trace the trajectory from its
									seed.
								</p>
								{Object.entries(datData.options).map(([key, option]) => {
									const value = data[key] ?? option.initialValue
									const display =
										typeof value === 'number' ? value : Number(value)
									return (
										<div key={key} className={styles.paramRow}>
											<div className={styles.paramRowHead}>
												<label className={styles.paramLabel} htmlFor={`param-${key}`}>
													{key}
												</label>
												<span className={styles.paramValue}>
													{Number.isFinite(display) ? display : String(value)}
												</span>
											</div>
											{key === 'x0' || key === 'y0' ? (
												<input
													id={`param-${key}`}
													className={styles.paramNumber}
													type="number"
													min={option.min}
													max={option.max}
													step={option.step || 0.001}
													value={data[key] || option.initialValue}
													onChange={(e) => {
														dispatch(setData({ ...data, [key]: parseFloat(e.target.value) }))
													}}
												/>
											) : (
												<input
													id={`param-${key}`}
													type="range"
													min={option.min}
													max={option.max}
													step={option.step || 0.001}
													value={data[key] || option.initialValue}
													onChange={(e) => {
														dispatch(setData({ ...data, [key]: parseFloat(e.target.value) }))
													}}
												/>
											)}
										</div>
									)
								})}
							</section>
						)}

						{hasExamples && (
							<section className={styles.panelSection}>
								<h2 className={styles.panelSectionTitle}>Examples</h2>
								<ul className={styles.exampleList}>
									{datData.examples.map((example, index) => (
										<li key={index}>
											<button
												type="button"
												className={styles.exampleBtn}
												onClick={() => {
													dispatch(setData(example))
												}}
											>
												Example {index + 1}
												<span className={styles.exampleMeta}>
													{Object.entries(example)
														.map(([key, value]) => `${key}: ${value}`)
														.join(', ')}
												</span>
											</button>
										</li>
									))}
								</ul>
							</section>
						)}

						<section className={styles.panelSection}>
							<h2 className={styles.panelSectionTitle}>About</h2>
							<div className={styles.aboutBody}>{description}</div>
						</section>

						<section className={styles.panelSection}>
							<h2 className={styles.panelSectionTitle}>Explore</h2>
							<ul className={styles.exploreList}>
								{(() => {
									const others = routes.filter((r) => r.slug !== route.slug).slice(0, 7)
									const exploreRoutes = [route, ...others]
									return exploreRoutes.map((exploreRoute) => {
										const current = exploreRoute.slug === route.slug
										if (current) {
											return (
												<li key={exploreRoute.slug}>
													<span className={`${styles.exploreItem} ${styles.exploreItemCurrent}`}>
														{exploreRoute.name}
														<span className={styles.exploreItemKind}>Now viewing</span>
													</span>
												</li>
											)
										}
										return (
											<li key={exploreRoute.slug}>
												<Link className={styles.exploreItem} to={'/' + exploreRoute.slug}>
													{exploreRoute.name}
													<span className={styles.exploreItemKind}>
														{formatCategory(exploreRoute.category)}
													</span>
												</Link>
											</li>
										)
									})
								})()}
							</ul>
						</section>
					</div>
				</aside>
			</div>

			<AnimationTransportBar enabled={transportEnabled} progressLabel={progressLabel} />
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
