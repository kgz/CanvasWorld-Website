import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import routes from '../@types/routes'
import { HeroInkCanvas } from './HeroInkCanvas'
import styles from './frontpage.module.css'

const FONT_HREF =
	'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500;600;700&family=Source+Sans+3:wght@400;600&display=swap'

function iconUrl(slug: string): string {
	const backend = import.meta.env.VITE_BACKEND_URL
	// Bump when thumbs change so gallery doesn't keep a stale browser cache.
	const ver = '20260816212744'
	if (typeof backend === 'string' && backend.length > 0) {
		return `${backend.replace(/\/$/, '')}/chaos/icons/${slug}.png?v=${ver}`
	}
	return `/chaos/icons/${slug}.png?v=${ver}`
}

function vizKind(name: string): string {
	const lower = name.toLowerCase()
	if (lower.includes('map') || lower.includes('set')) return 'Map'
	if (lower.includes('fractal')) return 'Fractal'
	return 'Attractor'
}

function GalleryCard({
	name,
	slug,
	index,
}: {
	name: string
	slug: string
	index: number
}) {
	const ref = useRef<HTMLAnchorElement>(null)
	const [visible, setVisible] = useState(false)
	const [broken, setBroken] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		if (!('IntersectionObserver' in window)) {
			setVisible(true)
			return
		}

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduceMotion) {
			setVisible(true)
			return
		}

		el.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setVisible(true)
						io.unobserve(entry.target)
					}
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
		)
		io.observe(el)
		return () => io.disconnect()
	}, [index])

	const className = [
		styles.vizCard,
		visible ? styles.vizCardVisible : '',
	]
		.filter(Boolean)
		.join(' ')

	return (
		<Link
			ref={ref}
			className={className}
			to={`/${slug}`}
			data-gallery-card={slug}
		>
			{broken ? (
				<span className={styles.vizThumbFallback} aria-hidden="true" />
			) : (
				<img
					className={styles.vizThumb}
					src={iconUrl(slug)}
					alt=""
					loading="lazy"
					onError={() => setBroken(true)}
				/>
			)}
			<span className={styles.vizCardBody}>
				<span className={styles.vizName}>{name}</span>
				<span className={styles.vizKind}>{vizKind(name)}</span>
			</span>
		</Link>
	)
}

function Index() {
	const navRef = useRef<HTMLElement>(null)
	const [navScrolled, setNavScrolled] = useState(false)
	const lastRandomRef = useRef(-1)

	useEffect(() => {
		const existing = document.querySelector(`link[data-cw-frontpage-fonts="1"]`)
		if (existing) return

		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = FONT_HREF
		link.dataset.cwFrontpageFonts = '1'
		document.head.appendChild(link)
	}, [])

	useEffect(() => {
		const onScroll = () => {
			setNavScrolled(window.scrollY > 8)
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		onScroll()
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const pickRandom = () => {
		const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-gallery-card]'))
		if (cards.length === 0) return

		let idx = Math.floor(Math.random() * cards.length)
		if (cards.length > 1 && idx === lastRandomRef.current) {
			idx = (idx + 1) % cards.length
		}
		lastRandomRef.current = idx

		const card = cards[idx]
		const navHeight = navRef.current?.offsetHeight ?? 0
		const top = card.getBoundingClientRect().top + window.scrollY - navHeight - 24
		window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })

		card.classList.remove(styles.vizCardRandomHit)
		requestAnimationFrame(() => {
			card.classList.add(styles.vizCardRandomHit)
		})
		window.setTimeout(() => {
			card.classList.remove(styles.vizCardRandomHit)
		}, 1500)
	}

	return (
		<div className={styles.page}>
			<header
				ref={navRef}
				className={[styles.siteNav, navScrolled ? styles.siteNavScrolled : ''].filter(Boolean).join(' ')}
			>
				<div className={styles.siteNavInner}>
					<Link className={styles.wordmark} to="/">
						CanvasWorld
					</Link>
					<nav className={styles.navLinks}>
						<a href="#gallery">Gallery</a>
						<a href="#about">About</a>
					</nav>
				</div>
			</header>

			<section className={styles.hero}>
				<HeroInkCanvas />
				<div className={styles.heroVignette} aria-hidden="true" />

				<div className={styles.heroContent}>
					<p className={styles.eyebrow}>A visualization laboratory</p>
					<h1 className={styles.heroBrand}>CanvasWorld</h1>
					<p className={styles.heroHeadline}>
						Strange attractors, iterated maps, and fractals — rendered as living systems.
					</p>
					<p className={styles.heroSub}>
						Explore the geometry that emerges when simple equations run millions of times.
					</p>
					<div className={styles.heroCtaGroup}>
						<a className={styles.btnPrimary} href="#gallery">
							Enter gallery
						</a>
						<button type="button" className={styles.btnGhost} onClick={pickRandom}>
							Random visualization
						</button>
					</div>
				</div>

				<div className={styles.heroScrollCue} aria-hidden="true">
					<span />
				</div>
			</section>

			<section className={styles.gallery} id="gallery">
				<div className={styles.galleryHead}>
					<p className={styles.eyebrow}>The gallery</p>
					<h2>
						{routes.length} systems, one canvas
					</h2>
					<p className={styles.lede}>
						Each visualization below is a live parameter space. Click in to tune constants
						and watch the structure fold, branch, or dissolve.
					</p>
				</div>

				<div>
					<h3 className={styles.galleryGroupTitle}>Visualizations</h3>
					<div className={styles.vizGrid}>
						{routes.map((route, index) => (
								<GalleryCard
									key={route.slug}
									name={route.name}
									slug={route.slug}
									index={index}
								/>
							))}
					</div>
				</div>
			</section>

			<footer className={styles.siteFooter} id="about">
				<p>CanvasWorld — a visualization laboratory for dynamical systems.</p>
			</footer>
		</div>
	)
}

export default Index
