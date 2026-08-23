import { describe, expect, it } from 'vitest'
import { halvorsenTick } from '../../utils/halvorsen'

describe('halvorsenTick', () => {
	it('steps from the classic seed without NaN', () => {
		const next = halvorsenTick(-5, 0, 0, 1.4, 0.01)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
		expect(next.x).not.toBe(-5)
	})

	it('is cyclic under (x,y,z)→(y,z,x) for matching components', () => {
		const a = 1.4
		const dt = 0.01
		const p = { x: -1.2, y: 0.4, z: -0.3 }
		const n = halvorsenTick(p.x, p.y, p.z, a, dt)
		const nRot = halvorsenTick(p.y, p.z, p.x, a, dt)
		expect(nRot.x).toBeCloseTo(n.y, 10)
		expect(nRot.y).toBeCloseTo(n.z, 10)
		expect(nRot.z).toBeCloseTo(n.x, 10)
	})
})
