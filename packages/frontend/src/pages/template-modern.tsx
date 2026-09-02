import React, { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../@store/store'
import { setData } from '../@store/WebSlice'
import routes, { type TRoute } from '../@types/routes'
import { isScreenshotMode, resetScreenshotReady } from '../modules/screenshotMode'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import Index from './index-new'
import 'katex/dist/katex.min.css'
import { Helmet } from 'react-helmet'
import { AnimationProvider, useAnimation } from '../context/AnimationContext'
import { postsForVizSlug } from '../blog/registry'
import { categorySearchHeading, publicIconUrl, publicPageUrl, thumbAlt } from '../modules/seo'
import { routeProgressLabel, routeShowsTransportBar } from '../modules/vizCatalog'
import { loadVizPageDescription } from '../modules/vizPageDescription'
import { VizPageStage } from '../components/VizPageStage'
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
			const rawDt = last === 0 ? 16 : t - last
			const dtMs = Math.min(Math.max(rawDt, 0.1), 48)
			last = t
			smoothed = smoothed * 0.88 + (1000 / dtMs) * 0.12
			if (lastPaint === 0 || t - lastPaint >= 200) {
				lastPaint = t
				setFps(Math.max(1, Math.min(240, Math.round(smoothed))))
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
		manualProgress,
		setManualProgress,
		replay,
	} = useAnimation()

	if (!enabled) {
		return null
	}

	// While dragging, bind to manualProgress so a slow viz tick can't yank the thumb back.
	const scrubValue = manualProgress ?? particlesDrawn
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
					value={Math.min(scrubValue, totalParticles)}
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
					{progressLabel} = {scrubValue.toLocaleString()} / {totalParticles.toLocaleString()}
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
	const [panelOpen, setPanelOpen] = React.useState(() => {
		if (bareStage) return false
		return !window.matchMedia('(max-width: 900px)').matches
	})

	useCanvasFonts()

	useEffect(() => {
		const mq = window.matchMedia('(max-width: 900px)')
		const onChange = () => {
			if (mq.matches) setPanelOpen(false)
		}
		mq.addEventListener('change', onChange)
		return () => mq.removeEventListener('change', onChange)
	}, [])

	useEffect(() => {
		resetScreenshotReady()
	}, [route.name])

	const [description, setDescription] = useState<React.ReactNode>(() => <p>{route.description}</p>)

	useEffect(() => {
		let cancelled = false
		setDescription(<p>{route.description}</p>)
		loadVizPageDescription(route.slug).then((rich) => {
			if (!cancelled && rich !== null) {
				setDescription(rich)
			}
		})
		return () => {
			cancelled = true
		}
	}, [route.slug, route.description])

	const transportEnabled = routeShowsTransportBar(route)
	const progressLabel = routeProgressLabel(route)

	const hasParams = Boolean(datData && Object.keys(datData.options).length > 0)
	const hasExamples = Boolean(datData.examples && datData.examples.length > 0)
	const relatedNotes = postsForVizSlug(route.slug)
	const primaryNote = relatedNotes[0]
	const pageTitle = `${route.name} — Classical Chaos`
	const canonicalUrl = publicPageUrl(`/${route.slug}`)
	const ogImage = publicIconUrl(route.slug)
	const imgAlt = thumbAlt(route.name, route.description)
	const searchH2 = categorySearchHeading(route.category)

	if (bareStage) {
		return (
			<div className={styles.stageOnly}>
				<style>{`html,body,#root{margin:0;height:100%;width:100%;overflow:hidden;background:#000}`}</style>
				<div className={styles.stageOnlyInner}>
					<VizPageStage Page={route.element} />
				</div>
			</div>
		)
	}

	return (
		<div className={`${styles.app}${panelOpen ? ` ${styles.panelOpen}` : ''}`}>
			<Helmet>
				<title>{pageTitle}</title>
				<meta name="description" content={route.description} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Classical Chaos" />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={route.description} />
				<meta property="og:image" content={ogImage} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={canonicalUrl} />
				<meta name="twitter:title" content={pageTitle} />
				<meta name="twitter:description" content={route.description} />
				<meta name="twitter:image" content={ogImage} />
			</Helmet>
			<header className={styles.topbar}>
				<Link className={styles.homeLink} to="/" aria-label="Home">
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path
							d="M2.5 6.2 8 2l5.5 4.2V13a1 1 0 0 1-1 1h-3.5v-4H7v4H3.5a1 1 0 0 1-1-1V6.2Z"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinejoin="round"
						/>
					</svg>
				</Link>
				<Link className={styles.wordmark} to="/">
					Classical Chaos
				</Link>

				<div className={styles.topbarTitle}>
					<span className={styles.vizTag}>{formatCategory(route.category)}</span>
					<h1>{route.name}</h1>
				</div>

				<div className={styles.topbarSpacer} />

				<div className={styles.topbarActions}>
					{primaryNote ? (
						<Link
							className={styles.chromeBtn}
							to={`/blog/${primaryNote.slug}`}
							aria-label={`Notebook: ${primaryNote.meta.title}`}
						>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<path
									d="M3.5 2.5h7.5A1.5 1.5 0 0 1 12.5 4v9.5H3.5v-11Z"
									stroke="currentColor"
									strokeWidth="1.3"
								/>
								<path d="M3.5 2.5A1.5 1.5 0 0 0 2 4v9.5" stroke="currentColor" strokeWidth="1.3" />
								<path
									d="M6 5.5h5M6 8h5M6 10.5h3.5"
									stroke="currentColor"
									strokeWidth="1.3"
									strokeLinecap="round"
								/>
							</svg>
							<span className={styles.chromeBtnLabel}>Note</span>
						</Link>
					) : null}
					<button
						type="button"
						className={styles.chromeBtn}
						aria-expanded={panelOpen}
						aria-controls="side-panel"
						aria-label={panelOpen ? 'Close parameters' : 'Open parameters'}
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
					<Link className={styles.chromeBtn} to="/#gallery" aria-label="Gallery">
						<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
							<rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
							<rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
							<rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
						</svg>
						<span className={styles.chromeBtnLabel}>Gallery</span>
					</Link>
				</div>
			</header>

			<div className={styles.body}>
				<section className={styles.stage}>
					<div className={styles.stageHost}>
						<VizPageStage Page={route.element} />
					</div>
					<div className={styles.seoFallback}>
						<h2>{searchH2}</h2>
						<p>{route.description}</p>
						<img src={ogImage} alt={imgAlt} width={1200} height={630} />
					</div>
					<noscript>
						<div className={styles.seoFallback}>
							<h2>{searchH2}</h2>
							<p>{route.description}</p>
							<img src={ogImage} alt={imgAlt} width={1200} height={630} />
						</div>
					</noscript>
					<div className={styles.vignette} aria-hidden="true" />
					<FpsCounter />
				</section>

				<button
					type="button"
					className={styles.scrim}
					aria-label="Close parameters"
					aria-hidden={!panelOpen}
					tabIndex={panelOpen ? undefined : -1}
					onClick={() => {
						setPanelOpen(false)
					}}
				/>

				<aside className={styles.sidePanel} id="side-panel" aria-hidden={!panelOpen}>
					<div className={styles.sidePanelInner}>
						<div className={styles.panelHeader}>
							<h2>Parameters</h2>
							<button
								type="button"
								className={styles.panelClose}
								aria-label="Close parameters"
								onClick={() => {
									setPanelOpen(false)
								}}
							>
								<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
									<path
										d="M4 4l8 8M12 4l-8 8"
										stroke="currentColor"
										strokeWidth="1.4"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</div>
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
													value={data[key] ?? option.initialValue}
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
													value={data[key] ?? option.initialValue}
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

						{relatedNotes.length > 1 ? (
							<section className={styles.panelSection}>
								<h2 className={styles.panelSectionTitle}>Notebook</h2>
								<ul className={styles.exploreList}>
									{relatedNotes.map((post) => (
										<li key={post.slug}>
											<Link className={styles.exploreItem} to={`/blog/${post.slug}`}>
												{post.meta.title}
												<span className={styles.exploreItemKind}>{post.meta.tag}</span>
											</Link>
										</li>
									))}
								</ul>
							</section>
						) : null}

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
