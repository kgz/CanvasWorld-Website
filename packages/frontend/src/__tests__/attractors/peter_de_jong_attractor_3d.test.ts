import { describe, expect, it } from 'vitest'
import { peterDeJong3dTick } from '../../utils/peterDeJong3d'

describe('peterDeJong3dTick', () => {
	it('steps from archive seed without NaN', () => {
		const next = peterDeJong3dTick(0, 0, 0, 2.695, 1.72, 1.178, 0.311, -1, -1)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
		expect(next.x).toBeCloseTo(-1, 10)
		expect(next.y).toBeCloseTo(-1, 10)
		expect(next.z).toBeCloseTo(-1, 10)
	})

	it('uses previous state for all three updates (simultaneous)', () => {
		const x = 0.3
		const y = -0.2
		const z = 0.5
		const a = 1.1
		const b = -0.8
		const c = 0.4
		const d = 1.7
		const e = -1.2
		const f = 0.9
		const next = peterDeJong3dTick(x, y, z, a, b, c, d, e, f)
		expect(next.x).toBeCloseTo(Math.sin(a * z) - Math.cos(b * x), 12)
		expect(next.y).toBeCloseTo(Math.sin(c * x) - Math.cos(d * y), 12)
		expect(next.z).toBeCloseTo(Math.sin(e * y) - Math.cos(f * z), 12)
	})
})
