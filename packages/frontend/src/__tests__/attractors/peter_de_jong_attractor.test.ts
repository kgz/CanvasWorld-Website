import { describe, expect, it } from 'vitest'
import { peterDeJongAttractorTick } from '../../utils/peterDeJongAttractor'

describe('Peter de Jong attractor', () => {
	it('matches the discrete map equations', () => {
		const x = 0.03
		const y = 0.01
		const params = { a: 2.695, b: 1.72, c: 1.178, d: 0.311 }

		const result = peterDeJongAttractorTick(x, y, params)

		expect(result.x).toBeCloseTo(Math.sin(params.a * y) - Math.cos(params.b * x), 10)
		expect(result.y).toBeCloseTo(Math.sin(params.c * x) - Math.cos(params.d * y), 10)
	})

	it('stays finite over many iterations', () => {
		const params = { a: 2.695, b: 1.72, c: 1.178, d: 0.311 }
		let x = 0
		let y = 0

		for (let i = 0; i < 500; i++) {
			const next = peterDeJongAttractorTick(x, y, params)
			expect(Number.isFinite(next.x)).toBe(true)
			expect(Number.isFinite(next.y)).toBe(true)
			x = next.x
			y = next.y
		}
	})
})
