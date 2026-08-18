const EPS = 1e-15
const DENOM_EPS = 1e-8
const SQRT2 = Math.sqrt(2)
const U_RES = 80
const V_RES = 80

export type BoyPoint = {
	x: number
	y: number
	z: number
}

export type BoyMesh = {
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
}

/** Morin–Apéry Boy immersion (homotopy parameter 1). u,v ∈ [0, π]. */
export function boyPoint(u: number, v: number): BoyPoint {
	const s2v = Math.sin(2 * v)
	const cv2 = Math.cos(v) * Math.cos(v)
	let d = 2 - SQRT2 * Math.sin(3 * u) * s2v
	if (Math.abs(d) < DENOM_EPS) {
		d = d >= 0 ? DENOM_EPS : -DENOM_EPS
	}
	return {
		x: (SQRT2 * Math.cos(2 * u) * cv2 + Math.cos(u) * s2v) / d,
		y: (SQRT2 * Math.sin(2 * u) * cv2 - Math.sin(u) * s2v) / d,
		z: (3 * cv2) / d,
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

export function buildBoyMesh(): BoyMesh {
	const uCount = U_RES + 1
	const vCount = V_RES + 1
	const positions = new Float32Array(uCount * vCount * 3)
	for (let iv = 0; iv < vCount; iv++) {
		const v = (Math.PI * iv) / V_RES
		for (let iu = 0; iu < uCount; iu++) {
			const u = (Math.PI * iu) / U_RES
			const p = boyPoint(u, v)
			const i = (iv * uCount + iu) * 3
			positions[i] = p.x
			positions[i + 1] = p.y
			positions[i + 2] = p.z
		}
	}

	const idx: number[] = []
	for (let iv = 0; iv < V_RES; iv++) {
		for (let iu = 0; iu < U_RES; iu++) {
			const i00 = iv * uCount + iu
			const i10 = i00 + 1
			const i01 = i00 + uCount
			const i11 = i01 + 1
			idx.push(i00, i01, i10, i10, i01, i11)
		}
	}

	centerAndScale(positions, 1.7)
	const colors = new Float32Array(positions.length)
	for (let i = 0; i < positions.length; i += 3) {
		const uu = (positions[i] + 1.7) / 3.4
		const vv = (positions[i + 1] + 1.7) / 3.4
		const w = (positions[i + 2] + 1.7) / 3.4
		colors[i] = 0.72 + 0.22 * uu
		colors[i + 1] = 0.42 + 0.28 * vv
		colors[i + 2] = 0.18 + 0.55 * (1 - w)
	}
	return { positions, indices: new Uint32Array(idx), colors }
}
