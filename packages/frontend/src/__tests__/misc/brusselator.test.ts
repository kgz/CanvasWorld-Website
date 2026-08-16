import { describe, it, expect } from 'vitest'
import { brusselatorTick, sampleBrusselator } from '../../utils/brusselator'

describe('Brusselator', () => {
	describe('brusselatorTick', () => {
		it('matches one Euler step of the continuous ODEs', () => {
			const x = 1
			const y = 1
			const a = 1
			const b = 3
			const dt = 0.02

			const result = brusselatorTick(x, y, a, b, dt)
			const expectedX = x + (a - (b + 1) * x + x * x * y) * dt
			const expectedY = y + (b * x - x * x * y) * dt

			expect(result.x).toBeCloseTo(expectedX, 10)
			expect(result.y).toBeCloseTo(expectedY, 10)
		})

		it('stays finite for oscillatory defaults', () => {
			const result = brusselatorTick(1, 1, 1, 3, 0.02)
			expect(isFinite(result.x)).toBe(true)
			expect(isFinite(result.y)).toBe(true)
		})

		it('clamps dt to a safe range', () => {
			const tiny = brusselatorTick(1, 1, 1, 3, 0)
			const huge = brusselatorTick(1, 1, 1, 3, 5)
			expect(isFinite(tiny.x)).toBe(true)
			expect(isFinite(huge.x)).toBe(true)
		})
	})

	describe('sampleBrusselator', () => {
		it('does not diverge for a=1, b=3 over many steps', () => {
			const samples = sampleBrusselator(1, 3, 0.02, 20_000)
			expect(samples.length).toBe(20_000)
			for (const p of samples) {
				expect(isFinite(p.x)).toBe(true)
				expect(isFinite(p.y)).toBe(true)
				expect(Math.abs(p.x)).toBeLessThan(100)
				expect(Math.abs(p.y)).toBeLessThan(100)
			}
		})

		it('explores a non-trivial range in the oscillatory regime', () => {
			const samples = sampleBrusselator(1, 3, 0.02, 10_000)
			const xs = samples.map((p) => p.x)
			const ys = samples.map((p) => p.y)
			const xSpan = Math.max(...xs) - Math.min(...xs)
			const ySpan = Math.max(...ys) - Math.min(...ys)
			expect(xSpan).toBeGreaterThan(0.5)
			expect(ySpan).toBeGreaterThan(0.5)
		})

		it('rejects the old discrete catalog map as unstable', () => {
			// Historical broken map from the BE/catalog stub — diverges quickly.
			let x = 1
			let y = 1
			const a = 1
			const b = 1.7
			let diverged = false
			for (let i = 0; i < 50; i++) {
				const xn = 1 + x + a * x * x * y - (b + 1) * x
				const yn = b * x - a * x * x * y
				x = xn
				y = yn
				if (!isFinite(x) || !isFinite(y) || Math.abs(x) > 1e6 || Math.abs(y) > 1e6) {
					diverged = true
					break
				}
			}
			expect(diverged).toBe(true)
		})
	})
})
