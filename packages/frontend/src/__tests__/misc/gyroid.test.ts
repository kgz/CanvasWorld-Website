import { describe, it, expect } from 'vitest'
import { polygoniseGrid } from '../../utils/isosurface'
import { buildGyroidMesh, clampIso, clampRes, clampTiles, gyroidField } from '../../utils/gyroid'

describe('gyroid field', () => {
	it('is 2π-periodic', () => {
		const x = 0.7
		const y = 1.1
		const z = 2.2
		const tau = Math.PI * 2
		expect(gyroidField(x + tau, y, z)).toBeCloseTo(gyroidField(x, y, z), 10)
		expect(gyroidField(x, y + tau, z)).toBeCloseTo(gyroidField(x, y, z), 10)
		expect(gyroidField(x, y, z + tau)).toBeCloseTo(gyroidField(x, y, z), 10)
	})

	it('vanishes at the origin', () => {
		expect(gyroidField(0, 0, 0)).toBeCloseTo(0, 12)
	})
})

describe('polygoniseGrid', () => {
	it('extracts a plane from a linear field', () => {
		const nx = 4
		const values = new Float32Array(nx * nx * nx)
		for (let k = 0; k < nx; k++) {
			for (let j = 0; j < nx; j++) {
				for (let i = 0; i < nx; i++) {
					values[i + nx * (j + nx * k)] = i - 1.5
				}
			}
		}
		const mesh = polygoniseGrid(values, nx, nx, nx, [0, 0, 0], [1, 1, 1])
		expect(mesh.indices.length).toBeGreaterThan(0)
		expect(mesh.indices.length % 3).toBe(0)
	})
})

describe('buildGyroidMesh', () => {
	it('builds a finite default cell', () => {
		const mesh = buildGyroidMesh(0, 16, 1)
		expect(mesh.indices.length).toBeGreaterThan(100)
		expect(mesh.positions.length).toBeGreaterThan(0)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})

	it('builds a 36-sample cell in under 8s', () => {
		const t0 = Date.now()
		const mesh = buildGyroidMesh(0, 36, 1)
		const ms = Date.now() - t0
		expect(mesh.indices.length).toBeGreaterThan(1000)
		expect(ms).toBeLessThan(8000)
	})

	it('clamps params', () => {
		expect(clampIso(9)).toBe(1.2)
		expect(clampIso(-9)).toBe(-1.2)
		expect(clampRes(2)).toBe(16)
		expect(clampRes(99)).toBe(56)
		expect(clampTiles(0)).toBe(1)
		expect(clampTiles(8)).toBe(2)
	})
})
