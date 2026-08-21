import { MDXProvider } from '@mdx-js/react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import { Link, Navigate, useParams } from 'react-router-dom'
import 'katex/dist/katex.min.css'
import { Callout } from '../blog/Callout'
import { formatPostMeta } from '../blog/types'
import { getAdjacent, getPost, resolvePostSlug } from '../blog/registry'
import { VizEmbed, VizEmbedGrid } from '../blog/VizEmbed'
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

	const canonical = resolvePostSlug(slug)
	if (canonical !== slug) {
		return <Navigate to={`/blog/${canonical}`} replace />
	}

	const Body = post.Component

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

			<footer className={styles.siteFooter}>
				<p>Interactive sketches of classical dynamical systems.</p>
			</footer>
		</div>
	)
}

export default PostPage
