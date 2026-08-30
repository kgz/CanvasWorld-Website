import {
	Children,
	Fragment,
	cloneElement,
	createContext,
	isValidElement,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactElement,
	type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import { parseEmbedProgress, postEmbedControl } from '../modules/embedBridge'
import { DEFAULT_EMBED_PARTICLES } from '../modules/embedMode'
import { publicIconUrl, publicPageUrl, thumbAlt } from '../modules/seo'
import routes from '../@types/routes'
import styles from './VizEmbed.module.css'

type VizEmbedProps = {
	slug: string
	label?: string
	/**
	 * Particle budget for the iframe (`?particles=`).
	 * Defaults to embed profile (~24k). Use `'full'` for the page’s normal count.
	 */
	particles?: number | 'full'
	/**
	 * When true, keep transport `n` ramping (`?n=animate`).
	 * Default false — embeds jump straight to full reveal.
	 */
	animateN?: boolean
	/** Set by VizEmbedGrid for sequential loading. */
	staggerIndex?: number
}

type StaggerCtx = {
	allowedIndex: number
	markLoaded: (index: number) => void
}

const StaggerContext = createContext<StaggerCtx | null>(null)

function flattenElements(children: ReactNode): ReactElement[] {
	const out: ReactElement[] = []
	Children.forEach(children, (child) => {
		if (!isValidElement(child)) {
			return
		}
		if (child.type === Fragment) {
			const nested = Reflect.get(child.props, 'children')
			out.push(...flattenElements(nested))
			return
		}
		out.push(child)
	})
	return out
}

function embedSrc(slug: string, particles: number | 'full' | undefined, animateN: boolean): string {
	const q = new URLSearchParams()
	q.set('iframe', '1')
	q.set('v', 'fit6')
	if (animateN) {
		q.set('n', 'animate')
	}
	if (particles === 'full') {
		q.set('particles', 'full')
	} else if (typeof particles === 'number' && Number.isFinite(particles) && particles > 0) {
		q.set('particles', String(Math.floor(particles)))
	} else {
		q.set('particles', String(DEFAULT_EMBED_PARTICLES))
	}
	return `/chaos/${slug}?${q.toString()}`
}

export function VizEmbed({
	slug,
	label,
	particles,
	animateN = false,
	staggerIndex,
}: VizEmbedProps) {
	const stagger = useContext(StaggerContext)
	const index = staggerIndex ?? 0
	const slotAllowed = stagger === null || index <= stagger.allowedIndex

	const rootRef = useRef<HTMLElement>(null)
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const [docVisible, setDocVisible] = useState(
		typeof document === 'undefined' ? true : document.visibilityState === 'visible',
	)
	const [userPaused, setUserPaused] = useState(false)
	const [iframeReady, setIframeReady] = useState(false)
	const [nComplete, setNComplete] = useState(false)
	const title = label ?? slug.replace(/_/g, ' ')
	const catalog = routes.find((entry) => entry.slug === slug)
	const posterAlt = thumbAlt(catalog?.name ?? title, catalog?.description ?? '')
	const posterSrc = publicIconUrl(slug)
	const fullHref = publicPageUrl(`/${slug}`)
	const src = useMemo(() => embedSrc(slug, particles, animateN), [slug, particles, animateN])

	const wantRunning = docVisible && !userPaused && slotAllowed
	const showPlayIcon = userPaused || (animateN && nComplete) || !slotAllowed

	useEffect(() => {
		const onVis = () => {
			setDocVisible(document.visibilityState === 'visible')
		}
		document.addEventListener('visibilitychange', onVis)
		return () => document.removeEventListener('visibilitychange', onVis)
	}, [])

	useEffect(() => {
		setIframeReady(false)
		setNComplete(false)
		setUserPaused(false)
	}, [src])

	useEffect(() => {
		if (iframeReady && stagger) {
			stagger.markLoaded(index)
		}
	}, [iframeReady, stagger, index])

	useEffect(() => {
		const onMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) {
				return
			}
			if (event.source !== iframeRef.current?.contentWindow) {
				return
			}
			const progress = parseEmbedProgress(event.data)
			if (!progress || !animateN) {
				return
			}
			setNComplete(progress.complete)
		}
		window.addEventListener('message', onMessage)
		return () => window.removeEventListener('message', onMessage)
	}, [animateN])

	useEffect(() => {
		const win = iframeRef.current?.contentWindow
		if (!win || !iframeReady || !slotAllowed) {
			return
		}
		// Click handler posts immediately; this keeps tab-visibility / stagger in sync.
		if (!wantRunning || (animateN && nComplete && !userPaused)) {
			postEmbedControl(win, 'pause')
		} else if (!userPaused) {
			postEmbedControl(win, 'play')
		}
	}, [wantRunning, iframeReady, slotAllowed, nComplete, userPaused, animateN])

	const onTransportClick = () => {
		const win = iframeRef.current?.contentWindow
		if (animateN && nComplete) {
			setNComplete(false)
			setUserPaused(false)
			if (win) {
				postEmbedControl(win, 'replay')
			}
			return
		}
		const nextPaused = !userPaused
		setUserPaused(nextPaused)
		if (win) {
			postEmbedControl(win, nextPaused ? 'pause' : 'play')
		}
	}

	return (
		<figure className={styles.player} ref={rootRef} data-stagger-index={index} data-slot-allowed={slotAllowed ? '1' : '0'}>
			<div className={styles.stage}>
				<img className={styles.poster} src={posterSrc} alt={posterAlt} width={640} height={400} />
				{slotAllowed ? (
					<iframe
						ref={iframeRef}
						className={styles.frame}
						title={title}
						src={src}
						loading="eager"
						allow="fullscreen"
						onLoad={() => setIframeReady(true)}
					/>
				) : (
					<div className={styles.placeholder}>Queued…</div>
				)}
				<noscript>
					<p className={styles.noscript}>
						<a href={fullHref}>{title} — open full visualisation</a>
					</p>
				</noscript>
			</div>
			<figcaption className={styles.bar}>
				<span className={styles.label}>{title} · live</span>
				<div className={styles.actions}>
					<button
						type="button"
						className={[styles.btn, showPlayIcon ? styles.btnPaused : ''].filter(Boolean).join(' ')}
						aria-label={nComplete ? 'Replay' : userPaused ? 'Play' : 'Pause'}
						disabled={!slotAllowed}
						onClick={onTransportClick}
					>
						{showPlayIcon ? (
							<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<path d="M4 2.6c0-.9 1-1.4 1.7-.9l8 5.4c.6.4.6 1.3 0 1.7l-8 5.4c-.7.5-1.7 0-1.7-.9V2.6Z" />
							</svg>
						) : (
							<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
								<rect x="3.5" y="2.5" width="3" height="11" rx="1" />
								<rect x="9.5" y="2.5" width="3" height="11" rx="1" />
							</svg>
						)}
					</button>
					<Link className={styles.link} to={`/${slug}`}>
						Open full →
					</Link>
				</div>
			</figcaption>
		</figure>
	)
}

/** Load child VizEmbed iframes one-by-one (next unlocks after previous `onLoad`). */
export function VizEmbedGrid({ children }: { children: ReactNode }) {
	const [allowedIndex, setAllowedIndex] = useState(0)
	const ctx = useMemo<StaggerCtx>(
		() => ({
			allowedIndex,
			markLoaded: (index: number) => {
				setAllowedIndex((prev) => Math.max(prev, index + 1))
			},
		}),
		[allowedIndex],
	)

	const items = flattenElements(children).map((child, index) =>
		cloneElement(child, {
			key: child.key ?? `embed-${index}`,
			staggerIndex: index,
		}),
	)

	return (
		<StaggerContext.Provider value={ctx}>
			<div className={styles.gridShell}>
				<div className={styles.grid}>{items}</div>
			</div>
		</StaggerContext.Provider>
	)
}
