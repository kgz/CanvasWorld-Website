import { describe, it, expect } from 'vitest'
import { clebschField, buildClebschMesh } from '../../utils/clebschCubic'

describe('clebschField', () => {
	it('is positive at the origin', () => {
		expect(clebschField(0, 0, 0)).toBe(1)
	})

	it('changes sign between origin and a far corner', () => {
		expect(clebschField(0, 0, 0)).toBeGreaterThan(0)
		expect(clebschField(2.5, 2.5, 2.5)).toBeLessThan(0)
	})
})

describe('buildClebschMesh', () => {
	it('builds a finite mesh', () => {
		const mesh = buildClebschMesh()
		expect(mesh.indices.length).toBeGreaterThan(100)
		expect(mesh.indices.length % 3).toBe(0)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})
})
