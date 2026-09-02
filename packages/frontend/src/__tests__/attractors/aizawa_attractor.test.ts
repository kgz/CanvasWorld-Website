import { describe, expect, it } from 'vitest'
import { aizawaTick } from '../../utils/aizawa'

const SEED = { x: 0.1, y: 0, z: 0 }
const TRAIL_STEPS = 18_000

function integrate(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	dt: number,
	steps: number,
	seed = SEED,
): { bounded: boolean; spread: number } {
	let { x, y, z } = seed
	let minX = Infinity
	let maxX = -Infinity
	let minY = Infinity
	let maxY = -Infinity
	let minZ = Infinity
	let maxZ = -Infinity
	for (let i = 0; i < steps; i++) {
		const next = aizawaTick(x, y, z, a, b, c, d, e, f, dt)
		x = next.x
		y = next.y
		z = next.z
		if (!Number.isFinite(x) || Math.abs(x) > 1e4) {
			return { bounded: false, spread: 0 }
		}
		minX = Math.min(minX, x)
		maxX = Math.max(maxX, x)
		minY = Math.min(minY, y)
		maxY = Math.max(maxY, y)
		minZ = Math.min(minZ, z)
		maxZ = Math.max(maxZ, z)
	}
	const spread = Math.hypot(maxX - minX, maxY - minY, maxZ - minZ)
	return { bounded: true, spread }
}

describe('aizawaTick', () => {
	it('steps from the archive seed without NaN', () => {
		const next = aizawaTick(0.1, 0, 0, 0.95, 0.7, 0.6, 3.5, 0.25, 0.1, 0.01)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
		expect(next.x).not.toBe(0.1)
	})

	it('matches Aizawa field at default params', () => {
		const x = 0.1
		const y = 0
		const z = 0
		const a = 0.95
		const b = 0.7
		const c = 0.6
		const d = 3.5
		const e = 0.25
		const f = 0.1
		const dt = 0.01
		const dx = (z - b) * x - d * y
		const dy = d * x + (z - b) * y
		const dz =
			c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)
		const next = aizawaTick(x, y, z, a, b, c, d, e, f, dt)
		expect(next.x).toBeCloseTo(x + dt * dx, 10)
		expect(next.y).toBeCloseTo(y + dt * dy, 10)
		expect(next.z).toBeCloseTo(z + dt * dz, 10)
	})

	it('default preset stays bounded for a full trail at dt=0.01', () => {
		const { bounded, spread } = integrate(0.95, 0.7, 0.6, 3.5, 0.25, 0.1, 0.01, TRAIL_STEPS)
		expect(bounded).toBe(true)
		expect(spread).toBeGreaterThan(1)
	})
})
