import { describe, it, expect } from 'vitest'
import {
	clampMargin,
	COSTA_MAX_POINTS,
	costaPoint,
	DEFAULT_MARGIN,
	E1,
	MARGIN_MAX,
	MARGIN_MIN,
	sampleCostaCloud,
	weierstrassP,
} from '../../utils/costaSurface'

describe('weierstrass / Costa point', () => {
	it('has a real e1 near the classical square-lattice value', () => {
		expect(E1).toBeGreaterThan(6.8)
		expect(E1).toBeLessThan(7.0)
		expect(weierstrassP(0.5, 0).im).toBeCloseTo(0, 6)
	})

	it('puts the diagonal on a horizontal line (x≈y, z≈0)', () => {
		const p = costaPoint(0.25, 0.25)
		expect(p.x).toBeCloseTo(p.y, 8)
		expect(p.z).toBeCloseTo(0, 8)
	})

	it('returns finite samples away from punctures', () => {
		const p = costaPoint(0.3, 0.4)
		expect(Number.isFinite(p.x)).toBe(true)
		expect(Number.isFinite(p.y)).toBe(true)
		expect(Number.isFinite(p.z)).toBe(true)
	})
})

describe('sampleCostaCloud', () => {
	it('builds a padded point cloud', () => {
		const cloud = sampleCostaCloud(DEFAULT_MARGIN)
		expect(cloud.count).toBe(COSTA_MAX_POINTS)
		expect(cloud.positions.length).toBe(COSTA_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(COSTA_MAX_POINTS * 3)
		for (let i = 0; i < cloud.positions.length; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
		let maxR = 0
		for (let i = 0; i < COSTA_MAX_POINTS; i++) {
			const r = Math.hypot(
				cloud.positions[i * 3],
				cloud.positions[i * 3 + 1],
				cloud.positions[i * 3 + 2],
			)
			if (r > maxR) {
				maxR = r
			}
		}
		expect(maxR).toBeGreaterThan(0.5)
		expect(maxR).toBeLessThan(2.5)
	})

	it('clamps margin', () => {
		expect(clampMargin(0)).toBe(MARGIN_MIN)
		expect(clampMargin(9)).toBe(MARGIN_MAX)
		expect(clampMargin(DEFAULT_MARGIN)).toBe(DEFAULT_MARGIN)
	})
})
