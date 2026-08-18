import { describe, it, expect } from 'vitest'
import { barthField, buildBarthMesh } from '../../utils/barthSextic'

describe('barthField', () => {
	it('is negative at the origin', () => {
		const phi = (1 + Math.sqrt(5)) / 2
		expect(barthField(0, 0, 0)).toBeCloseTo(-(1 + 2 * phi), 10)
	})

	it('changes sign between origin and a far axis point', () => {
		expect(barthField(0, 0, 0)).toBeLessThan(0)
		expect(barthField(-2, -2, -2)).toBeGreaterThan(0)
	})
})

describe('buildBarthMesh', () => {
	it('builds a finite mesh', () => {
		const mesh = buildBarthMesh()
		expect(mesh.indices.length).toBeGreaterThan(100)
		expect(mesh.indices.length % 3).toBe(0)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})
})
