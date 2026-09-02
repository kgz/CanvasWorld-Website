import { describe, expect, it } from 'vitest'
import { gumowskiMiraAttractorTick } from '../../utils/gumowskiMiraAttractor'

describe('Gumowski-Mira attractor', () => {
	it('matches the discrete map equations', () => {
		const x = 0
		const y = 0.5
		const params = { a: 0.008, b: 0.05, mu: -0.9 }

		const result = gumowskiMiraAttractorTick(x, y, params)

		const g = (v: number) => params.mu * v + (2 * (1 - params.mu) * v ** 2) / (1 + v ** 2)
		const expectedX = y + params.a * (1 - params.b * y ** 2) * y + g(x)
		const expectedY = -x + g(expectedX)

		expect(result.x).toBeCloseTo(expectedX, 10)
		expect(result.y).toBeCloseTo(expectedY, 10)
	})

	it('stays finite over many iterations', () => {
		const params = { a: 0.008, b: 0.05, mu: -0.9 }
		let x = 0
		let y = 0.5

		for (let i = 0; i < 500; i++) {
			const next = gumowskiMiraAttractorTick(x, y, params)
			expect(Number.isFinite(next.x)).toBe(true)
			expect(Number.isFinite(next.y)).toBe(true)
			x = next.x
			y = next.y
		}
	})
})
