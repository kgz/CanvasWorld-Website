const EPS = 1e-15
const DENOM_EPS = 1e-18
const NR = 48
const NT = 96
const SQRT5 = Math.sqrt(5)

type Complex = {
	re: number
	im: number
}

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

function cmul(a: Complex, b: Complex): Complex {
	return {
		re: a.re * b.re - a.im * b.im,
		im: a.re * b.im + a.im * b.re,
	}
}

function cdiv(a: Complex, b: Complex): Complex | null {
	const d = b.re * b.re + b.im * b.im
	if (d < DENOM_EPS) {
		return null
	}
	return {
		re: (a.re * b.re + a.im * b.im) / d,
		im: (a.im * b.re - a.re * b.im) / d,
	}
}

/** Bryant–Kusner: w ↦ (g1,g2,g3)/|g|² on the unit disk. */
export function boyPoint(re: number, im: number): BoyPoint | null {
	const w: Complex = { re, im }
	const w2 = cmul(w, w)
	const w3 = cmul(w2, w)
	const w4 = cmul(w2, w2)
	const w6 = cmul(w3, w3)
	const denom: Complex = {
		re: w6.re + SQRT5 * w3.re - 1,
		im: w6.im + SQRT5 * w3.im,
	}
	const q1 = cdiv(cmul(w, { re: 1 - w4.re, im: -w4.im }), denom)
	const q2 = cdiv(cmul(w, { re: 1 + w4.re, im: w4.im }), denom)
	const q3 = cdiv({ re: 1 + w6.re, im: w6.im }, denom)
	if (q1 === null || q2 === null || q3 === null) {
		return null
	}
	const g1 = -1.5 * q1.im
	const g2 = -1.5 * q2.re
	const g3 = q3.im - 0.5
	const n2 = g1 * g1 + g2 * g2 + g3 * g3
	if (n2 < DENOM_EPS) {
		return null
	}
	const x = g1 / n2
	const y = g2 / n2
	const z = g3 / n2
	if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
		return null
	}
	return { x, y, z }
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

function ringIndex(ir: number, it: number): number {
	return 1 + (ir - 1) * NT + it
}

export function buildBoyMesh(): BoyMesh {
	const origin = boyPoint(0, 0)
	const pts: (BoyPoint | null)[] = [origin]
	for (let ir = 1; ir <= NR; ir++) {
		const r = ir / NR
		for (let it = 0; it < NT; it++) {
			const th = (2 * Math.PI * it) / NT
			pts.push(boyPoint(r * Math.cos(th), r * Math.sin(th)))
		}
	}

	const vertIndex: number[] = []
	for (let i = 0; i < pts.length; i++) {
		vertIndex.push(-1)
	}
	const pos: number[] = []
	const idx: number[] = []

	const ensureVert = (i: number): number => {
		if (vertIndex[i] >= 0) {
			return vertIndex[i]
		}
		const p = pts[i]
		if (p === null) {
			return -1
		}
		const vi = pos.length / 3
		pos.push(p.x, p.y, p.z)
		vertIndex[i] = vi
		return vi
	}

	const emit = (a: number, b: number, c: number) => {
		if (pts[a] === null || pts[b] === null || pts[c] === null) {
			return
		}
		const ia = ensureVert(a)
		const ib = ensureVert(b)
		const ic = ensureVert(c)
		if (ia < 0 || ib < 0 || ic < 0) {
			return
		}
		idx.push(ia, ib, ic)
	}

	for (let it = 0; it < NT; it++) {
		const it2 = (it + 1) % NT
		emit(0, ringIndex(1, it), ringIndex(1, it2))
	}
	for (let ir = 1; ir < NR; ir++) {
		for (let it = 0; it < NT; it++) {
			const it2 = (it + 1) % NT
			const a = ringIndex(ir, it)
			const b = ringIndex(ir, it2)
			const c = ringIndex(ir + 1, it)
			const d = ringIndex(ir + 1, it2)
			emit(a, c, b)
			emit(b, c, d)
		}
	}

	const positions = new Float32Array(pos)
	const indices = new Uint32Array(idx)
	centerAndScale(positions, 1.7)

	const colors = new Float32Array(positions.length)
	const span = 3.4
	for (let i = 0; i < positions.length; i += 3) {
		const u = (positions[i] + 1.7) / span
		const v = (positions[i + 1] + 1.7) / span
		const w = (positions[i + 2] + 1.7) / span
		colors[i] = 0.72 + 0.22 * u
		colors[i + 1] = 0.42 + 0.28 * v
		colors[i + 2] = 0.18 + 0.55 * (1 - w)
	}

	return { positions, indices, colors }
}
