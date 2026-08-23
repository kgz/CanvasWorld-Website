import { describe, it, expect } from 'vitest'
import {
	buildCostaMesh,
	clampMargin,
	costaPoint,
	DEFAULT_MARGIN,
	E1,
	MARGIN_MAX,
	MARGIN_MIN,
	UV_RES,
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

describe('buildCostaMesh', () => {
	it('builds a finite truncated UV mesh', () => {
		const mesh = buildCostaMesh(DEFAULT_MARGIN)
		expect(mesh.positions.length / 3).toBe((UV_RES + 1) * (UV_RES + 1))
		expect(mesh.indices.length % 3).toBe(0)
		expect(mesh.indices.length).toBeGreaterThan(1000)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})

	it('clamps margin', () => {
		expect(clampMargin(0)).toBe(MARGIN_MIN)
		expect(clampMargin(9)).toBe(MARGIN_MAX)
		expect(clampMargin(DEFAULT_MARGIN)).toBe(DEFAULT_MARGIN)
	})
})
