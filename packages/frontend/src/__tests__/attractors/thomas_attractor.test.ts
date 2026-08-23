import { describe, expect, it } from 'vitest'
import { thomasTick } from '../../utils/thomas'

describe('thomasTick', () => {
	it('steps from a small seed without NaN', () => {
		const next = thomasTick(0.1, 0, 0, 0.19, 0.01)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
	})

	it('is cyclic under (x,y,z)→(y,z,x)', () => {
		const b = 0.19
		const dt = 0.01
		const p = { x: 0.4, y: -0.2, z: 0.7 }
		const n = thomasTick(p.x, p.y, p.z, b, dt)
		const nRot = thomasTick(p.y, p.z, p.x, b, dt)
		expect(nRot.x).toBeCloseTo(n.y, 10)
		expect(nRot.y).toBeCloseTo(n.z, 10)
		expect(nRot.z).toBeCloseTo(n.x, 10)
	})
})
