import { describe, it, expect } from 'vitest'
import {
	buildCalabiYauMesh,
	cadd,
	clampDegree,
	clampRes,
	cpow,
	fermatPair,
	projectCalabiYau,
} from '../../utils/calabiYau'

describe('Calabi–Yau Hanson slice', () => {
	it('satisfies z1^n + z2^n ≈ 1 on a sample', () => {
		const n = 5
		const { z1, z2 } = fermatPair(0.4, 0.2, n, 1, 3)
		const sum = cadd(cpow(z1, n), cpow(z2, n))
		expect(sum.re).toBeCloseTo(1, 6)
		expect(sum.im).toBeCloseTo(0, 6)
	})

	it('projects to finite R3', () => {
		const { z1, z2 } = fermatPair(0.7, -0.3, 5, 0, 0)
		const p = projectCalabiYau(z1, z2, 0.4)
		expect(Number.isFinite(p.x)).toBe(true)
		expect(Number.isFinite(p.y)).toBe(true)
		expect(Number.isFinite(p.z)).toBe(true)
	})

	it('builds n×n patches at the requested resolution', () => {
		const n = 5
		const res = 8
		const mesh = buildCalabiYauMesh(n, 0.4, res)
		const vertsPerPatch = (res + 1) * (res + 1)
		expect(mesh.positions.length / 3).toBe(n * n * vertsPerPatch)
		expect(mesh.indices.length).toBe(n * n * res * res * 6)
		expect(mesh.colors.length).toBe(mesh.positions.length)
	})

	it('clamps degree and res', () => {
		expect(clampDegree(1.2)).toBe(2)
		expect(clampDegree(9)).toBe(8)
		expect(clampRes(3)).toBe(6)
		expect(clampRes(80)).toBe(36)
	})
})
