import { describe, it, expect } from 'vitest'
import { bogdanovMapTick } from '../../pages/maps/bogdanov_map'

describe('Bogdanov Map', () => {
	it('should calculate next values correctly with default parameters', () => {
		const x = 0.1, y = 0
		const a = 0.0025, b = 1.44

		const result = bogdanovMapTick(x, y, a, b)

		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
		expect(result.x).not.toBe(x)
		expect(result.y).not.toBe(y)
	})

	it('should maintain mathematical consistency', () => {
		const x = 0.1, y = 0
		const a = 0.0025, b = 1.44

		const result = bogdanovMapTick(x, y, a, b)

		const expectedNx = x + y + a * y + b * x * (x - 1) - 0.1 * x * y
		const expectedNy = y + a * y + b * x * (x - 1) - 0.1 * x * y

		expect(Math.abs(result.x - expectedNx)).toBeLessThan(0.0001)
		expect(Math.abs(result.y - expectedNy)).toBeLessThan(0.0001)
	})

	it('should handle parameters at min limits', () => {
		const x = 0.1, y = 0
		const a = 0, b = 0.5 // Min limits

		const result = bogdanovMapTick(x, y, a, b)

		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
	})

	it('should handle parameters at max limits', () => {
		const x = 0.1, y = 0
		const a = 0.01, b = 2.5 // Max limits

		const result = bogdanovMapTick(x, y, a, b)

		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
	})

	it('should generate different patterns for different parameters', () => {
		const x = 0.1, y = 0
		const a1 = 0.0025, b1 = 1.44
		const a2 = 0.005, b2 = 1.8

		const result1 = bogdanovMapTick(x, y, a1, b1)
		const result2 = bogdanovMapTick(x, y, a2, b2)

		expect(result1.x).not.toBe(result2.x)
		expect(result1.y).not.toBe(result2.y)
	})

	it('should handle different initial positions', () => {
		const a = 0.0025, b = 1.44
		const pos1 = { x: 0.1, y: 0 }
		const pos2 = { x: 0.5, y: 0.2 }

		const result1 = bogdanovMapTick(pos1.x, pos1.y, a, b)
		const result2 = bogdanovMapTick(pos2.x, pos2.y, a, b)

		expect(isFinite(result1.x)).toBe(true)
		expect(isFinite(result1.y)).toBe(true)
		expect(isFinite(result2.x)).toBe(true)
		expect(isFinite(result2.y)).toBe(true)
	})

	it('should be deterministic for same inputs', () => {
		const x = 0.1, y = 0
		const a = 0.0025, b = 1.44

		const result1 = bogdanovMapTick(x, y, a, b)
		const result2 = bogdanovMapTick(x, y, a, b)

		expect(result1.x).toBe(result2.x)
		expect(result1.y).toBe(result2.y)
	})

	it('should handle edge case values', () => {
		const a = 0.0025, b = 1.44
		
		// Test with very small values
		const result1 = bogdanovMapTick(0.001, 0.001, a, b)
		expect(isFinite(result1.x)).toBe(true)
		expect(isFinite(result1.y)).toBe(true)

		// Test with larger values
		const result2 = bogdanovMapTick(1.0, 1.0, a, b)
		expect(isFinite(result2.x)).toBe(true)
		expect(isFinite(result2.y)).toBe(true)
	})
})