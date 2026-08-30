import { describe, it, expect } from 'vitest'
import { clebschField, CLEBSCH_MAX_POINTS, sampleClebschCloud } from '../../utils/clebschCubic'

describe('clebschField', () => {
	it('is positive at the origin', () => {
		expect(clebschField(0, 0, 0)).toBe(1)
	})

	it('changes sign between origin and a far corner', () => {
		expect(clebschField(0, 0, 0)).toBeGreaterThan(0)
		expect(clebschField(2.5, 2.5, 2.5)).toBeLessThan(0)
	})
})

describe('sampleClebschCloud', () => {
	it('builds a padded point cloud', () => {
		const cloud = sampleClebschCloud()
		expect(cloud.count).toBe(CLEBSCH_MAX_POINTS)
		expect(cloud.positions.length).toBe(CLEBSCH_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(CLEBSCH_MAX_POINTS * 3)
		for (let i = 0; i < cloud.positions.length; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
		let maxR = 0
		for (let i = 0; i < CLEBSCH_MAX_POINTS; i++) {
			const r = Math.hypot(
				cloud.positions[i * 3],
				cloud.positions[i * 3 + 1],
				cloud.positions[i * 3 + 2],
			)
			if (r > maxR) {
				maxR = r
			}
		}
		expect(maxR).toBeGreaterThan(0.5)
		expect(maxR).toBeLessThan(2.5)
	})
})
