import { describe, it, expect } from 'vitest'
import {
	POLYNOMIAL_ABS_DEFAULTS,
	POLYNOMIAL_ABS_MAX_POINTS,
	polynomialAbsTick,
	samplePolynomialAbsCloud,
} from '../../utils/polynomialMaps'

describe('polynomialAbsTick', () => {
	it('matches the absolute-value affine update', () => {
		const c = POLYNOMIAL_ABS_DEFAULTS
		const x = 0.2
		const y = -0.4
		const z = 0.1
		const ax = Math.abs(x)
		const ay = Math.abs(y)
		const az = Math.abs(z)
		const next = polynomialAbsTick(x, y, z, c)
		expect(next.x).toBeCloseTo(
			c.xa + c.xb * x + c.xc * y + c.xd * z + c.xe * ax + c.xf * ay + c.xg * az,
			10,
		)
		expect(next.y).toBeCloseTo(
			c.ya + c.yb * x + c.yc * y + c.yd * z + c.ye * ax + c.yf * ay + c.yg * az,
			10,
		)
		expect(next.z).toBeCloseTo(
			c.za + c.zb * x + c.zc * y + c.zd * z + c.ze * ax + c.zf * ay + c.zg * az,
			10,
		)
	})
})

describe('samplePolynomialAbsCloud', () => {
	it('builds a fixed-size centred cloud', () => {
		const cloud = samplePolynomialAbsCloud(POLYNOMIAL_ABS_DEFAULTS)
		expect(cloud.count).toBe(POLYNOMIAL_ABS_MAX_POINTS)
		expect(cloud.positions.length).toBe(POLYNOMIAL_ABS_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < 300; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
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
