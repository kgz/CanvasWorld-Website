import { describe, expect, it } from 'vitest'
import { lorenz86Tick } from '../../utils/lorenz86'

const SEED = { x: 0, y: 0, z: 0 }
const TRAIL_STEPS = 18_000

function integrate(
	a: number,
	b: number,
	f: number,
	g: number,
	d: number,
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
		const next = lorenz86Tick(x, y, z, a, b, f, g, d)
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

describe('lorenz86Tick', () => {
	it('steps from the origin without NaN', () => {
		const next = lorenz86Tick(0, 0, 0, 1.111, 4.494, 1.479, 0.44, 0.13)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
	})

	it('matches Lorenz 86 field at default params', () => {
		const x = 0.2
		const y = -0.1
		const z = 0.05
		const a = 1.111
		const b = 4.494
		const f = 1.479
		const g = 0.44
		const d = 0.13
		const dx = (-a * x - y * y - z * z + a * b) * d
		const dy = (-y + x * y - f * x * z + g) * d
		const dz = (-z + f * x * y + x * z) * d
		const next = lorenz86Tick(x, y, z, a, b, f, g, d)
		expect(next.x).toBeCloseTo(x + dx, 10)
		expect(next.y).toBeCloseTo(y + dy, 10)
		expect(next.z).toBeCloseTo(z + dz, 10)
	})

	it('default preset stays bounded for a full trail', () => {
		const { bounded, spread } = integrate(1.111, 4.494, 1.479, 0.44, 0.13, TRAIL_STEPS)
		expect(bounded).toBe(true)
		expect(spread).toBeGreaterThan(1)
	})
})
