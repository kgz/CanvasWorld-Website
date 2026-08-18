import { describe, it, expect } from 'vitest'
import { boyPoint, buildBoyMesh } from '../../utils/boySurface'

describe('boyPoint', () => {
	it('is finite at the origin', () => {
		const p = boyPoint(0, 0)
		expect(p).not.toBeNull()
		if (p === null) {
			return
		}
		expect(Number.isFinite(p.x)).toBe(true)
		expect(Number.isFinite(p.y)).toBe(true)
		expect(Number.isFinite(p.z)).toBe(true)
	})
})

describe('buildBoyMesh', () => {
	it('builds a finite mesh', () => {
		const mesh = buildBoyMesh()
		expect(mesh.indices.length).toBeGreaterThan(100)
		expect(mesh.indices.length % 3).toBe(0)
		expect(mesh.indices.length / 3).toBeGreaterThan(100)
		expect(mesh.colors.length).toBe(mesh.positions.length)
		for (let i = 0; i < mesh.positions.length; i++) {
			expect(Number.isFinite(mesh.positions[i])).toBe(true)
		}
	})
})
