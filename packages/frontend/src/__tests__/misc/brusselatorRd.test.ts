import { describe, expect, it } from 'vitest'
import {
	clampGridSize,
	laplacianNeumann,
	runBrusselatorRdSteps,
	sampleReflective,
	seedBrusselatorRd,
	stepBrusselatorRd,
} from '../../utils/brusselatorRd'

describe('Brusselator RD', () => {
	it('clamps grid size', () => {
		expect(clampGridSize(8)).toBe(32)
		expect(clampGridSize(96)).toBe(96)
		expect(clampGridSize(400)).toBe(192)
	})

	it('mirrors samples at reflective borders', () => {
		const size = 4
		const field = new Float32Array([
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
		])
		expect(sampleReflective(field, size, 0, 0)).toBe(1)
		expect(sampleReflective(field, size, -1, 0)).toBe(sampleReflective(field, size, 1, 0))
		expect(sampleReflective(field, size, 0, -1)).toBe(sampleReflective(field, size, 0, 1))
		expect(sampleReflective(field, size, size, 0)).toBe(sampleReflective(field, size, size - 2, 0))
	})

	it('laplacian is zero on a flat field', () => {
		const size = 8
		const field = new Float32Array(size * size)
		field.fill(2.5)
		expect(laplacianNeumann(field, size, 0, 0)).toBeCloseTo(0, 10)
		expect(laplacianNeumann(field, size, 3, 4)).toBeCloseTo(0, 10)
	})

	it('stays finite for Turing-ish defaults', () => {
		const field = seedBrusselatorRd(48, 1, 3)
		const params = { a: 1, b: 3, du: 1, dv: 8, dt: 0.01 }
		runBrusselatorRdSteps(field, params, 200)
		for (let i = 0; i < field.u.length; i++) {
			expect(isFinite(field.u[i] ?? NaN)).toBe(true)
			expect(isFinite(field.v[i] ?? NaN)).toBe(true)
			expect(field.u[i] ?? 0).toBeGreaterThanOrEqual(0)
			expect(field.v[i] ?? 0).toBeGreaterThanOrEqual(0)
		}
	})

	it('develops spatial variation from a noisy seed', () => {
		const field = seedBrusselatorRd(64, 1, 3, 0.1, 42)
		const params = { a: 1, b: 3, du: 1, dv: 8, dt: 0.01 }
		runBrusselatorRdSteps(field, params, 800)
		let min = Infinity
		let max = -Infinity
		for (let i = 0; i < field.u.length; i++) {
			const val = field.u[i] ?? 0
			if (val < min) min = val
			if (val > max) max = val
		}
		expect(max - min).toBeGreaterThan(0.15)
	})

	it('one step matches reaction + diffusion terms at an interior cell', () => {
		const field = seedBrusselatorRd(16, 1, 3, 0, 1)
		field.u[5 * 16 + 5] = 1.2
		field.v[5 * 16 + 5] = 2.5
		const beforeU = field.u[5 * 16 + 5] ?? 0
		const beforeV = field.v[5 * 16 + 5] ?? 0
		const params = { a: 1, b: 3, du: 1, dv: 8, dt: 0.01 }
		const lu = laplacianNeumann(field.u, 16, 5, 5)
		const lv = laplacianNeumann(field.v, 16, 5, 5)
		const u2v = beforeU * beforeU * beforeV
		const expectU = beforeU + (params.du * lu + params.a - (params.b + 1) * beforeU + u2v) * params.dt
		const expectV = beforeV + (params.dv * lv + params.b * beforeU - u2v) * params.dt
		stepBrusselatorRd(field, params)
		expect(field.u[5 * 16 + 5]).toBeCloseTo(expectU, 5)
		expect(field.v[5 * 16 + 5]).toBeCloseTo(expectV, 5)
	})
})
