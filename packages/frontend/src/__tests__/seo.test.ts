import { describe, expect, it } from 'vitest'
import { categorySearchHeading, publicIconUrl, publicPageUrl, thumbAlt } from '../modules/seo'

describe('thumbAlt', () => {
	it('joins title with the first description clause', () => {
		expect(
			thumbAlt(
				'Hilbert Curve',
				'Space-filling path on the unit square. Higher order, finer grid.',
			),
		).toBe('Hilbert Curve: Space-filling path on the unit square')
	})

	it('truncates long alts', () => {
		const alt = thumbAlt('Title', `${'word '.repeat(80)}.`)
		expect(alt.length).toBeLessThanOrEqual(160)
		expect(alt.endsWith('…')).toBe(true)
	})

	it('falls back to title when description is empty', () => {
		expect(thumbAlt('Lorenz Attractor', '')).toBe('Lorenz Attractor')
	})
})

describe('categorySearchHeading', () => {
	it('uses student-style phrasing per catalog category', () => {
		expect(categorySearchHeading('attractor')).toMatch(/attractor/i)
		expect(categorySearchHeading('map')).toMatch(/maps/i)
		expect(categorySearchHeading('fractal')).toMatch(/fractal/i)
	})
})

describe('public URLs', () => {
	it('builds icon and page URLs under matf.dev/chaos', () => {
		expect(publicIconUrl('lorenz_attractor')).toBe(
			'https://matf.dev/chaos/icons/lorenz_attractor.png',
		)
		expect(publicPageUrl('/lorenz_attractor')).toBe('https://matf.dev/chaos/lorenz_attractor')
	})
})
