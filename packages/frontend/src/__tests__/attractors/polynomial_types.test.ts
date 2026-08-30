import { describe, it, expect } from 'vitest'
import {
	POLYNOMIAL_MAP_MAX_POINTS,
	POLYNOMIAL_TYPE_A_DEFAULTS,
	POLYNOMIAL_TYPE_B_DEFAULTS,
	POLYNOMIAL_TYPE_C_DEFAULTS,
	polynomialTypeATick,
	polynomialTypeBTick,
	polynomialTypeCTick,
	samplePolynomialTypeACloud,
	samplePolynomialTypeBCloud,
	samplePolynomialTypeCCloud,
} from '../../utils/polynomialMaps'

describe('polynomialTypeATick', () => {
	it('matches the cyclic quadratic update', () => {
		const { a, b, c } = POLYNOMIAL_TYPE_A_DEFAULTS
		const x = 0.2
		const y = -0.3
		const z = 0.1
		const next = polynomialTypeATick(x, y, z, a, b, c)
		expect(next.x).toBeCloseTo(a + y - z * y, 10)
		expect(next.y).toBeCloseTo(b + z - x * z, 10)
		expect(next.z).toBeCloseTo(c + x - y * x, 10)
	})
})

describe('samplePolynomialTypeACloud', () => {
	it('builds a fixed-size centred cloud', () => {
		const { a, b, c } = POLYNOMIAL_TYPE_A_DEFAULTS
		const cloud = samplePolynomialTypeACloud(a, b, c)
		expect(cloud.count).toBe(POLYNOMIAL_MAP_MAX_POINTS)
		expect(cloud.positions.length).toBe(POLYNOMIAL_MAP_MAX_POINTS * 3)
		let maxR = 0
		for (let i = 0; i < cloud.count; i++) {
			const i3 = i * 3
			maxR = Math.max(
				maxR,
				Math.hypot(cloud.positions[i3], cloud.positions[i3 + 1], cloud.positions[i3 + 2]),
			)
		}
		expect(maxR).toBeGreaterThan(1.5)
		expect(maxR).toBeLessThan(2.1)
	})
})

describe('samplePolynomialTypeBCloud', () => {
	it('builds a fixed-size cloud from defaults', () => {
		const { a, b, c, d, e, f } = POLYNOMIAL_TYPE_B_DEFAULTS
		const cloud = samplePolynomialTypeBCloud(a, b, c, d, e, f)
		expect(cloud.count).toBe(POLYNOMIAL_MAP_MAX_POINTS)
		for (let i = 0; i < 300; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})
})

describe('polynomialTypeBTick', () => {
	it('applies scaled product terms', () => {
		const p = POLYNOMIAL_TYPE_B_DEFAULTS
		const x = 0.2
		const y = -0.3
		const z = 0.1
		const next = polynomialTypeBTick(x, y, z, p.a, p.b, p.c, p.d, p.e, p.f)
		expect(next.x).toBeCloseTo(p.a + y - z * (p.b * y), 10)
		expect(next.y).toBeCloseTo(p.c + z - x * (p.d * z), 10)
		expect(next.z).toBeCloseTo(p.e + x - y * (p.f * x), 10)
	})
})

describe('samplePolynomialTypeCCloud', () => {
	it('builds a fixed-size cloud from defaults', () => {
		const cloud = samplePolynomialTypeCCloud(POLYNOMIAL_TYPE_C_DEFAULTS)
		expect(cloud.count).toBe(POLYNOMIAL_MAP_MAX_POINTS)
		const next = polynomialTypeCTick(0.1, -0.2, 0.05, POLYNOMIAL_TYPE_C_DEFAULTS)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
	})
})
