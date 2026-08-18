const EPS = 1e-15
const TAN_EPS = 1e-6
const TURNS = 3
const U_MAX = Math.PI * 2 * TURNS
const V_MIN = 0.15
const V_MAX = 1
const U_RES = 96
const V_RES = 48

export type DiniMesh = {
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
}

export function clampRadius(a: number): number {
	return Math.min(3, Math.max(0.15, a))
}

export function clampTwist(b: number): number {
	return Math.min(1.2, Math.max(0, b))
}

/** Classic Dini: x=a cos(u) sin(v), y=a sin(u) sin(v), z=a(cos(v)+ln tan(v/2))+b u */
export function diniPoint(u: number, v: number, a: number, b: number): { x: number; y: number; z: number } {
	const t = Math.tan(v / 2)
	const guarded = t > TAN_EPS && Number.isFinite(t) ? t : TAN_EPS
	const sv = Math.sin(v)
	return {
		x: a * Math.cos(u) * sv,
		y: a * Math.sin(u) * sv,
		z: a * (Math.cos(v) + Math.log(guarded)) + b * u,
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

function xyzColors(positions: Float32Array): Float32Array {
	const colors = new Float32Array(positions.length)
	let minX = Infinity
	let minY = Infinity
	let minZ = Infinity
	let maxX = -Infinity
	let maxY = -Infinity
	let maxZ = -Infinity
	for (let i = 0; i < positions.length; i += 3) {
		const x = positions[i]
		const y = positions[i + 1]
		const z = positions[i + 2]
		if (x < minX) {
			minX = x
		}
		if (y < minY) {
			minY = y
		}
		if (z < minZ) {
			minZ = z
		}
		if (x > maxX) {
			maxX = x
		}
		if (y > maxY) {
			maxY = y
		}
		if (z > maxZ) {
			maxZ = z
		}
	}
	const dx = maxX - minX
	const dy = maxY - minY
	const dz = maxZ - minZ
	for (let i = 0; i < positions.length; i += 3) {
		const u = dx > EPS ? (positions[i] - minX) / dx : 0
		const v = dy > EPS ? (positions[i + 1] - minY) / dy : 0
		const w = dz > EPS ? (positions[i + 2] - minZ) / dz : 0
		colors[i] = 0.72 + 0.22 * u
		colors[i + 1] = 0.42 + 0.28 * v
		colors[i + 2] = 0.18 + 0.55 * (1 - w)
	}
	return colors
}

export function buildDiniMesh(a: number, b: number): DiniMesh {
	const radius = clampRadius(a)
	const twist = clampTwist(b)
	const uCount = U_RES + 1
	const vCount = V_RES + 1
	const vertCount = uCount * vCount
	const positions = new Float32Array(vertCount * 3)

	for (let iv = 0; iv < vCount; iv++) {
		const v = V_MIN + ((V_MAX - V_MIN) * iv) / V_RES
		for (let iu = 0; iu < uCount; iu++) {
			const u = (U_MAX * iu) / U_RES
			const p = diniPoint(u, v, radius, twist)
			const vi = iv * uCount + iu
			positions[vi * 3] = p.x
			positions[vi * 3 + 1] = p.y
			positions[vi * 3 + 2] = p.z
		}
	}

	const vertFinite = (vi: number) =>
		Number.isFinite(positions[vi * 3]) &&
		Number.isFinite(positions[vi * 3 + 1]) &&
		Number.isFinite(positions[vi * 3 + 2])

	const indexBuf: number[] = []
	for (let iv = 0; iv < V_RES; iv++) {
		for (let iu = 0; iu < U_RES; iu++) {
			const i00 = iv * uCount + iu
			const i10 = i00 + 1
			const i01 = i00 + uCount
			const i11 = i01 + 1
			if (!vertFinite(i00) || !vertFinite(i10) || !vertFinite(i01) || !vertFinite(i11)) {
				continue
			}
			indexBuf.push(i00, i01, i10, i10, i01, i11)
		}
	}

	const indices = new Uint32Array(indexBuf)
	centerAndScale(positions, 1.7)
	return { positions, indices, colors: xyzColors(positions) }
}
