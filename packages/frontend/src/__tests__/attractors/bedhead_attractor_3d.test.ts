import { describe, it, expect } from 'vitest'
import { bedheadAttractor3dTick } from '../../utils/bedheadAttractor3d'

const { sin, cos } = Math

describe('Bedhead Attractor 3D', () => {
	it('matches the archive map equations', () => {
		const x = 0.1
		const y = 0.2
		const z = 0.3
		const a = 0.13
		const b = 0.37
		const next = bedheadAttractor3dTick(x, y, z, a, b)
		expect(next.x).toBeCloseTo(sin((x * y) / b) * y + cos(a * x - y), 10)
		expect(next.y).toBeCloseTo(x + sin(y) / b, 10)
		expect(next.z).toBeCloseTo(y + cos(y * x) / b, 10)
	})

	it('stays finite for archive defaults from the origin', () => {
		let x = 0
		let y = 0
		let z = 0
		for (let i = 0; i < 200; i++) {
			const next = bedheadAttractor3dTick(x, y, z, 0.13, 0.37)
			x = next.x
			y = next.y
			z = next.z
			expect(Number.isFinite(x)).toBe(true)
			expect(Number.isFinite(y)).toBe(true)
			expect(Number.isFinite(z)).toBe(true)
		}
	})

	it('floors near-zero b', () => {
		const next = bedheadAttractor3dTick(0.1, 0.2, 0.3, 0.5, 0)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
	})
})
