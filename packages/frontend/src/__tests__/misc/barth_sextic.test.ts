import { describe, it, expect } from 'vitest'
import {
	BARTH_PHI,
	barthField,
	clampMix,
	clampRadius,
	clampTau,
	sampleBarthCloud,
} from '../../utils/barthSextic'

describe('barthField', () => {
	it('is negative at the origin for classic params', () => {
		expect(barthField(0, 0, 0)).toBeCloseTo(-(1 + 2 * BARTH_PHI), 10)
	})

	it('changes sign between origin and a far axis point', () => {
		expect(barthField(0, 0, 0)).toBeLessThan(0)
		expect(barthField(-2, -2, -2)).toBeGreaterThan(0)
	})

	it('responds to tau / radius / mix', () => {
		const a = barthField(0.8, 0.2, 0.1, BARTH_PHI, 1, 1)
		const b = barthField(0.8, 0.2, 0.1, 1.2, 1, 1)
		const c = barthField(0.8, 0.2, 0.1, BARTH_PHI, 0.7, 1)
		const d = barthField(0.8, 0.2, 0.1, BARTH_PHI, 1, 1.8)
		expect(a !== b).toBe(true)
		expect(a !== c).toBe(true)
		expect(a !== d).toBe(true)
		expect(clampTau(9)).toBe(2.2)
		expect(clampRadius(0)).toBe(0.45)
		expect(clampMix(9)).toBe(2.4)
	})
})

describe('sampleBarthCloud', () => {
	it('builds a finite particle cloud', () => {
		const cloud = sampleBarthCloud()
		expect(cloud.count).toBeGreaterThan(500)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < Math.min(cloud.positions.length, 300); i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})
})
