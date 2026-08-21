import { describe, it, expect } from 'vitest'
import {
	CALABI_MAX_POINTS,
	cadd,
	clampDegree,
	clampProj,
	clampRes,
	cpow,
	fermatPair,
	projectCalabiYau,
	sampleCalabiYauCloud,
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

	it('clamps degree, proj, and res', () => {
		expect(clampDegree(1.2)).toBe(2)
		expect(clampDegree(9)).toBe(8)
		expect(clampProj(-1)).toBe(0)
		expect(clampProj(4)).toBe(Math.PI)
		expect(clampRes(3)).toBe(6)
		expect(clampRes(80)).toBe(36)
	})
})

describe('sampleCalabiYauCloud', () => {
	it('builds a fixed-size particle cloud', () => {
		const cloud = sampleCalabiYauCloud(5, 0.4)
		expect(cloud.count).toBe(CALABI_MAX_POINTS)
		expect(cloud.positions.length).toBe(CALABI_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < 300; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})

	it('keeps count stable across degree changes', () => {
		const a = sampleCalabiYauCloud(3, 0.2)
		const b = sampleCalabiYauCloud(8, 1.1)
		expect(a.count).toBe(CALABI_MAX_POINTS)
		expect(b.count).toBe(CALABI_MAX_POINTS)
	})
})

describe('calabi colors', () => {
	it('has saturated non-gray variance', () => {
		const cloud = sampleCalabiYauCloud(5, 0.4)
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
