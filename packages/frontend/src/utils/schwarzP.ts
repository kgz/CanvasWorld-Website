import { polygoniseGrid } from './isosurface'

const PERIOD = Math.PI * 2
const EPS = 1e-15
/** Fixed GPU budget so param scrubs don't remount buffers / reset `n`. */
export const SCHWARZ_MAX_POINTS = 80_000
const TARGET_R = 1.7
/** Interactive MC — 32³ cell; tiles=2 → 65³ samples. */
const GRID_RES = 32

export function schwarzPField(x: number, y: number, z: number): number {
	return Math.cos(x) + Math.cos(y) + Math.cos(z)
}

export function clampIso(t: number): number {
	return Math.min(1.2, Math.max(-1.2, t))
}

export function clampTiles(tiles: number): number {
	return Math.min(2, Math.max(1, Math.round(tiles)))
}

export type SchwarzPCloud = {
	positions: Float32Array
	colors: Float32Array
	/** Always SCHWARZ_MAX_POINTS (padded). */
	count: number
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

/** Coral → amber → teal by direction (reads on black). */
function writeRibbon(colors: Float32Array, i: number, x: number, y: number, z: number) {
	const r = Math.hypot(x, y, z) || 1
	const u = 0.5 + 0.5 * (x / r)
	const v = 0.5 + 0.5 * (y / r)
	const w = 0.5 + 0.5 * (z / r)
	const t = Math.min(1, Math.max(0, 0.45 * u + 0.25 * v + 0.3 * (1 - w)))
	if (t < 0.5) {
		const s = t / 0.5
		colors[i] = 1
		colors[i + 1] = 0.2 + 0.55 * s
		colors[i + 2] = 0.28 + 0.08 * s
		return
	}
	const s = (t - 0.5) / 0.5
	colors[i] = 1 - 0.82 * s
	colors[i + 1] = 0.75 + 0.22 * s
	colors[i + 2] = 0.36 + 0.58 * s
}

/** Isosurface vertices as a particle cloud (no lit triangles). */
export function sampleSchwarzPCloud(iso: number, tiles: number): SchwarzPCloud {
	const t = clampIso(iso)
	const nTiles = clampTiles(tiles)
	const nx = GRID_RES * nTiles + 1
	const extent = PERIOD * nTiles
	const origin: readonly [number, number, number] = [0, 0, 0]
	const cellSize = extent / (nx - 1)
	const cell: readonly [number, number, number] = [cellSize, cellSize, cellSize]

	const values = new Float32Array(nx * nx * nx)
	for (let k = 0; k < nx; k++) {
		const z = k * cellSize
		for (let j = 0; j < nx; j++) {
			const y = j * cellSize
			for (let i = 0; i < nx; i++) {
				const x = i * cellSize
				values[i + nx * (j + nx * k)] = schwarzPField(x, y, z) - t
			}
		}
	}

	const mesh = polygoniseGrid(values, nx, nx, nx, origin, cell)
	centerAndScale(mesh.positions, TARGET_R)

	const positions = new Float32Array(SCHWARZ_MAX_POINTS * 3)
	const colors = new Float32Array(SCHWARZ_MAX_POINTS * 3)
	const raw = Math.min(mesh.positions.length / 3, SCHWARZ_MAX_POINTS)
	for (let i = 0; i < raw; i++) {
		const i3 = i * 3
		positions[i3] = mesh.positions[i3]
		positions[i3 + 1] = mesh.positions[i3 + 1]
		positions[i3 + 2] = mesh.positions[i3 + 2]
		writeRibbon(colors, i3, positions[i3], positions[i3 + 1], positions[i3 + 2])
	}
	if (raw > 0) {
		const px = positions[0]
		const py = positions[1]
		const pz = positions[2]
		const cr = colors[0]
		const cg = colors[1]
		const cb = colors[2]
		for (let i = raw; i < SCHWARZ_MAX_POINTS; i++) {
			const i3 = i * 3
			positions[i3] = px
			positions[i3 + 1] = py
			positions[i3 + 2] = pz
			colors[i3] = cr
			colors[i3 + 1] = cg
			colors[i3 + 2] = cb
		}
	}
	return { positions, colors, count: SCHWARZ_MAX_POINTS }
}
