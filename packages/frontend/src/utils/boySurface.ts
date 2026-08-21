const EPS = 1e-15
const DENOM_EPS = 1e-8
const SQRT2 = Math.sqrt(2)
const SQRT5 = Math.sqrt(5)
const U_RES = 80
const V_RES = 80
const TARGET_R = 1.7

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

export type BoyCloud = {
	positions: Float32Array
	colors: Float32Array
	count: number
}

type Complex = {
	re: number
	im: number
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

/** Morin–Apéry family: k=0 ≈ Roman, k=1 = Boy. u,v ∈ [0, π]. */
export function boyPoint(u: number, v: number, k = 1): BoyPoint {
	const kk = clampHomotopy(k)
	const s2v = Math.sin(2 * v)
	const cv2 = Math.cos(v) * Math.cos(v)
	let d = 2 - kk * SQRT2 * Math.sin(3 * u) * s2v
	if (Math.abs(d) < DENOM_EPS) {
		d = d >= 0 ? DENOM_EPS : -DENOM_EPS
	}
	return {
		x: (SQRT2 * Math.cos(2 * u) * cv2 + Math.cos(u) * s2v) / d,
		y: (SQRT2 * Math.sin(2 * u) * cv2 - Math.sin(u) * s2v) / d,
		z: (3 * cv2) / d,
	}
}

export function clampHomotopy(k: number): number {
	return Math.min(1, Math.max(0, k))
}

export function clampCurves(curves: number): number {
	return Math.min(80, Math.max(16, Math.round(curves)))
}

export function clampDetail(detail: number): number {
	return Math.min(280, Math.max(64, Math.round(detail)))
}

export function clampBlend(t: number): number {
	return Math.min(1, Math.max(0, t))
}

export function clampRings(rings: number): number {
	return Math.min(80, Math.max(8, Math.round(rings)))
}

export function clampRays(rays: number): number {
	return Math.min(96, Math.max(12, Math.round(rays)))
}

/** Shared polar domain: disk (r,θ) ↔ Apéry (u,v) and Bryant w. */
function polarToDomains(r: number, th: number) {
	const rr = Math.min(1, Math.max(0, r))
	return {
		u: 0.5 * th,
		v: Math.PI * rr,
		re: rr * Math.cos(th),
		im: rr * Math.sin(th),
	}
}

/** Bryant–Kusner on the unit disk (w = re + i im). */
export function boyPointBryant(re: number, im: number): BoyPoint | null {
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

function xyzColors(positions: Float32Array): Float32Array {
	const colors = new Float32Array(positions.length)
	const span = TARGET_R * 2
	for (let i = 0; i < positions.length; i += 3) {
		const u = (positions[i] + TARGET_R) / span
		const v = (positions[i + 1] + TARGET_R) / span
		const w = (positions[i + 2] + TARGET_R) / span
		colors[i] = 0.72 + 0.22 * u
		colors[i + 1] = 0.42 + 0.28 * v
		colors[i + 2] = 0.18 + 0.55 * (1 - w)
	}
	return colors
}

/** Coral → amber → teal along UV (punchier than xyz for points/lines). */
function writeUvRibbon(colors: Float32Array, i: number, uN: number, vN: number) {
	const t = Math.min(1, Math.max(0, 0.55 * uN + 0.45 * vN))
	if (t < 0.5) {
		const s = t / 0.5
		colors[i] = 1
		colors[i + 1] = 0.22 + 0.55 * s
		colors[i + 2] = 0.32 + 0.05 * s
		return
	}
	const s = (t - 0.5) / 0.5
	colors[i] = 1 - 0.82 * s
	colors[i + 1] = 0.77 + 0.2 * s
	colors[i + 2] = 0.37 + 0.58 * s
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

	centerAndScale(positions, TARGET_R)
	return { positions, indices: new Uint32Array(idx), colors: xyzColors(positions) }
}

/** UV grid as a particle cloud (legacy dots). */
export function sampleBoyCloud(nu = 96, nv = 96): BoyCloud {
	const count = nu * nv
	const positions = new Float32Array(count * 3)
	let k = 0
	for (let iv = 0; iv < nv; iv++) {
		const v = (Math.PI * iv) / (nv - 1)
		for (let iu = 0; iu < nu; iu++) {
			const u = (Math.PI * iu) / (nu - 1)
			const p = boyPoint(u, v)
			positions[k++] = p.x
			positions[k++] = p.y
			positions[k++] = p.z
		}
	}
	centerAndScale(positions, TARGET_R)
	return { positions, colors: xyzColors(positions), count }
}

/**
 * Row-major UV scan as one polyline (legacy line trail).
 * Odd rows reverse so the strip snakes continuously.
 */
export function sampleBoyScanline(nu = 200, nv = 140, k = 1): BoyCloud {
	const count = nu * nv
	const positions = new Float32Array(count * 3)
	const colors = new Float32Array(count * 3)
	let i = 0
	for (let iv = 0; iv < nv; iv++) {
		const vN = nv <= 1 ? 0 : iv / (nv - 1)
		const v = Math.PI * vN
		const reverse = iv % 2 === 1
		for (let t = 0; t < nu; t++) {
			const iu = reverse ? nu - 1 - t : t
			const uN = nu <= 1 ? 0 : iu / (nu - 1)
			const u = Math.PI * uN
			const p = boyPoint(u, v, k)
			positions[i] = p.x
			positions[i + 1] = p.y
			positions[i + 2] = p.z
			writeUvRibbon(colors, i, uN, vN)
			i += 3
		}
	}
	centerAndScale(positions, TARGET_R)
	return { positions, colors, count }
}

/** Constant-u / constant-v Apéry curves as a dense point wire. */
export function sampleBoyIsolines(nu = 64, nv = 64, samples = 200, k = 1): BoyCloud {
	const count = (nu + nv) * samples
	const positions = new Float32Array(count * 3)
	const colors = new Float32Array(count * 3)
	let i = 0
	for (let iu = 0; iu < nu; iu++) {
		const uN = nu <= 1 ? 0 : iu / (nu - 1)
		const u = Math.PI * uN
		for (let s = 0; s < samples; s++) {
			const vN = samples <= 1 ? 0 : s / (samples - 1)
			const v = Math.PI * vN
			const p = boyPoint(u, v, k)
			positions[i] = p.x
			positions[i + 1] = p.y
			positions[i + 2] = p.z
			writeUvRibbon(colors, i, uN, vN)
			i += 3
		}
	}
	for (let iv = 0; iv < nv; iv++) {
		const vN = nv <= 1 ? 0 : iv / (nv - 1)
		const v = Math.PI * vN
		for (let s = 0; s < samples; s++) {
			const uN = samples <= 1 ? 0 : s / (samples - 1)
			const u = Math.PI * uN
			const p = boyPoint(u, v, k)
			positions[i] = p.x
			positions[i + 1] = p.y
			positions[i + 2] = p.z
			writeUvRibbon(colors, i, uN, vN)
			i += 3
		}
	}
	centerAndScale(positions, TARGET_R)
	return { positions, colors, count }
}

/**
 * Polar isolines morphing Apéry family ↔ Bryant–Kusner.
 * k: Roman→Apéry Boy. bryant: Apéry→Bryant (three-ball) after each side is normalized.
 */
export function sampleBoyMorphIsolines(
	nRings = 40,
	nRays = 48,
	samples = 200,
	k = 1,
	bryant = 0,
): BoyCloud {
	const kk = clampHomotopy(k)
	const bt = clampBlend(bryant)
	const count = (nRings + nRays) * samples
	const apery = new Float32Array(count * 3)
	const bryantPos = new Float32Array(count * 3)
	const colors = new Float32Array(count * 3)
	let i = 0

	const push = (r: number, th: number) => {
		const { u, v, re, im } = polarToDomains(r, th)
		const a = boyPoint(u, v, kk)
		const b = boyPointBryant(re, im)
		const i3 = i * 3
		apery[i3] = a.x
		apery[i3 + 1] = a.y
		apery[i3 + 2] = a.z
		if (b) {
			bryantPos[i3] = b.x
			bryantPos[i3 + 1] = b.y
			bryantPos[i3 + 2] = b.z
		} else {
			bryantPos[i3] = a.x
			bryantPos[i3 + 1] = a.y
			bryantPos[i3 + 2] = a.z
		}
		writeUvRibbon(colors, i3, th / (2 * Math.PI), r)
		i += 1
	}

	for (let ir = 1; ir <= nRings; ir++) {
		const r = ir / nRings
		for (let s = 0; s < samples; s++) {
			push(r, (2 * Math.PI * s) / samples)
		}
	}
	for (let it = 0; it < nRays; it++) {
		const th = (2 * Math.PI * it) / nRays
		for (let s = 0; s < samples; s++) {
			const r = samples <= 1 ? 0 : s / (samples - 1)
			push(r, th)
		}
	}

	centerAndScale(apery, TARGET_R)
	centerAndScale(bryantPos, TARGET_R)

	const positions = new Float32Array(count * 3)
	const omt = 1 - bt
	for (let j = 0; j < positions.length; j++) {
		positions[j] = apery[j] * omt + bryantPos[j] * bt
	}
	return { positions, colors, count }
}

export function buildBryantBoyMesh(): BoyMesh {
	const nr = 48
	const nt = 96
	const origin = boyPointBryant(0, 0)
	const pts: (BoyPoint | null)[] = [origin]
	for (let ir = 1; ir <= nr; ir++) {
		const r = ir / nr
		for (let it = 0; it < nt; it++) {
			const th = (2 * Math.PI * it) / nt
			pts.push(boyPointBryant(r * Math.cos(th), r * Math.sin(th)))
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

	const ringIndex = (ir: number, it: number) => 1 + (ir - 1) * nt + it

	for (let it = 0; it < nt; it++) {
		const it2 = (it + 1) % nt
		emit(0, ringIndex(1, it), ringIndex(1, it2))
	}
	for (let ir = 1; ir < nr; ir++) {
		for (let it = 0; it < nt; it++) {
			const it2 = (it + 1) % nt
			const a = ringIndex(ir, it)
			const b = ringIndex(ir, it2)
			const c = ringIndex(ir + 1, it)
			const d = ringIndex(ir + 1, it2)
			emit(a, c, b)
			emit(b, c, d)
		}
	}

	const positions = new Float32Array(pos)
	centerAndScale(positions, TARGET_R)
	return { positions, indices: new Uint32Array(idx), colors: xyzColors(positions) }
}
