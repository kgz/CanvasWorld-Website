import { polygoniseGrid } from './isosurface'

export const BARTH_PHI = (1 + Math.sqrt(5)) / 2
const EPS = 1e-15
const TARGET_R = 1.7
const GRID_RES = 44
const SAMPLE_BOUND = 1.85

export type BarthCloud = {
	positions: Float32Array
	colors: Float32Array
	count: number
}

export function clampTau(tau: number): number {
	return Math.min(2.2, Math.max(1.05, tau))
}

export function clampRadius(radius: number): number {
	return Math.min(1.55, Math.max(0.45, radius))
}

/** Scales the triple product vs the sphere term — spikes ↔ rounder shell. */
export function clampMix(mix: number): number {
	return Math.min(2.4, Math.max(0.25, mix))
}

/**
 * Affine Barth-type sextic.
 * Classic Barth: τ = φ, R = 1, mix = 1.
 * τ slides the golden-ratio lattice; R the coupling sphere; mix the spike/shell balance.
 */
export function barthField(
	x: number,
	y: number,
	z: number,
	tau = BARTH_PHI,
	radius = 1,
	mix = 1,
): number {
	const t = clampTau(tau)
	const R = clampRadius(radius)
	const m = clampMix(mix)
	const t2 = t * t
	const x2 = x * x
	const y2 = y * y
	const z2 = z * z
	const a = 4 * (t2 * x2 - y2) * (t2 * y2 - z2) * (t2 * z2 - x2)
	const d = x2 + y2 + z2 - R * R
	return m * a - (1 + 2 * t) * d * d
}

function centerAndScale(positions: Float32Array, targetRadius: number) {
	const vcount = positions.length / 3
	if (vcount === 0) {
		return
	}
	let cx = 0
	let cy = 0
	let cz = 0
	for (let i = 0; i < vcount; i++) {
		cx += positions[i * 3]
		cy += positions[i * 3 + 1]
		cz += positions[i * 3 + 2]
	}
	cx /= vcount
	cy /= vcount
	cz /= vcount

	let maxR = 0
	for (let i = 0; i < vcount; i++) {
		const x = positions[i * 3] - cx
		const y = positions[i * 3 + 1] - cy
		const z = positions[i * 3 + 2] - cz
		positions[i * 3] = x
		positions[i * 3 + 1] = y
		positions[i * 3 + 2] = z
		const r = Math.hypot(x, y, z)
		if (r > maxR) {
			maxR = r
		}
	}
	if (maxR < EPS) {
		return
	}
	const s = targetRadius / maxR
	for (let i = 0; i < positions.length; i++) {
		positions[i] *= s
	}
}

function writeRibbon(colors: Float32Array, i: number, x: number, y: number, z: number, span: number) {
	const u = (x + span) / (2 * span)
	const v = (y + span) / (2 * span)
	const w = (z + span) / (2 * span)
	const t = Math.min(1, Math.max(0, 0.4 * u + 0.35 * v + 0.25 * (1 - w)))
	if (t < 0.5) {
		const s = t / 0.5
		colors[i] = 0.95
		colors[i + 1] = 0.35 + 0.45 * s
		colors[i + 2] = 0.55 + 0.2 * s
		return
	}
	const s = (t - 0.5) / 0.5
	colors[i] = 0.95 - 0.55 * s
	colors[i + 1] = 0.8 + 0.1 * s
	colors[i + 2] = 0.75 + 0.15 * s
}

/** Isosurface vertices as a particle cloud (no lit triangles). */
export function sampleBarthCloud(tau = BARTH_PHI, radius = 1, mix = 1): BarthCloud {
	const t = clampTau(tau)
	const R = clampRadius(radius)
	const m = clampMix(mix)
	const n = GRID_RES
	const b = SAMPLE_BOUND * Math.max(1, R)
	const nx = n + 1
	const origin: readonly [number, number, number] = [-b, -b, -b]
	const cellSize = (2 * b) / n
	const cell: readonly [number, number, number] = [cellSize, cellSize, cellSize]

	const values = new Float32Array(nx * nx * nx)
	for (let k = 0; k < nx; k++) {
		const z = -b + k * cellSize
		for (let j = 0; j < nx; j++) {
			const y = -b + j * cellSize
			for (let i = 0; i < nx; i++) {
				const x = -b + i * cellSize
				values[i + nx * (j + nx * k)] = barthField(x, y, z, t, R, m)
			}
		}
	}

	const mesh = polygoniseGrid(values, nx, nx, nx, origin, cell)
	const count = mesh.positions.length / 3
	const colors = new Float32Array(mesh.positions.length)
	for (let i = 0; i < mesh.positions.length; i += 3) {
		writeRibbon(colors, i, mesh.positions[i], mesh.positions[i + 1], mesh.positions[i + 2], b)
	}
	centerAndScale(mesh.positions, TARGET_R)
	return { positions: mesh.positions, colors, count }
}
