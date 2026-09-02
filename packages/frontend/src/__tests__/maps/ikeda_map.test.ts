import { describe, expect, it } from 'vitest'
import { ikedaMapTick } from '../../utils/ikedaMap'

describe('Ikeda map', () => {
	it('matches the discrete map equations', () => {
		const x = 0.03
		const y = 0.01
		const a = 0.87719

		const result = ikedaMapTick(x, y, a)

		const g = 0.4 - 6 / (1 + x ** 2 + y ** 2)
		expect(result.x).toBeCloseTo(1 + a * (x * Math.cos(g) - y * Math.sin(g)), 10)
		expect(result.y).toBeCloseTo(a * (x * Math.sin(g) + y * Math.cos(g)), 10)
	})

	it('stays finite over many iterations', () => {
		const a = 0.87719
		let x = 0
		let y = 0

		for (let i = 0; i < 500; i++) {
			const next = ikedaMapTick(x, y, a)
			expect(Number.isFinite(next.x)).toBe(true)
			expect(Number.isFinite(next.y)).toBe(true)
			x = next.x
			y = next.y
		}
	})
})
