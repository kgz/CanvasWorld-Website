import { describe, it, expect } from 'vitest'
import { equilateralVertices, pointInTriangle, sierpinskiMember, type Vec2 } from '../../utils/sierpinski'

describe('Sierpinski membership', () => {
	const [a, b, c] = equilateralVertices(2)

	it('includes centroid at depth 0', () => {
		const p: Vec2 = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3]
		expect(pointInTriangle(p, a, b, c)).toBe(true)
		expect(sierpinskiMember(p, a, b, c, 0)).toBe(true)
	})

	it('removes the middle triangle at depth 1', () => {
		const mab: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
		const mbc: Vec2 = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2]
		const mca: Vec2 = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2]
		const midCenter: Vec2 = [(mab[0] + mbc[0] + mca[0]) / 3, (mab[1] + mbc[1] + mca[1]) / 3]
		expect(sierpinskiMember(midCenter, a, b, c, 1)).toBe(false)
		expect(sierpinskiMember(midCenter, a, b, c, 0)).toBe(true)
	})

	it('keeps a near-corner sample at depth 3', () => {
		const nearA: Vec2 = [a[0] * 0.92 + b[0] * 0.04 + c[0] * 0.04, a[1] * 0.92 + b[1] * 0.04 + c[1] * 0.04]
		expect(sierpinskiMember(nearA, a, b, c, 3)).toBe(true)
	})

	it('rejects points outside the outer triangle', () => {
		const outside: Vec2 = [10, 10]
		expect(sierpinskiMember(outside, a, b, c, 2)).toBe(false)
	})
})
