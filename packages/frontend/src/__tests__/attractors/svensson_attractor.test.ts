import { describe, expect, it } from 'vitest'
import { svenssonAttractorTick } from '../../utils/svenssonAttractor'

describe('Svensson attractor', () => {
	it('matches the discrete map equations', () => {
		const x = 0.03
		const y = 0.01
		const params = { a: -3, b: 3, c: 3, d: 3 }

		const result = svenssonAttractorTick(x, y, params)

		expect(result.x).toBeCloseTo(params.d * Math.sin(params.a * x) - Math.sin(params.b * y), 10)
		expect(result.y).toBeCloseTo(params.c * Math.cos(params.a * x) + Math.cos(params.b * y), 10)
	})

	it('stays finite over many iterations', () => {
		const params = { a: -3, b: 3, c: 3, d: 3 }
		let x = 0
		let y = 0

		for (let i = 0; i < 500; i++) {
			const next = svenssonAttractorTick(x, y, params)
			expect(Number.isFinite(next.x)).toBe(true)
			expect(Number.isFinite(next.y)).toBe(true)
			x = next.x
			y = next.y
		}
	})
})
