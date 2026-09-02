import { describe, expect, it } from 'vitest'
import { fractalDreamAttractorTick } from '../../utils/fractalDreamAttractor'

describe('Fractal Dream attractor', () => {
	it('matches the discrete map equations', () => {
		const x = -2
		const y = -2
		const params = { a: 1.1, b: 2.764, c: 1.07, d: 1.561 }

		const result = fractalDreamAttractorTick(x, y, params)

		expect(result.x).toBeCloseTo(Math.sin(params.b * y) + params.c * Math.sin(params.b * x), 10)
		expect(result.y).toBeCloseTo(Math.sin(params.a * x) + params.d * Math.sin(params.a * y), 10)
	})

	it('stays finite over many iterations', () => {
		const params = { a: 1.1, b: 2.764, c: 1.07, d: 1.561 }
		let x = -2
		let y = -2

		for (let i = 0; i < 500; i++) {
			const next = fractalDreamAttractorTick(x, y, params)
			expect(Number.isFinite(next.x)).toBe(true)
			expect(Number.isFinite(next.y)).toBe(true)
			x = next.x
			y = next.y
		}
	})
})
