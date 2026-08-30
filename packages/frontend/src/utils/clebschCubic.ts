import { polygoniseGrid } from './isosurface'

const EPS = 1e-15
const GRID_RES = 40
const SAMPLE_BOUND = 2.55
const TARGET_R = 1.7
/** Fixed GPU budget so transport `n` does not remount buffers. */
export const CLEBSCH_MAX_POINTS = 120_000

export type ClebschCloud = {
	positions: Float32Array
	colors: Float32Array
	/** Always CLEBSCH_MAX_POINTS (padded). */
	count: number
}

/**
 * Hunt / Nordstrand affine Clebsch diagonal cubic.
 * Zero set is the classic real cubic with all 27 lines real.
 */
export function clebschField(x: number, y: number, z: number): number {
	const x2 = x * x
	const y2 = y * y
	const z2 = z * z
	const x3 = x2 * x
	const y3 = y2 * y
	const z3 = z2 * z
	const cubes = 81 * (x3 + y3 + z3)
	const mixed =
		189 *
		(x2 * y +
			x2 * z +
			y2 * x +
			y2 * z +
			z2 * x +
			z2 * y)
	const xyz = 54 * x * y * z
	const pairs = 126 * (x * y + x * z + y * z)
	const quads = 9 * (x2 + y2 + z2)
	const linear = 9 * (x + y + z)
	return cubes - mixed + xyz + pairs - quads - linear + 1
}

function centerAndScale(positions: Float32Array, count: number, targetRadius: number) {
	if (count === 0) {
		return
	}
	let cx = 0
	let cy = 0
	let cz = 0
	for (let i = 0; i < count; i++) {
		cx += positions[i * 3]
		cy += positions[i * 3 + 1]
		cz += positions[i * 3 + 2]
	}
	cx /= count
	cy /= count
	cz /= count

	let maxR = 0
	for (let i = 0; i < count; i++) {
		const px = positions[i * 3] - cx
		const py = positions[i * 3 + 1] - cy
		const pz = positions[i * 3 + 2] - cz
		positions[i * 3] = px
		positions[i * 3 + 1] = py
		positions[i * 3 + 2] = pz
		const r = Math.hypot(px, py, pz)
		if (r > maxR) {
			maxR = r
		}
	}
	if (maxR < EPS) {
		return
	}
	const s = targetRadius / maxR
	for (let i = 0; i < count * 3; i++) {
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

/** Zero isosurface vertices as a particle cloud (no lit triangles). */
export function sampleClebschCloud(): ClebschCloud {
	const n = GRID_RES
	const b = SAMPLE_BOUND
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
				values[i + nx * (j + nx * k)] = clebschField(x, y, z)
			}
		}
	}

	const mesh = polygoniseGrid(values, nx, nx, nx, origin, cell)
	const total = mesh.positions.length / 3
	const keep = Math.min(total, CLEBSCH_MAX_POINTS)
	const stride = total > keep ? total / keep : 1

	const positions = new Float32Array(CLEBSCH_MAX_POINTS * 3)
	const colors = new Float32Array(CLEBSCH_MAX_POINTS * 3)
	for (let i = 0; i < keep; i++) {
		const src = Math.min(total - 1, Math.floor(i * stride)) * 3
		const i3 = i * 3
		positions[i3] = mesh.positions[src]
		positions[i3 + 1] = mesh.positions[src + 1]
		positions[i3 + 2] = mesh.positions[src + 2]
	}

	centerAndScale(positions, keep, TARGET_R)
	for (let i = 0; i < keep; i++) {
		const i3 = i * 3
		writeRibbon(colors, i3, positions[i3], positions[i3 + 1], positions[i3 + 2])
	}
	if (keep > 0) {
		const px = positions[0]
		const py = positions[1]
		const pz = positions[2]
		const cr = colors[0]
		const cg = colors[1]
		const cb = colors[2]
		for (let i = keep; i < CLEBSCH_MAX_POINTS; i++) {
			const i3 = i * 3
			positions[i3] = px
			positions[i3 + 1] = py
			positions[i3 + 2] = pz
			colors[i3] = cr
			colors[i3 + 1] = cg
			colors[i3 + 2] = cb
		}
	}

	return { positions, colors, count: CLEBSCH_MAX_POINTS }
}
