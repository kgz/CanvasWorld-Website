import { describe, it, expect } from 'vitest'
import { polygoniseGrid } from '../../utils/isosurface'
import {
	GYROID_MAX_POINTS,
	clampIso,
	clampTiles,
	gyroidField,
	sampleGyroidCloud,
} from '../../utils/gyroid'

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

describe('sampleGyroidCloud', () => {
	it('builds a fixed-size particle cloud', () => {
		const cloud = sampleGyroidCloud(0, 1)
		expect(cloud.count).toBe(GYROID_MAX_POINTS)
		expect(cloud.positions.length).toBe(GYROID_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < 300; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})

	it('samples default cell in under 8s', () => {
		const t0 = Date.now()
		const cloud = sampleGyroidCloud(0, 1)
		const ms = Date.now() - t0
		expect(cloud.count).toBe(GYROID_MAX_POINTS)
		expect(ms).toBeLessThan(8000)
	})

	it('clamps params', () => {
		expect(clampIso(9)).toBe(1.2)
		expect(clampIso(-9)).toBe(-1.2)
		expect(clampTiles(0)).toBe(1)
		expect(clampTiles(8)).toBe(2)
	})
})

describe('gyroid colors', () => {
	it('has saturated non-gray variance', () => {
		const cloud = sampleGyroidCloud()
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
