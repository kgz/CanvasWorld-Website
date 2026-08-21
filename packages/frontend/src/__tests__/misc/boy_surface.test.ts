import { describe, it, expect } from 'vitest'
import {
	boyPoint,
	boyPointBryant,
	clampBlend,
	clampHomotopy,
	sampleBoyMorphIsolines,
} from '../../utils/boySurface'

describe('boyPoint', () => {
	it('is finite on a UV sample', () => {
		const p = boyPoint(0.4, 0.7)
		expect(Number.isFinite(p.x)).toBe(true)
		expect(Number.isFinite(p.y)).toBe(true)
		expect(Number.isFinite(p.z)).toBe(true)
	})

	it('moves along the Roman→Boy homotopy', () => {
		const a = boyPoint(0.7, 0.9, 0)
		const b = boyPoint(0.7, 0.9, 1)
		expect(a.x !== b.x || a.y !== b.y || a.z !== b.z).toBe(true)
		expect(clampHomotopy(9)).toBe(1)
		expect(clampHomotopy(-1)).toBe(0)
	})
})

describe('boyPointBryant', () => {
	it('maps the origin', () => {
		const p = boyPointBryant(0, 0)
		expect(p).not.toBeNull()
		if (p === null) {
			return
		}
		expect(Number.isFinite(p.x)).toBe(true)
		expect(Number.isFinite(p.y)).toBe(true)
		expect(Number.isFinite(p.z)).toBe(true)
	})
})

describe('sampleBoyMorphIsolines', () => {
	it('blends Apéry and Bryant on a small polar wire', () => {
		expect(clampBlend(2)).toBe(1)
		const cloud = sampleBoyMorphIsolines(8, 12, 32, 1, 1)
		expect(cloud.count).toBe((8 + 12) * 32)
		expect(cloud.colors.length).toBe(cloud.positions.length)
		for (let i = 0; i < cloud.positions.length; i++) {
			expect(Number.isFinite(cloud.positions[i])).toBe(true)
		}
	})
})
