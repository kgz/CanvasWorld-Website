import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ParentSiteLink } from './ParentSiteLink'
import styles from './siteNav.module.css'

type SiteNavProps = {
	current: 'home' | 'notebook'
	headerRef?: { current: HTMLElement | null }
}

export function SiteNav({ current, headerRef }: SiteNavProps) {
	const [scrolled, setScrolled] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const menuId = useId()

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 8)
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		onScroll()
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	useEffect(() => {
		if (!menuOpen) return
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false)
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [menuOpen])

	const closeMenu = () => {
		setMenuOpen(false)
	}

	return (
		<header
			ref={(el) => {
				if (headerRef) headerRef.current = el
			}}
			className={[
				styles.nav,
				scrolled ? styles.scrolled : '',
				menuOpen ? styles.menuOpen : '',
			]
				.filter(Boolean)
				.join(' ')}
		>
			<div className={styles.inner}>
				<Link className={styles.wordmark} to="/" onClick={closeMenu}>
					Classical Chaos
				</Link>
				<button
					type="button"
					className={styles.toggle}
					aria-expanded={menuOpen}
					aria-controls={menuId}
					aria-label={menuOpen ? 'Close menu' : 'Open menu'}
					onClick={() => {
						setMenuOpen(!menuOpen)
					}}
				>
					<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
						<path
							d="M2.5 5h13M2.5 9h13M2.5 13h13"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>
					<span className={styles.srOnly}>Menu</span>
				</button>
				<nav
					id={menuId}
					className={styles.links}
					onClick={(event) => {
						const target = event.target
						if (target instanceof HTMLAnchorElement) closeMenu()
					}}
				>
					{current === 'home' ? <a href="#gallery">Gallery</a> : <Link to="/#gallery">Gallery</Link>}
					<Link to="/blog" aria-current={current === 'notebook' ? 'page' : undefined}>
						Notebook
					</Link>
					{current === 'home' ? <a href="#about">About</a> : <Link to="/#about">About</Link>}
					<ParentSiteLink />
				</nav>
			</div>
		</header>
	)
}
