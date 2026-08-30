import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import routes from '../@types/routes'
import { homeNotebookPosts } from '../blog/registry'
import { formatPostMeta } from '../blog/types'
import { SiteFooter } from '../chrome/ParentSiteLink'
import { SiteNav } from '../chrome/SiteNav'
import { thumbAlt } from '../modules/seo'
import { HeroInkCanvas } from './HeroInkCanvas'
import styles from './frontpage.module.css'

const FONT_HREF =
	'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500;600;700&family=Source+Sans+3:wght@400;600&display=swap'

function iconUrl(slug: string): string {
	const backend = import.meta.env.VITE_BACKEND_URL
	// Bump when thumbs change so gallery doesn't keep a stale browser cache.
	const ver = '20260830121800'
	if (typeof backend === 'string' && backend.length > 0) {
		return `${backend.replace(/\/$/, '')}/chaos/icons/${slug}.png?v=${ver}`
	}
	return `/chaos/icons/${slug}.png?v=${ver}`
}

function formatCategory(category: string): string {
	if (!category) return 'Viz'
	return category.charAt(0).toUpperCase() + category.slice(1)
}

function GalleryCard({
	name,
	slug,
	category,
	description,
	index,
}: {
	name: string
	slug: string
	category: string
	description: string
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
					alt={thumbAlt(name, description)}
					loading="lazy"
					onError={() => setBroken(true)}
				/>
			)}
			<span className={styles.vizCardBody}>
				<span className={styles.vizName}>{name}</span>
				<span className={styles.vizKind}>{formatCategory(category)}</span>
			</span>
		</Link>
	)
}

function Index() {
	const navRef = useRef<HTMLElement | null>(null)
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
			<SiteNav current="home" headerRef={navRef} />

			<section className={styles.hero}>
				<HeroInkCanvas />
				<div className={styles.heroVignette} aria-hidden="true" />

				<div className={styles.heroContent}>
					<h1 className={styles.heroBrand}>Classical Chaos</h1>
					<p className={styles.heroSub}>
						Interactive sketches of classical dynamical systems.
					</p>
					<div className={styles.heroCtaGroup}>
						<a className={styles.btnPrimary} href="#gallery">
							Browse visualisations
						</a>
						<button type="button" className={styles.btnGhost} onClick={pickRandom}>
							Random
						</button>
					</div>
				</div>

				<div className={styles.heroScrollCue} aria-hidden="true">
					<span />
				</div>
			</section>

			<section className={styles.gallery} id="gallery">
				<div className={styles.galleryHead}>
					<h2>Visualisations</h2>
				</div>

				<div className={styles.vizGrid}>
					{routes.map((route, index) => (
						<GalleryCard
							key={route.slug}
							name={route.name}
							slug={route.slug}
							category={route.category}
							description={route.description}
							index={index}
						/>
					))}
				</div>
			</section>

			<section className={styles.notes} id="notebook">
				<div className={styles.notesHead}>
					<h2>Lab notebook</h2>
					<Link className={styles.notesIndex} to="/blog">
						All notes
					</Link>
				</div>
				<div className={styles.noteGrid}>
					{homeNotebookPosts().map((post) => (
						<article key={post.slug} className={styles.noteCard}>
							<Link to={`/blog/${post.slug}`}>
								<span className={styles.noteTag}>{post.meta.tag}</span>
								<span className={styles.noteTitle}>{post.meta.title}</span>
								<span className={styles.noteExcerpt}>{post.meta.excerpt}</span>
								<span className={styles.noteMeta}>{formatPostMeta(post.meta)}</span>
							</Link>
						</article>
					))}
				</div>
			</section>

			<SiteFooter className={styles.siteFooter} aboutId="about" />
		</div>
	)
}

export default Index
