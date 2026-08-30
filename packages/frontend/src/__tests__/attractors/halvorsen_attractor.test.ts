import { describe, expect, it } from 'vitest'
import { halvorsenTick } from '../../utils/halvorsen'

const SEED = { x: -5, y: 0, z: 0 }
const TRAIL_STEPS = 18_000

function integrate(
	a: number,
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
		const next = halvorsenTick(x, y, z, a, dt)
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

describe('halvorsenTick', () => {
	it('steps from the classic seed without NaN', () => {
		const next = halvorsenTick(-5, 0, 0, 1.4, 0.005)
		expect(Number.isFinite(next.x)).toBe(true)
		expect(Number.isFinite(next.y)).toBe(true)
		expect(Number.isFinite(next.z)).toBe(true)
		expect(next.x).not.toBe(-5)
	})

	it('is cyclic under (x,y,z)→(y,z,x) for matching components', () => {
		const a = 1.4
		const dt = 0.005
		const p = { x: -1.2, y: 0.4, z: -0.3 }
		const n = halvorsenTick(p.x, p.y, p.z, a, dt)
		const nRot = halvorsenTick(p.y, p.z, p.x, a, dt)
		expect(nRot.x).toBeCloseTo(n.y, 10)
		expect(nRot.y).toBeCloseTo(n.z, 10)
		expect(nRot.z).toBeCloseTo(n.x, 10)
	})

	it('matches Sprott field for the x component', () => {
		const x = -1.2
		const y = 0.4
		const z = -0.3
		const a = 1.4
		const dt = 0.005
		const dx = -a * x - 4 * y - 4 * z - y * y
		const next = halvorsenTick(x, y, z, a, dt)
		expect(next.x).toBeCloseTo(x + dt * dx, 10)
	})

	it('default preset stays bounded for a full trail at dt=0.005', () => {
		const { bounded, spread } = integrate(1.4, 0.005, TRAIL_STEPS)
		expect(bounded).toBe(true)
		expect(spread).toBeGreaterThan(10)
	})

	it('dt=0.01 with a=1.4 blows up before a full trail (Euler)', () => {
		const { bounded } = integrate(1.4, 0.01, TRAIL_STEPS)
		expect(bounded).toBe(false)
	})

	it('catalog example presets stay bounded', () => {
		for (const preset of [
			{ a: 1.4, dt: 0.005 },
			{ a: 1.45, dt: 0.005 },
			{ a: 1.6, dt: 0.01 },
		]) {
			const { bounded, spread } = integrate(preset.a, preset.dt, TRAIL_STEPS)
			expect(bounded).toBe(true)
			expect(spread).toBeGreaterThan(10)
		}
	})
})
