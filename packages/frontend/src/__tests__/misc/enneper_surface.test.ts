import { describe, it, expect } from 'vitest'
import {
	clampSpan,
	DEFAULT_SPAN,
	ENNEPER_MAX_POINTS,
	enneperPoint,
	sampleEnneperIsolines,
	SPAN_MAX,
	SPAN_MIN,
} from '../../utils/enneperSurface'

describe('enneperPoint', () => {
	it('maps the origin to the origin', () => {
		const p = enneperPoint(0, 0)
		expect(p.x).toBeCloseTo(0, 12)
		expect(p.y).toBeCloseTo(0, 12)
		expect(p.z).toBeCloseTo(0, 12)
	})

	it('matches the classical polynomial on axis samples', () => {
		const a = enneperPoint(1, 0)
		expect(a.x).toBeCloseTo(2 / 3, 12)
		expect(a.y).toBeCloseTo(0, 12)
		expect(a.z).toBeCloseTo(1, 12)

		const b = enneperPoint(0, 1)
		expect(b.x).toBeCloseTo(0, 12)
		expect(b.y).toBeCloseTo(2 / 3, 12)
		expect(b.z).toBeCloseTo(-1, 12)

		const c = enneperPoint(1, 1)
		expect(c.x).toBeCloseTo(5 / 3, 12)
		expect(c.y).toBeCloseTo(5 / 3, 12)
		expect(c.z).toBeCloseTo(0, 12)
	})
})

describe('sampleEnneperIsolines', () => {
	it('builds a fixed-size UV wire', () => {
		const cloud = sampleEnneperIsolines()
		expect(cloud.count).toBe(ENNEPER_MAX_POINTS)
		expect(cloud.positions.length).toBe(ENNEPER_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < 300; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})

	it('clamps span and keeps colour chroma', () => {
		expect(clampSpan(0)).toBe(SPAN_MIN)
		expect(clampSpan(9)).toBe(SPAN_MAX)
		expect(clampSpan(DEFAULT_SPAN)).toBe(DEFAULT_SPAN)
		const cloud = sampleEnneperIsolines(16, 16, 40, DEFAULT_SPAN)
		let maxChroma = 0
		for (let i = 0; i < cloud.count; i++) {
			const r = cloud.colors[i * 3]
			const g = cloud.colors[i * 3 + 1]
			const b = cloud.colors[i * 3 + 2]
			maxChroma = Math.max(maxChroma, Math.max(r, g, b) - Math.min(r, g, b))
		}
		expect(maxChroma).toBeGreaterThan(0.3)
	})
})
