import { describe, expect, it } from 'vitest'
import { lorenzTick } from '../../utils/lorenz'

const SEED = { x: 0.1, y: 0, z: 0 }
const TRAIL_STEPS = 18_000

function integrate(
	sigma: number,
	rho: number,
	beta: number,
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
		const next = lorenzTick(x, y, z, sigma, rho, beta, dt)
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

describe('lorenzTick', () => {
	it('steps from the classic seed without NaN', () => {
		const next = lorenzTick(0.1, 0, 0, 10, 28, 8 / 3, 0.005)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
		expect(next.x).not.toBe(0.1)
	})

	it('matches Lorenz field for the x component', () => {
		const x = 0.1
		const y = 0
		const z = 0
		const sigma = 10
		const rho = 28
		const beta = 8 / 3
		const dt = 0.005
		const dx = sigma * (y - x)
		const dy = x * (rho - z) - y
		const dz = x * y - beta * z
		const next = lorenzTick(x, y, z, sigma, rho, beta, dt)
		expect(next.x).toBeCloseTo(x + dt * dx, 10)
		expect(next.y).toBeCloseTo(y + dt * dy, 10)
		expect(next.z).toBeCloseTo(z + dt * dz, 10)
	})

	it('default preset stays bounded for a full trail at dt=0.005', () => {
		const { bounded, spread } = integrate(10, 28, 8 / 3, 0.005, TRAIL_STEPS)
		expect(bounded).toBe(true)
		expect(spread).toBeGreaterThan(10)
	})
})
