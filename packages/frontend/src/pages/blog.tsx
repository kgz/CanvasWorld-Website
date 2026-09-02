import { useDeferredValue, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { posts } from '../blog/registry'
import { formatPostMeta, type PostMeta } from '../blog/types'
import { SiteFooter } from '../chrome/ParentSiteLink'
import { SiteNav } from '../chrome/SiteNav'
import styles from './blog.module.css'

const FONT_HREF =
	'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500;600;700&family=Source+Sans+3:wght@400;600&display=swap'

function iconUrl(slug: string): string {
	const backend = import.meta.env.VITE_BACKEND_URL
	const ver = '20260830121800'
	if (typeof backend === 'string' && backend.length > 0) {
		return `${backend.replace(/\/$/, '')}/chaos/icons/${slug}.png?v=${ver}`
	}
	return `/chaos/icons/${slug}.png?v=${ver}`
}

function matchesQuery(meta: PostMeta, q: string): boolean {
	const hay = `${meta.title} ${meta.excerpt} ${meta.tag} ${meta.slug}`.toLowerCase()
	return hay.includes(q)
}

function Blog() {
	const [thumbBroken, setThumbBroken] = useState(false)
	const [query, setQuery] = useState('')
	const deferredQuery = useDeferredValue(query)
	const needle = deferredQuery.trim().toLowerCase()
	const searching = needle.length > 0

	const featured = posts.find((p) => p.meta.featured) ?? posts[0]
	const rest = posts.filter((p) => p.slug !== featured?.slug)
	const filtered = searching ? posts.filter((p) => matchesQuery(p.meta, needle)) : []

	useEffect(() => {
		const existing = document.querySelector(`link[data-cw-frontpage-fonts="1"]`)
		if (existing) return

		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = FONT_HREF
		link.dataset.cwFrontpageFonts = '1'
		document.head.appendChild(link)
	}, [])

	return (
		<div className={styles.page}>
			<Helmet>
				<title>Lab notebook — Classical Chaos</title>
				<meta
					name="description"
					content="Notes on attractors, maps, and meshes in the Classical Chaos catalog."
				/>
				<link rel="canonical" href="https://matf.dev/chaos/blog" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Classical Chaos" />
				<meta property="og:url" content="https://matf.dev/chaos/blog" />
				<meta property="og:title" content="Lab notebook — Classical Chaos" />
				<meta
					property="og:description"
					content="Notes on attractors, maps, and meshes in the Classical Chaos catalog."
				/>
				<meta property="og:image" content="https://matf.dev/chaos/icons/mandelbrot_set.png" />
				<meta name="twitter:card" content="summary_large_image" />
			</Helmet>
			<SiteNav current="notebook" />

			<main id="main" tabIndex={-1}>
				<section className={styles.blogHero}>
					<p className={styles.eyebrow}>Field notes</p>
					<h1 className={styles.blogTitle}>The lab notebook</h1>
					<p className={styles.lede}>
						Notes on the mathematics, rendering techniques, and design decisions behind Classical
						Chaos — written as the systems get built, not after.
					</p>
					<label className={styles.search}>
						<span className={styles.searchLabel}>Search notes</span>
						<input
							className={styles.searchInput}
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Title, tag, or topic…"
							autoComplete="off"
							spellCheck={false}
						/>
					</label>
				</section>

				{searching ? (
					<section className={styles.listSection}>
						<h2 className={styles.groupTitle}>
							{filtered.length === 0
								? 'No matches'
								: `${filtered.length} match${filtered.length === 1 ? '' : 'es'}`}
						</h2>
						{filtered.length > 0 ? (
							<div className={styles.postGrid}>
								{filtered.map((post) => (
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
						) : (
							<p className={styles.empty}>Nothing matched “{deferredQuery.trim()}”.</p>
						)}
					</section>
				) : (
					<>
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
					</>
				)}
			</main>

			<SiteFooter className={styles.siteFooter} aboutId="about" />
		</div>
	)
}

export default Blog
