const EPS = 1e-15

export const UV_RES = 48
export const SPAN_MIN = 1.2
export const SPAN_MAX = 2.5
export const DEFAULT_SPAN = 1.8

export function clampSpan(span: number): number {
	return Math.min(SPAN_MAX, Math.max(SPAN_MIN, span))
}

/** Classical Enneper polynomial: x = u − u³/3 + u v², y = v − v³/3 + v u², z = u² − v². */
export function enneperPoint(u: number, v: number): { x: number; y: number; z: number } {
	const u2 = u * u
	const v2 = v * v
	return {
		x: u - (u2 * u) / 3 + u * v2,
		y: v - (v2 * v) / 3 + v * u2,
		z: u2 - v2,
	}
}

export type EnneperMesh = {
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

export function buildEnneperMesh(span: number): EnneperMesh {
	const s = clampSpan(span)
	const grid = UV_RES
	const vertsPerSide = grid + 1
	const vertCount = vertsPerSide * vertsPerSide
	const positions = new Float32Array(vertCount * 3)
	const colors = new Float32Array(vertCount * 3)
	const indices = new Uint32Array(grid * grid * 6)

	let minX = Infinity
	let minY = Infinity
	let minZ = Infinity
	let maxX = -Infinity
	let maxY = -Infinity
	let maxZ = -Infinity

	for (let iy = 0; iy < vertsPerSide; iy++) {
		const v = -s + (2 * s * iy) / grid
		for (let ix = 0; ix < vertsPerSide; ix++) {
			const u = -s + (2 * s * ix) / grid
			const p = enneperPoint(u, v)
			const vi = iy * vertsPerSide + ix
			positions[vi * 3] = p.x
			positions[vi * 3 + 1] = p.y
			positions[vi * 3 + 2] = p.z
			if (p.x < minX) {
				minX = p.x
			}
			if (p.y < minY) {
				minY = p.y
			}
			if (p.z < minZ) {
				minZ = p.z
			}
			if (p.x > maxX) {
				maxX = p.x
			}
			if (p.y > maxY) {
				maxY = p.y
			}
			if (p.z > maxZ) {
				maxZ = p.z
			}
		}
	}

	const dx = maxX - minX || 1
	const dy = maxY - minY || 1
	const dz = maxZ - minZ || 1
	for (let i = 0; i < positions.length; i += 3) {
		const nx = (positions[i] - minX) / dx
		const ny = (positions[i + 1] - minY) / dy
		const nz = (positions[i + 2] - minZ) / dz
		colors[i] = 0.72 + 0.22 * nx
		colors[i + 1] = 0.42 + 0.28 * ny
		colors[i + 2] = 0.18 + 0.55 * (1 - nz)
	}

	let t = 0
	for (let iy = 0; iy < grid; iy++) {
		for (let ix = 0; ix < grid; ix++) {
			const a = iy * vertsPerSide + ix
			const b = a + 1
			const c = a + vertsPerSide
			const d = c + 1
			indices[t] = a
			indices[t + 1] = c
			indices[t + 2] = b
			indices[t + 3] = b
			indices[t + 4] = c
			indices[t + 5] = d
			t += 6
		}
	}

	centerAndScale(positions, 1.7)
	return { positions, indices, colors }
}
