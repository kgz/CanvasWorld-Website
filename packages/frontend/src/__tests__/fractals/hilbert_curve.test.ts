import { describe, it, expect } from 'vitest'
import {
	hindex2xy,
	hilbertGridSize,
	hilbertPointCount,
	hilbertWorldPoint,
	last2bits,
} from '../../utils/hilbert'

describe('hilbert', () => {
	it('last2bits masks the low pair', () => {
		expect(last2bits(0)).toBe(0)
		expect(last2bits(1)).toBe(1)
		expect(last2bits(2)).toBe(2)
		expect(last2bits(3)).toBe(3)
		expect(last2bits(5)).toBe(1)
	})

	it('order helpers', () => {
		expect(hilbertGridSize(1)).toBe(2)
		expect(hilbertGridSize(3)).toBe(8)
		expect(hilbertPointCount(1)).toBe(4)
		expect(hilbertPointCount(3)).toBe(64)
	})

	it('order-1 visits the four base cells', () => {
		const n = hilbertGridSize(1)
		expect(hindex2xy(0, n)).toEqual({ x: 0, y: 0 })
		expect(hindex2xy(1, n)).toEqual({ x: 0, y: 1 })
		expect(hindex2xy(2, n)).toEqual({ x: 1, y: 1 })
		expect(hindex2xy(3, n)).toEqual({ x: 1, y: 0 })
	})

	it('consecutive indices are grid neighbors for order 3', () => {
		const n = hilbertGridSize(3)
		const len = hilbertPointCount(3)
		for (let i = 0; i < len - 1; i++) {
			const a = hindex2xy(i, n)
			const b = hindex2xy(i + 1, n)
			const dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
			expect(dist).toBe(1)
		}
	})

	it('covers every cell exactly once for order 2', () => {
		const n = hilbertGridSize(2)
		const seen = new Set<string>()
		for (let i = 0; i < hilbertPointCount(2); i++) {
			const p = hindex2xy(i, n)
			seen.add(`${p.x},${p.y}`)
		}
		expect(seen.size).toBe(16)
		for (let x = 0; x < n; x++) {
			for (let y = 0; y < n; y++) {
				expect(seen.has(`${x},${y}`)).toBe(true)
			}
		}
	})

	it('world framing centers the square', () => {
		const n = 4
		const mid = hilbertWorldPoint(0, n, 10)
		const corner = hindex2xy(0, n)
		expect(mid.x).toBe((corner.x - 1.5) * 10)
		expect(mid.y).toBe((corner.y - 1.5) * 10)
	})
})
