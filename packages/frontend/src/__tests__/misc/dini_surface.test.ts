import { describe, it, expect } from 'vitest'
import { buildDiniMesh, clampRadius, clampTwist, diniPoint } from '../../utils/diniSurface'

describe('diniPoint', () => {
	it('matches the classic formula on a sample', () => {
		const a = 1
		const b = 0.2
		const u = 1.1
		const v = 0.5
		const p = diniPoint(u, v, a, b)
		expect(p.x).toBeCloseTo(a * Math.cos(u) * Math.sin(v), 12)
		expect(p.y).toBeCloseTo(a * Math.sin(u) * Math.sin(v), 12)
		expect(p.z).toBeCloseTo(a * (Math.cos(v) + Math.log(Math.tan(v / 2))) + b * u, 12)
	})

	it('is independent of u in z when twist is zero', () => {
		const v = 0.4
		const a = 1.2
		const z0 = diniPoint(0, v, a, 0).z
		const z1 = diniPoint(4, v, a, 0).z
		expect(z0).toBeCloseTo(z1, 12)
	})

	it('stays finite when tan(v/2) would vanish', () => {
		const p = diniPoint(0, 0, 1, 0.2)
		expect(Number.isFinite(p.x)).toBe(true)
		expect(Number.isFinite(p.y)).toBe(true)
		expect(Number.isFinite(p.z)).toBe(true)
	})
})

describe('buildDiniMesh', () => {
	it('builds a finite indexed mesh', () => {
		const mesh = buildDiniMesh(1, 0.2)
		expect(mesh.indices.length).toBeGreaterThan(100)
		expect(mesh.indices.length % 3).toBe(0)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})

	it('clamps radius and twist', () => {
		expect(clampRadius(0)).toBe(0.15)
		expect(clampRadius(9)).toBe(3)
		expect(clampTwist(-1)).toBe(0)
		expect(clampTwist(4)).toBe(1.2)
	})
})
