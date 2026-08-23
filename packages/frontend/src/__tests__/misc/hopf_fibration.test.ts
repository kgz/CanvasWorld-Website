import { describe, it, expect } from 'vitest'
import {
	clampFibers,
	clampStereo,
	hopfFiberPoint,
	hopfMap,
	hopfS3,
	HOPF_MAX_POINTS,
	sampleHopfCloud,
	stereographic,
} from '../../utils/hopfFibration'

describe('hopfS3 / hopfMap', () => {
	it('lands on the unit 3-sphere', () => {
		const p = hopfS3(0.4, 1.1, 2.2)
		const r2 = p.x * p.x + p.y * p.y + p.z * p.z + p.w * p.w
		expect(r2).toBeCloseTo(1, 12)
	})

	it('maps to the unit 2-sphere', () => {
		const p = hopfS3(0.55, 0.3, 1.7)
		const q = hopfMap(p)
		const r2 = q.x * q.x + q.y * q.y + q.z * q.z
		expect(r2).toBeCloseTo(1, 12)
	})

	it('keeps the Hopf map constant along a fiber', () => {
		const eta = 0.6
		const phi = 1.2
		const a = hopfMap(hopfS3(eta, 0.1, 0.1 + phi))
		const b = hopfMap(hopfS3(eta, 2.4, 2.4 + phi))
		expect(a.x).toBeCloseTo(b.x, 10)
		expect(a.y).toBeCloseTo(b.y, 10)
		expect(a.z).toBeCloseTo(b.z, 10)
	})
})

describe('stereographic', () => {
	it('matches classic stereo at k=1 away from the pole', () => {
		const p = hopfS3(0.5, 0.2, 1.0)
		const q = stereographic(p, 1)
		const denom = 1 - p.w
		expect(q.x).toBeCloseTo(p.x / denom, 12)
		expect(q.y).toBeCloseTo(p.y / denom, 12)
		expect(q.z).toBeCloseTo(p.z / denom, 12)
	})

	it('stays finite for fiber samples', () => {
		const p = hopfFiberPoint(0.4, 0.8, 1.5, 0.85)
		expect(Number.isFinite(p.x)).toBe(true)
		expect(Number.isFinite(p.y)).toBe(true)
		expect(Number.isFinite(p.z)).toBe(true)
	})
})

describe('sampleHopfCloud', () => {
	it('builds a padded fiber cloud', () => {
		const cloud = sampleHopfCloud(16, 0.8, 32)
		expect(cloud.count).toBe(HOPF_MAX_POINTS)
		expect(cloud.positions.length).toBe(HOPF_MAX_POINTS * 3)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < cloud.positions.length; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})

	it('clamps fibers and stereo', () => {
		expect(clampFibers(1)).toBe(4)
		expect(clampFibers(200)).toBe(120)
		expect(clampStereo(0)).toBe(0.15)
		expect(clampStereo(2)).toBe(1)
	})
})
