import { describe, it, expect } from 'vitest'
import {
	romanPoint,
	clampSquash,
	sampleRomanIsolines,
} from '../../utils/romanSurface'

describe('romanPoint', () => {
	it('matches Steiner at a known sample', () => {
		const p = romanPoint(Math.PI / 4, Math.PI / 4)
		expect(p.x).toBeCloseTo(0.5 * Math.SQRT1_2, 10)
		expect(p.y).toBeCloseTo(0.5 * Math.SQRT1_2, 10)
		expect(p.z).toBeCloseTo(0.25, 10)
	})

	it('scales with a²', () => {
		const a = romanPoint(0.6, 0.9, 1)
		const b = romanPoint(0.6, 0.9, 2)
		expect(b.x).toBeCloseTo(4 * a.x, 10)
		expect(b.y).toBeCloseTo(4 * a.y, 10)
		expect(b.z).toBeCloseTo(4 * a.z, 10)
	})
})

describe('sampleRomanIsolines', () => {
	it('fills a fixed UV wire budget', () => {
		expect(clampSquash(9)).toBe(2.5)
		expect(clampSquash(-1)).toBe(0.25)
		const cloud = sampleRomanIsolines(8, 12, 32, 1)
		expect(cloud.count).toBe((8 + 12) * 32)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < cloud.positions.length; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})

	it('changes shape with squash', () => {
		const flat = sampleRomanIsolines(6, 6, 16, 0.3)
		const tall = sampleRomanIsolines(6, 6, 16, 2.2)
		let same = true
		for (let i = 0; i < flat.positions.length; i++) {
			if (Math.abs(flat.positions[i] - tall.positions[i]) > 1e-6) {
				same = false
				break
			}
		}
		expect(same).toBe(false)
	})
})
