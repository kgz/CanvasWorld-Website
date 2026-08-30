import { describe, it, expect } from 'vitest'
import {
	clampA,
	clampFreq,
	figureKnotPoint,
	FIGURE_KNOTS_MAX_POINTS,
	sampleFigureKnotCloud,
} from '../../utils/figureKnots'

describe('figureKnotPoint', () => {
	it('matches the archive README formula', () => {
		const a = 2
		const b = 3
		const c = 5
		const d = 4
		const t = 1.25
		const p = figureKnotPoint(t, a, b, c, d)
		const tube = a + Math.cos(b * t)
		expect(p.x).toBeCloseTo(tube * Math.cos(c * t), 12)
		expect(p.y).toBeCloseTo(tube * Math.sin(c * t), 12)
		expect(p.z).toBeCloseTo(Math.sin(d * t), 12)
	})

	it('uses tube radius a+1 when b=0', () => {
		const a = 3
		const p = figureKnotPoint(0.7, a, 0, 2, 0)
		expect(Math.hypot(p.x, p.y)).toBeCloseTo(a + 1, 12)
		expect(p.z).toBeCloseTo(0, 12)
	})
})

describe('sampleFigureKnotCloud', () => {
	it('builds a padded cloud of finite samples', () => {
		const cloud = sampleFigureKnotCloud(7.4, 8, 9.1, 8, 1024)
		expect(cloud.count).toBe(FIGURE_KNOTS_MAX_POINTS)
		expect(cloud.positions.length).toBe(FIGURE_KNOTS_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < cloud.positions.length; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})

	it('clamps tube radius and frequencies', () => {
		expect(clampA(0)).toBe(0.05)
		expect(clampA(99)).toBe(20)
		expect(clampFreq(-1)).toBe(0)
		expect(clampFreq(40)).toBe(20)
	})
})
