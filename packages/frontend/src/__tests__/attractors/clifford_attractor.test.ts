import { describe, expect, it } from 'vitest'
import { cliffordAttractorTick } from '../../utils/cliffordAttractor'

describe('Clifford Attractor', () => {
	it('matches the discrete map equations', () => {
		const x = -2
		const y = -2
		const params = { a: 1.7, b: 1.8, c: 1.9, d: 0.4 }

		const result = cliffordAttractorTick(x, y, params)

		expect(result.x).toBeCloseTo(
			Math.sin(params.a * y) + params.c * Math.cos(params.a * x),
			10,
		)
		expect(result.y).toBeCloseTo(
			Math.sin(params.b * x) + params.d * Math.cos(params.b * y),
			10,
		)
	})

	it('stays finite over many iterations', () => {
		const params = { a: 1.7, b: 1.8, c: 1.9, d: 0.4 }
		let x = -2
		let y = -2

		for (let i = 0; i < 500; i++) {
			const next = cliffordAttractorTick(x, y, params)
			expect(Number.isFinite(next.x)).toBe(true)
			expect(Number.isFinite(next.y)).toBe(true)
			x = next.x
			y = next.y
		}
	})
})
