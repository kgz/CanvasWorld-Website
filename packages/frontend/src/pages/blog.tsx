import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { posts } from '../blog/registry'
import { formatPostMeta } from '../blog/types'
import styles from './blog.module.css'

const FONT_HREF =
	'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500;600;700&family=Source+Sans+3:wght@400;600&display=swap'

function iconUrl(slug: string): string {
	const backend = import.meta.env.VITE_BACKEND_URL
	const ver = '20260816212744'
	if (typeof backend === 'string' && backend.length > 0) {
		return `${backend.replace(/\/$/, '')}/chaos/icons/${slug}.png?v=${ver}`
	}
	return `/chaos/icons/${slug}.png?v=${ver}`
}

function Blog() {
	const navRef = useRef<HTMLElement>(null)
	const [navScrolled, setNavScrolled] = useState(false)
	const [thumbBroken, setThumbBroken] = useState(false)

	const featured = posts.find((p) => p.meta.featured) ?? posts[0]
	const rest = posts.filter((p) => p.slug !== featured?.slug)

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

	return (
		<div className={styles.page}>
			<header
				ref={navRef}
				className={[styles.siteNav, navScrolled ? styles.siteNavScrolled : ''].filter(Boolean).join(' ')}
			>
				<div className={styles.siteNavInner}>
					<Link className={styles.wordmark} to="/">
						Classical Chaos
					</Link>
					<nav className={styles.navLinks}>
						<Link to="/#gallery">Gallery</Link>
						<Link to="/blog" aria-current="page">
							Notebook
						</Link>
						<Link to="/#about">About</Link>
					</nav>
				</div>
			</header>

			<main>
				<section className={styles.blogHero}>
					<p className={styles.eyebrow}>Field notes</p>
					<h1 className={styles.blogTitle}>The lab notebook</h1>
					<p className={styles.lede}>
						Notes on the mathematics, rendering techniques, and design decisions behind Classical
						Chaos — written as the systems get built, not after.
					</p>
				</section>

				{featured ? (
					<section className={styles.featuredSection}>
						<Link className={styles.featured} to={`/blog/${featured.slug}`}>
							{featured.meta.thumbSlug && !thumbBroken ? (
								<img
									className={styles.featuredArt}
									src={iconUrl(featured.meta.thumbSlug)}
									alt=""
									onError={() => setThumbBroken(true)}
								/>
							) : (
								<span className={styles.featuredArtFallback} aria-hidden="true" />
							)}
							<span className={styles.featuredBody}>
								<span className={styles.postTag}>{featured.meta.tag}</span>
								<span className={styles.featuredTitle}>{featured.meta.title}</span>
								<span className={styles.postExcerpt}>{featured.meta.excerpt}</span>
								<span className={styles.postMeta}>{formatPostMeta(featured.meta)}</span>
							</span>
						</Link>
					</section>
				) : null}

				<section className={styles.listSection}>
					<h2 className={styles.groupTitle}>More notes</h2>
					<div className={styles.postGrid}>
						{rest.map((post) => (
							<article key={post.slug} className={styles.postCard}>
								<Link to={`/blog/${post.slug}`}>
									<span className={styles.postTag}>{post.meta.tag}</span>
									<span className={styles.postCardTitle}>{post.meta.title}</span>
									<span className={styles.postExcerpt}>{post.meta.excerpt}</span>
									<span className={styles.postMeta}>{formatPostMeta(post.meta)}</span>
								</Link>
							</article>
						))}
					</div>
				</section>
			</main>

			<footer className={styles.siteFooter} id="about">
				<p>Interactive sketches of classical dynamical systems.</p>
			</footer>
		</div>
	)
}

export default Blog
