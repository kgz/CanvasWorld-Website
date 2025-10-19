import { describe, it, expect } from 'vitest'
import { bedheadAttractorTick, testBedheadAttractorTick } from '../../utils/bedheadAttractor'

const { sin, cos } = Math

describe('Bedhead Attractor', () => {
	describe('Core tick function', () => {
		it('should calculate next values correctly', () => {
			const x = 0.1, y = 0
			const a = 0.65343, b = 0.7345345
			
			const result = bedheadAttractorTick(x, y, a, b)
			
			expect(isFinite(result.x)).toBe(true)
			expect(isFinite(result.y)).toBe(true)
			expect(result.x).not.toBe(x)
			expect(result.y).not.toBe(y)
		})

		it('should handle edge case when b is very small', () => {
			const x = 0.1, y = 0
			const a = 0.5, b = 0.0001
			
			const result = bedheadAttractorTick(x, y, a, b)
			
			expect(isFinite(result.x)).toBe(true)
			expect(isFinite(result.y)).toBe(true)
		})

		it('should handle zero b gracefully', () => {
			const x = 0.1, y = 0
			const a = 0.5, b = 0 // This should be handled gracefully
			
			const result = bedheadAttractorTick(x, y, a, b)
			
			expect(isFinite(result.x)).toBe(true)
			expect(isFinite(result.y)).toBe(true)
		})
	})

	describe('Test function', () => {
		it('should generate valid values with default parameters', () => {
			const a = 0.65343
			const b = 0.7345345
			const results = testBedheadAttractorTick(a, b, 50)
			
			expect(results.length).toBeGreaterThan(0)
			expect(results.length).toBeLessThanOrEqual(50)
			
			// Check that all values are finite
			results.forEach(result => {
				expect(isFinite(result.x)).toBe(true)
				expect(isFinite(result.y)).toBe(true)
			})
			
			// Check that values are within reasonable bounds
			results.forEach(result => {
				expect(Math.abs(result.x)).toBeLessThan(1000)
				expect(Math.abs(result.y)).toBeLessThan(1000)
			})
		})

		it('should handle edge case when b is very small', () => {
			const a = 0.5
			const b = 0.0001  // Very small b
			const results = testBedheadAttractorTick(a, b, 20)
			
			expect(results.length).toBeGreaterThan(0)
			
			// Should not have NaN or Infinity values
			results.forEach(result => {
				expect(isFinite(result.x)).toBe(true)
				expect(isFinite(result.y)).toBe(true)
			})
		})

		it('should handle edge case when b is zero', () => {
			const a = 0.5
			const b = 0  // Zero b
			const results = testBedheadAttractorTick(a, b, 20)
			
			expect(results.length).toBeGreaterThan(0)
			
			// Should not have NaN or Infinity values
			results.forEach(result => {
				expect(isFinite(result.x)).toBe(true)
				expect(isFinite(result.y)).toBe(true)
			})
		})

		it('should generate different patterns for different parameters', () => {
			const results1 = testBedheadAttractorTick(0.5, 0.7, 30)
			const results2 = testBedheadAttractorTick(0.8, 0.3, 30)
			
			expect(results1.length).toBeGreaterThan(0)
			expect(results2.length).toBeGreaterThan(0)
			
			// The final values should be different for different parameters
			const final1 = results1[results1.length - 1]
			const final2 = results2[results2.length - 1]
			
			expect(final1.x).not.toBe(final2.x)
			expect(final1.y).not.toBe(final2.y)
		})

		it('should maintain mathematical consistency', () => {
			const a = 0.65343
			const b = 0.7345345
			const results = testBedheadAttractorTick(a, b, 100)
			
			expect(results.length).toBeGreaterThan(50) // Should complete most iterations
			
			// Check that the mathematical relationship holds
			for (let i = 1; i < results.length; i++) {
				const prev = results[i - 1]
				const curr = results[i]
				
				// Verify the mathematical equations
				const expectedX = sin((prev.x * prev.y) / b) * prev.y + cos(a * prev.x - prev.y)
				const expectedY = prev.x + sin(prev.y) / b
				
				expect(Math.abs(curr.x - expectedX)).toBeLessThan(0.0001)
				expect(Math.abs(curr.y - expectedY)).toBeLessThan(0.0001)
			}
		})
	})
})
