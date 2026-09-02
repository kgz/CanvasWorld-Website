import { describe, it, expect } from 'vitest'
import { bogdanovMapTick } from '../../utils/bogdanovMap'

const defaultMu = -0.1

describe('Bogdanov Map', () => {
	it('should calculate next values correctly with default parameters', () => {
		const x = 0.1,
			y = 0
		const a = 0.0025,
			b = 1.44

		const result = bogdanovMapTick(x, y, a, b, defaultMu)

		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
		expect(result.x).not.toBe(x)
		expect(result.y).not.toBe(y)
	})

	it('should match y then x = x + y form', () => {
		const x = 0.1,
			y = 0
		const a = 0.0025,
			b = 1.44,
			mu = defaultMu

		const result = bogdanovMapTick(x, y, a, b, mu)

		const expectedNy = y + a * y + b * x * (x - 1) + mu * x * y
		const expectedNx = x + expectedNy

		expect(Math.abs(result.x - expectedNx)).toBeLessThan(0.0001)
		expect(Math.abs(result.y - expectedNy)).toBeLessThan(0.0001)
	})

	it('should handle parameters at min limits', () => {
		const result = bogdanovMapTick(0.1, 0, 0, 0.5, -0.5)

		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
	})

	it('should handle parameters at max limits', () => {
		const result = bogdanovMapTick(0.1, 0, 0.01, 2.5, 0.5)

		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
	})

	it('should generate different patterns for different parameters', () => {
		const result1 = bogdanovMapTick(0.1, 0, 0.0025, 1.44, defaultMu)
		const result2 = bogdanovMapTick(0.1, 0, 0.005, 1.8, defaultMu)

		expect(result1.x).not.toBe(result2.x)
		expect(result1.y).not.toBe(result2.y)
	})

	it('should respond to mu', () => {
		const result1 = bogdanovMapTick(0.5, 0.2, 0.0025, 1.44, -0.1)
		const result2 = bogdanovMapTick(0.5, 0.2, 0.0025, 1.44, 0.2)

		expect(result1.x).not.toBe(result2.x)
		expect(result1.y).not.toBe(result2.y)
	})

	it('should be deterministic for same inputs', () => {
		const result1 = bogdanovMapTick(0.1, 0, 0.0025, 1.44, defaultMu)
		const result2 = bogdanovMapTick(0.1, 0, 0.0025, 1.44, defaultMu)

		expect(result1.x).toBe(result2.x)
		expect(result1.y).toBe(result2.y)
	})

	it('should handle edge case values', () => {
		const result1 = bogdanovMapTick(0.001, 0.001, 0.0025, 1.44, defaultMu)
		expect(isFinite(result1.x)).toBe(true)
		expect(isFinite(result1.y)).toBe(true)

		const result2 = bogdanovMapTick(1.0, 1.0, 0.0025, 1.44, defaultMu)
		expect(isFinite(result2.x)).toBe(true)
		expect(isFinite(result2.y)).toBe(true)
	})
})
