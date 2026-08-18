import { polygoniseGrid } from './isosurface'

const PHI = (1 + Math.sqrt(5)) / 2
const PHI2 = PHI * PHI
const EPS = 1e-15

/** Barth sextic (affine chart). τ = (1+√5)/2. */
export function barthField(x: number, y: number, z: number): number {
	const x2 = x * x
	const y2 = y * y
	const z2 = z * z
	const a = 4 * (PHI2 * x2 - y2) * (PHI2 * y2 - z2) * (PHI2 * z2 - x2)
	const r2 = x2 + y2 + z2
	const d = r2 - 1
	return a - (1 + 2 * PHI) * d * d
}

const GRID_RES = 40
const SAMPLE_BOUND = 1.85

export type BarthMesh = {
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
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

export function buildBarthMesh(): BarthMesh {
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
				values[i + nx * (j + nx * k)] = barthField(x, y, z)
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
		colors[i] = 0.72 + 0.22 * u
		colors[i + 1] = 0.42 + 0.28 * v
		colors[i + 2] = 0.18 + 0.55 * (1 - w)
	}

	centerAndScale(mesh.positions, 1.7)
	return { positions: mesh.positions, indices: mesh.indices, colors }
}
