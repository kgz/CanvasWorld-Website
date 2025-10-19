import { describe, it, expect } from 'vitest'
import { bogdanovMapTick } from '../../pages/maps/bogdanov_map'

describe('Bogdanov Map', () => {
	it('should calculate next values correctly', () => {
		const x = 0.1, y = 0
		const a = 0.0025, b = 1.44
		
		const result = bogdanovMapTick(x, y, a, b)
		
		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
		expect(result.x).not.toBe(x)
		expect(result.y).not.toBe(y)
	})

	it('should handle edge case when a is very small', () => {
		const x = 0.1, y = 0
		const a = 0.0001, b = 1.5
		
		const result = bogdanovMapTick(x, y, a, b)
		
		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
	})

	it('should handle edge case when a is zero', () => {
		const x = 0.1, y = 0
		const a = 0, b = 1.5
		
		const result = bogdanovMapTick(x, y, a, b)
		
		expect(isFinite(result.x)).toBe(true)
		expect(isFinite(result.y)).toBe(true)
	})

	it('should maintain mathematical consistency', () => {
		const x = 0.1, y = 0
		const a = 0.0025, b = 1.44
		
		const result = bogdanovMapTick(x, y, a, b)
		
		// Verify the mathematical equations
		const expectedX = y + 1 - a * x * x
		const expectedY = b * x
		
		expect(Math.abs(result.x - expectedX)).toBeLessThan(0.0001)
		expect(Math.abs(result.y - expectedY)).toBeLessThan(0.0001)
	})

	it('should generate different patterns for different parameters', () => {
		const x = 0.1, y = 0
		
		const result1 = bogdanovMapTick(x, y, 0.001, 1.2)
		const result2 = bogdanovMapTick(x, y, 0.005, 1.8)
		
		expect(result1.x).not.toBe(result2.x)
		expect(result1.y).not.toBe(result2.y)
	})

	it('should handle parameter ranges correctly', () => {
		const x = 0.1, y = 0
		
		// Test minimum values
		const minResult = bogdanovMapTick(x, y, 0, 0.5)
		expect(isFinite(minResult.x)).toBe(true)
		expect(isFinite(minResult.y)).toBe(true)
		
		// Test maximum values
		const maxResult = bogdanovMapTick(x, y, 0.01, 2.5)
		expect(isFinite(maxResult.x)).toBe(true)
		expect(isFinite(maxResult.y)).toBe(true)
	})
})
