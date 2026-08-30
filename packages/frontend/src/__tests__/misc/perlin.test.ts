import { describe, it, expect } from 'vitest'
import {
	PERLIN_DEFAULTS,
	clampOctaves,
	clampScale,
	clampSpeed,
	fbm2,
	perlin2,
} from '../../utils/perlin'

describe('perlin2', () => {
	it('returns finite values near the origin', () => {
		for (let i = 0; i < 40; i++) {
			const x = i * 0.17
			const y = i * 0.13
			expect(Number.isFinite(perlin2(x, y))).toBe(true)
		}
	})

	it('is continuous across integer lattice edges', () => {
		const a = perlin2(1 - 1e-6, 0.3)
		const b = perlin2(1 + 1e-6, 0.3)
		expect(Math.abs(a - b)).toBeLessThan(1e-3)
	})

	it('stays roughly in [-1.5, 1.5]', () => {
		let min = Infinity
		let max = -Infinity
		for (let x = 0; x < 8; x += 0.25) {
			for (let y = 0; y < 8; y += 0.25) {
				const v = perlin2(x, y)
				min = Math.min(min, v)
				max = Math.max(max, v)
			}
		}
		expect(min).toBeGreaterThan(-1.5)
		expect(max).toBeLessThan(1.5)
	})
})

describe('fbm2', () => {
	it('normalizes across octaves', () => {
		const a = fbm2(0.4, 0.7, 1)
		const b = fbm2(0.4, 0.7, 4)
		expect(Number.isFinite(a)).toBe(true)
		expect(Number.isFinite(b)).toBe(true)
		expect(Math.abs(b)).toBeLessThan(1.2)
	})
})

describe('clamps', () => {
	it('clamps GUI ranges', () => {
		expect(clampScale(0)).toBe(0.5)
		expect(clampScale(99)).toBe(20)
		expect(clampOctaves(0)).toBe(1)
		expect(clampOctaves(9.7)).toBe(6)
		expect(clampSpeed(-1)).toBe(0)
		expect(clampSpeed(3)).toBe(2)
		expect(PERLIN_DEFAULTS.scale).toBe(4)
	})
})
