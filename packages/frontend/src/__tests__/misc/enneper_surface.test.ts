import { describe, it, expect } from 'vitest'
import {
	buildEnneperMesh,
	clampSpan,
	DEFAULT_SPAN,
	enneperPoint,
	SPAN_MAX,
	SPAN_MIN,
	UV_RES,
} from '../../utils/enneperSurface'

describe('enneperPoint', () => {
	it('maps the origin to the origin', () => {
		const p = enneperPoint(0, 0)
		expect(p.x).toBeCloseTo(0, 12)
		expect(p.y).toBeCloseTo(0, 12)
		expect(p.z).toBeCloseTo(0, 12)
	})

	it('matches the classical polynomial on axis samples', () => {
		const a = enneperPoint(1, 0)
		expect(a.x).toBeCloseTo(2 / 3, 12)
		expect(a.y).toBeCloseTo(0, 12)
		expect(a.z).toBeCloseTo(1, 12)

		const b = enneperPoint(0, 1)
		expect(b.x).toBeCloseTo(0, 12)
		expect(b.y).toBeCloseTo(2 / 3, 12)
		expect(b.z).toBeCloseTo(-1, 12)

		const c = enneperPoint(1, 1)
		expect(c.x).toBeCloseTo(5 / 3, 12)
		expect(c.y).toBeCloseTo(5 / 3, 12)
		expect(c.z).toBeCloseTo(0, 12)
	})
})

describe('buildEnneperMesh', () => {
	it('builds a finite UV-grid mesh', () => {
		const mesh = buildEnneperMesh(DEFAULT_SPAN)
		expect(mesh.positions.length / 3).toBe((UV_RES + 1) * (UV_RES + 1))
		expect(mesh.indices.length).toBe(UV_RES * UV_RES * 6)
		expect(mesh.indices.length % 3).toBe(0)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})

	it('clamps span', () => {
		expect(clampSpan(0)).toBe(SPAN_MIN)
		expect(clampSpan(9)).toBe(SPAN_MAX)
		expect(clampSpan(DEFAULT_SPAN)).toBe(DEFAULT_SPAN)
	})
})
