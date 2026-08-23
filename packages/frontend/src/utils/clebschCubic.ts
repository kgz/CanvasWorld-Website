import { polygoniseGrid } from './isosurface'

const EPS = 1e-15
const GRID_RES = 40
const SAMPLE_BOUND = 2.55
const TARGET_R = 1.7

export type ClebschMesh = {
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
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
	for (let i = 0; i < positions.length; i++) {
		positions[i] *= s
	}
}

export function buildClebschMesh(): ClebschMesh {
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
	const colors = new Float32Array(mesh.positions.length)
	const span = 2 * b
	for (let i = 0; i < mesh.positions.length; i += 3) {
		const u = (mesh.positions[i] + b) / span
		const v = (mesh.positions[i + 1] + b) / span
		const w = (mesh.positions[i + 2] + b) / span
		colors[i] = 0.55 + 0.35 * u
		colors[i + 1] = 0.28 + 0.42 * v
		colors[i + 2] = 0.72 + 0.2 * (1 - w)
	}

	centerAndScale(mesh.positions, TARGET_R)
	return { positions: mesh.positions, indices: mesh.indices, colors }
}
