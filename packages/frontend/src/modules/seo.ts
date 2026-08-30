export const PUBLIC_BASE = 'https://matf.dev/chaos'

export function publicIconUrl(slug: string): string {
	return `${PUBLIC_BASE}/icons/${slug}.png`
}

export function publicPageUrl(path: string): string {
	if (path === '' || path === '/') {
		return `${PUBLIC_BASE}/`
	}
	const p = path.startsWith('/') ? path : `/${path}`
	return `${PUBLIC_BASE}${p}`
}

/** Alt: catalog title plus first description clause. Not a filename. */
export function thumbAlt(title: string, description: string): string {
	const clause = firstClause(description)
	if (clause.length === 0 || clause === title) {
		return title
	}
	const combined = `${title}: ${clause}`
	if (combined.length <= 160) {
		return combined
	}
	return `${combined.slice(0, 159)}…`
}

export function categorySearchHeading(category: string): string {
	if (category === 'attractor') {
		return 'Interactive chaotic attractor visualizer'
	}
	if (category === 'map') {
		return 'Interactive 2D chaotic maps generator'
	}
	if (category === 'fractal') {
		return 'Space-filling curve and fractal visualizer'
	}
	if (category === 'misc') {
		return 'Interactive 3D surface and field visualizer'
	}
	return 'Interactive dynamical-systems visualizer'
}

function firstClause(description: string): string {
	const trimmed = description.trim()
	if (trimmed.length === 0) {
		return ''
	}
	const match = trimmed.match(/^(.+?)(?:[.!?]| — | – |;)/)
	if (match && match[1]) {
		return match[1].trim()
	}
	return trimmed
}
