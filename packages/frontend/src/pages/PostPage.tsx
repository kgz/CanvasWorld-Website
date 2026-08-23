import { MDXProvider } from '@mdx-js/react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import { BlockMath, InlineMath } from 'react-katex'
import { Link, Navigate, useParams } from 'react-router-dom'
import 'katex/dist/katex.min.css'
import { Callout } from '../blog/Callout'
import { formatPostMeta } from '../blog/types'
import { getAdjacent, getPost, resolvePostSlug } from '../blog/registry'
import { VizEmbed, VizEmbedGrid } from '../blog/VizEmbed'
import { ParentSiteLink, SiteFooter } from '../chrome/ParentSiteLink'
import styles from './post.module.css'

const FONT_HREF =
	'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,500;600;700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400;500;600&display=swap'

function MdxAnchor({ href, children }: { href?: string; children?: ReactNode }) {
	if (href && href.startsWith('/') && !href.startsWith('//')) {
		return <Link to={href}>{children}</Link>
	}
	return <a href={href}>{children}</a>
}

const mdxComponents = {
	VizEmbed,
	VizEmbedGrid,
	Callout,
	BlockMath,
	InlineMath,
	a: MdxAnchor,
}

function PostPage() {
	const { slug = '' } = useParams()
	const post = getPost(slug)
	const adjacent = useMemo(() => getAdjacent(slug), [slug])
	const navRef = useRef<HTMLElement>(null)
	const [navScrolled, setNavScrolled] = useState(false)

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
		const onScroll = () => setNavScrolled(window.scrollY > 8)
		window.addEventListener('scroll', onScroll, { passive: true })
		onScroll()
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	if (!post) {
		return <Navigate to="/blog" replace />
	}

	const canonicalSlug = resolvePostSlug(slug)
	if (canonicalSlug !== slug) {
		return <Navigate to={`/blog/${canonicalSlug}`} replace />
	}

	const Body = post.Component
	const pageTitle = `${post.meta.title} — Classical Chaos`
	const description = post.meta.excerpt || 'Lab notebook note on Classical Chaos.'
	const canonicalUrl = `https://matf.dev/chaos/blog/${post.slug}`
	const ogImage = post.meta.thumbSlug
		? `https://matf.dev/chaos/icons/${post.meta.thumbSlug}.png`
		: 'https://matf.dev/chaos/icons/mandelbrot_set.png'

	return (
		<div className={styles.page}>
			<Helmet>
				<title>{pageTitle}</title>
				<meta name="description" content={description} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:type" content="article" />
				<meta property="og:site_name" content="Classical Chaos" />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={ogImage} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:url" content={canonicalUrl} />
				<meta name="twitter:title" content={pageTitle} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={ogImage} />
			</Helmet>
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
						<ParentSiteLink />
					</nav>
				</div>
			</header>

			<main className={styles.docShell}>
				<Link className={styles.docBack} to="/blog">
					← Lab notebook
				</Link>

				<header className={styles.docHeader}>
					<span className={styles.postTag}>{post.meta.tag}</span>
					<h1 className={styles.docTitle}>{post.meta.title}</h1>
					<p className={styles.postMeta}>{formatPostMeta(post.meta)}</p>
				</header>

				<article className={styles.md}>
					<MDXProvider components={mdxComponents}>
						<Body />
					</MDXProvider>
				</article>

				<nav className={styles.footerNav}>
					{adjacent.prev ? (
						<Link to={`/blog/${adjacent.prev.slug}`}>← {adjacent.prev.meta.title}</Link>
					) : (
						<Link to="/blog">All notes</Link>
					)}
					{adjacent.next ? (
						<Link className={styles.footerNext} to={`/blog/${adjacent.next.slug}`}>
							Next: {adjacent.next.meta.title} →
						</Link>
					) : null}
				</nav>
			</main>

			<SiteFooter className={styles.siteFooter} />
		</div>
	)
}

export default PostPage
