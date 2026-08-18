import { describe, it, expect } from 'vitest'
import { buildSchwarzPMesh, clampIso, clampTiles, schwarzPField } from '../../utils/schwarzP'

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

describe('buildSchwarzPMesh', () => {
	it('builds a finite default cell', () => {
		const mesh = buildSchwarzPMesh(0, 1)
		expect(mesh.indices.length).toBeGreaterThan(100)
		expect(mesh.positions.length).toBeGreaterThan(0)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		expect(mesh.indices.length % 3).toBe(0)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})

	it('builds a 36-sample cell in under 8s', () => {
		const t0 = Date.now()
		const mesh = buildSchwarzPMesh(0, 1)
		const ms = Date.now() - t0
		expect(mesh.indices.length).toBeGreaterThan(1000)
		expect(ms).toBeLessThan(8000)
	})

	it('clamps params', () => {
		expect(clampIso(9)).toBe(1.2)
		expect(clampIso(-9)).toBe(-1.2)
		expect(clampTiles(0)).toBe(1)
		expect(clampTiles(8)).toBe(2)
	})
})
