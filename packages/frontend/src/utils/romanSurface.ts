const EPS = 1e-15
const AREA2_EPS = 1e-18
const GRID_RES = 64
const TARGET_RADIUS = 1.7

export type RomanMesh = {
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
}

/** Steiner Roman surface, a = 1. u,v ∈ [0, π]. */
export function romanPoint(u: number, v: number): { x: number; y: number; z: number } {
	const cu = Math.cos(u)
	const su = Math.sin(u)
	const cv = Math.cos(v)
	const sv = Math.sin(v)
	return {
		x: cu * su * sv,
		y: cu * su * cv,
		z: cu * cu * cv * sv,
	}
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

function triangleArea2(
	positions: Float32Array,
	i0: number,
	i1: number,
	i2: number,
): number {
	const ax = positions[i1 * 3] - positions[i0 * 3]
	const ay = positions[i1 * 3 + 1] - positions[i0 * 3 + 1]
	const az = positions[i1 * 3 + 2] - positions[i0 * 3 + 2]
	const bx = positions[i2 * 3] - positions[i0 * 3]
	const by = positions[i2 * 3 + 1] - positions[i0 * 3 + 1]
	const bz = positions[i2 * 3 + 2] - positions[i0 * 3 + 2]
	const cx = ay * bz - az * by
	const cy = az * bx - ax * bz
	const cz = ax * by - ay * bx
	return cx * cx + cy * cy + cz * cz
}

function pushTri(
	positions: Float32Array,
	idx: number[],
	i0: number,
	i1: number,
	i2: number,
) {
	if (triangleArea2(positions, i0, i1, i2) < AREA2_EPS) {
		return
	}
	idx.push(i0, i1, i2)
}

export function buildRomanSurfaceMesh(): RomanMesh {
	const n = GRID_RES
	const vertsPerSide = n + 1
	const positions = new Float32Array(vertsPerSide * vertsPerSide * 3)

	for (let iv = 0; iv < vertsPerSide; iv++) {
		const v = (Math.PI * iv) / n
		for (let iu = 0; iu < vertsPerSide; iu++) {
			const u = (Math.PI * iu) / n
			const p = romanPoint(u, v)
			const vi = iv * vertsPerSide + iu
			positions[vi * 3] = p.x
			positions[vi * 3 + 1] = p.y
			positions[vi * 3 + 2] = p.z
		}
	}

	const idx: number[] = []
	for (let iv = 0; iv < n; iv++) {
		for (let iu = 0; iu < n; iu++) {
			const a = iv * vertsPerSide + iu
			const b = a + 1
			const c = a + vertsPerSide
			const d = c + 1
			pushTri(positions, idx, a, c, b)
			pushTri(positions, idx, b, c, d)
		}
	}

	centerAndScale(positions, TARGET_RADIUS)

	const colors = new Float32Array(positions.length)
	const span = 2 * TARGET_RADIUS
	for (let i = 0; i < positions.length; i += 3) {
		const u = (positions[i] + TARGET_RADIUS) / span
		const v = (positions[i + 1] + TARGET_RADIUS) / span
		const w = (positions[i + 2] + TARGET_RADIUS) / span
		colors[i] = 0.72 + 0.22 * u
		colors[i + 1] = 0.42 + 0.28 * v
		colors[i + 2] = 0.18 + 0.55 * (1 - w)
	}

	return { positions, indices: new Uint32Array(idx), colors }
}
