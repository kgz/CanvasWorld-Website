import { describe, it, expect } from 'vitest'
import { gingerbreadManTick, sampleGingerbreadMan } from '../../utils/gingerbreadMan'

describe('Gingerbread Man', () => {
	it('matches the classic map equations', () => {
		const result = gingerbreadManTick(-0.1, 0)
		expect(result.x).toBeCloseTo(1 - 0 + Math.abs(-0.1), 10)
		expect(result.y).toBeCloseTo(-0.1, 10)
	})

	it('stays finite over many iterations', () => {
		const samples = sampleGingerbreadMan(20_000)
		expect(samples.length).toBe(20_000)
		for (const p of samples) {
			expect(isFinite(p.x)).toBe(true)
			expect(isFinite(p.y)).toBe(true)
			expect(Math.abs(p.x)).toBeLessThan(1e6)
			expect(Math.abs(p.y)).toBeLessThan(1e6)
		}
	})

	it('explores a non-trivial range (gingerbread silhouette)', () => {
		const samples = sampleGingerbreadMan(50_000)
		const xs = samples.map((p) => p.x)
		const ys = samples.map((p) => p.y)
		expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(1)
		expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(1)
	})
})
