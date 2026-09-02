import { describe, expect, it } from 'vitest'
import { modifiedChuaTick } from '../../utils/modified_chua'

const SEED = { x: 1, y: 1, z: 0 }
const TRAIL_STEPS = 18_000

function integrate(
	alpha: number,
	beta: number,
	a: number,
	b: number,
	d: number,
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
		const next = modifiedChuaTick(x, y, z, alpha, beta, a, b, d, dt)
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

describe('modifiedChuaTick', () => {
	it('steps from the archive seed without NaN', () => {
		const next = modifiedChuaTick(1, 1, 0, 10.82, 14.286, 1.3, 0.11, 2.981, 0.02)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
	})

	it('matches modified Chua field at default params', () => {
		const x = 1
		const y = 1
		const z = 0
		const alpha = 10.82
		const beta = 14.286
		const a = 1.3
		const b = 0.11
		const d = 2.981
		const dt = 0.02
		const h = -b * Math.sin((Math.PI * x) / (2 * a) + d)
		const dx = alpha * (y - h)
		const dy = x - y + z
		const dz = -beta * y
		const next = modifiedChuaTick(x, y, z, alpha, beta, a, b, d, dt)
		expect(next.x).toBeCloseTo(x + dt * dx, 10)
		expect(next.y).toBeCloseTo(y + dt * dy, 10)
		expect(next.z).toBeCloseTo(z + dt * dz, 10)
	})

	it('default preset stays bounded for a full trail at dt=0.02', () => {
		const { bounded, spread } = integrate(10.82, 14.286, 1.3, 0.11, 2.981, 0.02, TRAIL_STEPS)
		expect(bounded).toBe(true)
		expect(spread).toBeGreaterThan(1)
	})
})
