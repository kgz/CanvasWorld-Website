const EPS = 1e-15
const DENOM_EPS = 1e-8
const SQRT2 = Math.sqrt(2)
const SQRT5 = Math.sqrt(5)
const TARGET_R = 1.7

export type BoyPoint = {
	x: number
	y: number
	z: number
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

export function clampBlend(t: number): number {
	return Math.min(1, Math.max(0, t))
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
