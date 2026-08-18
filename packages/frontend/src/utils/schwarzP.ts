import { polygoniseGrid } from './isosurface'

const PERIOD = Math.PI * 2
const EPS = 1e-15
const GRID_RES = 36

export function schwarzPField(x: number, y: number, z: number): number {
	return Math.cos(x) + Math.cos(y) + Math.cos(z)
}

export function clampIso(t: number): number {
	return Math.min(1.2, Math.max(-1.2, t))
}

export function clampTiles(tiles: number): number {
	return Math.min(2, Math.max(1, Math.round(tiles)))
}

export type SchwarzPMesh = {
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

export function buildSchwarzPMesh(iso: number, tiles: number): SchwarzPMesh {
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
	const colors = new Float32Array(mesh.positions.length)
	for (let i = 0; i < mesh.positions.length; i += 3) {
		const x = mesh.positions[i]
		const y = mesh.positions[i + 1]
		const z = mesh.positions[i + 2]
		const u = extent > 0 ? x / extent : 0
		const v = extent > 0 ? y / extent : 0
		const w = extent > 0 ? z / extent : 0
		colors[i] = 0.18 + 0.62 * u
		colors[i + 1] = 0.42 + 0.4 * v
		colors[i + 2] = 0.55 + 0.4 * (1 - w)
	}

	centerAndScale(mesh.positions, 1.7)
	return { positions: mesh.positions, indices: mesh.indices, colors }
}
