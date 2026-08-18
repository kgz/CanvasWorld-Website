import { describe, it, expect } from 'vitest'
import { romanPoint, buildRomanSurfaceMesh } from '../../utils/romanSurface'

describe('romanPoint', () => {
	it('matches Steiner at a known sample', () => {
		const p = romanPoint(Math.PI / 4, Math.PI / 4)
		expect(p.x).toBeCloseTo(0.5 * Math.SQRT1_2, 10)
		expect(p.y).toBeCloseTo(0.5 * Math.SQRT1_2, 10)
		expect(p.z).toBeCloseTo(0.25, 10)
	})
})

describe('buildRomanSurfaceMesh', () => {
	it('builds a finite mesh', () => {
		const mesh = buildRomanSurfaceMesh()
		expect(mesh.indices.length).toBeGreaterThan(100)
		expect(mesh.indices.length % 3).toBe(0)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})
})
