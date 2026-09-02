import { describe, expect, it } from 'vitest'
import { henonMapTick } from '../../utils/henonMap'

describe('Hénon map', () => {
	it('matches the classic map equations', () => {
		const x = 0.03
		const y = 0.01
		const params = { a: 1.4, b: 0.3 }

		const result = henonMapTick(x, y, params)

		expect(result.x).toBeCloseTo(1 - params.a * x * x + y, 10)
		expect(result.y).toBeCloseTo(params.b * x, 10)
	})

	it('stays finite over many iterations', () => {
		const params = { a: 1.4, b: 0.3 }
		let x = 0.03
		let y = 0.01

		for (let i = 0; i < 500; i++) {
			const next = henonMapTick(x, y, params)
			expect(Number.isFinite(next.x)).toBe(true)
			expect(Number.isFinite(next.y)).toBe(true)
			x = next.x
			y = next.y
		}
	})
})
