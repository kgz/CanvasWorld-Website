import { describe, it, expect } from 'vitest'
import {
	SCHWARZ_MAX_POINTS,
	clampIso,
	clampTiles,
	sampleSchwarzPCloud,
	schwarzPField,
} from '../../utils/schwarzP'

describe('schwarzPField', () => {
	it('is 2π-periodic', () => {
		const x = 0.7
		const y = 1.1
		const z = 2.2
		const tau = Math.PI * 2
		expect(schwarzPField(x + tau, y, z)).toBeCloseTo(schwarzPField(x, y, z), 10)
		expect(schwarzPField(x, y + tau, z)).toBeCloseTo(schwarzPField(x, y, z), 10)
		expect(schwarzPField(x, y, z + tau)).toBeCloseTo(schwarzPField(x, y, z), 10)
	})

	it('vanishes at (π/2, π/2, π/2)', () => {
		const h = Math.PI / 2
		expect(schwarzPField(h, h, h)).toBeCloseTo(0, 12)
	})
})

describe('sampleSchwarzPCloud', () => {
	it('builds a fixed-size particle cloud', () => {
		const cloud = sampleSchwarzPCloud(0, 1)
		expect(cloud.count).toBe(SCHWARZ_MAX_POINTS)
		expect(cloud.positions.length).toBe(SCHWARZ_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < 300; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})

	it('builds a 32-sample cell in under 8s', () => {
		const t0 = Date.now()
		const cloud = sampleSchwarzPCloud(0, 1)
		const ms = Date.now() - t0
		expect(cloud.count).toBe(SCHWARZ_MAX_POINTS)
		expect(ms).toBeLessThan(8000)
	})

	it('clamps params', () => {
		expect(clampIso(9)).toBe(1.2)
		expect(clampIso(-9)).toBe(-1.2)
		expect(clampTiles(0)).toBe(1)
		expect(clampTiles(8)).toBe(2)
	})
})

describe('schwarz colors', () => {
	it('has saturated non-gray variance', () => {
		const cloud = sampleSchwarzPCloud(0, 1)
		let maxChroma = 0
		for (let i = 0; i < 5000; i++) {
			const r = cloud.colors[i * 3]
			const g = cloud.colors[i * 3 + 1]
			const b = cloud.colors[i * 3 + 2]
			maxChroma = Math.max(maxChroma, Math.max(r, g, b) - Math.min(r, g, b))
		}
		expect(maxChroma).toBeGreaterThan(0.3)
	})
})
