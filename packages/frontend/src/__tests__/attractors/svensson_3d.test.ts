import { describe, it, expect } from 'vitest'
import {
	SVENSSON_3D_DEFAULTS,
	SVENSSON_3D_MAX_POINTS,
	sampleSvensson3dCloud,
	svensson3dTick,
} from '../../utils/svensson3d'

describe('svensson3dTick', () => {
	it('matches the modified 3D Svensson update', () => {
		const { a, b, c, d, e } = SVENSSON_3D_DEFAULTS
		const x = 0.2
		const y = -0.3
		const z = 0.1
		const next = svensson3dTick(x, y, z, a, b, c, d, e)
		expect(next.x).toBeCloseTo(d * Math.sin(a * x) - Math.sin(b * y), 10)
		expect(next.y).toBeCloseTo(c * Math.cos(a * x) + Math.cos(b * y), 10)
		expect(next.z).toBeCloseTo(e * Math.sin(a * x) + Math.sin(b * y), 10)
	})
})

describe('sampleSvensson3dCloud', () => {
	it('builds a fixed-size centred cloud', () => {
		const { a, b, c, d, e } = SVENSSON_3D_DEFAULTS
		const cloud = sampleSvensson3dCloud(a, b, c, d, e)
		expect(cloud.count).toBe(SVENSSON_3D_MAX_POINTS)
		expect(cloud.positions.length).toBe(SVENSSON_3D_MAX_POINTS * 3)
		let maxR = 0
		for (let i = 0; i < cloud.count; i++) {
			const i3 = i * 3
			maxR = Math.max(
				maxR,
				Math.hypot(cloud.positions[i3], cloud.positions[i3 + 1], cloud.positions[i3 + 2]),
			)
		}
		expect(maxR).toBeGreaterThan(1.5)
		expect(maxR).toBeLessThan(2.1)
	})
})
