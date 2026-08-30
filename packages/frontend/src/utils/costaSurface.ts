const EPS = 1e-15
const TARGET_R = 1.7
/** Lattice half-width for ℘ / ζ sums on ℤ[i]. */
const LATTICE_N = 8

export const UV_RES = 56
export const MARGIN_MIN = 0.04
export const MARGIN_MAX = 0.2
export const DEFAULT_MARGIN = 0.08
/** Fixed GPU budget so param scrubs don't remount buffers / reset `n`. */
export const COSTA_MAX_POINTS = 120_000

export type CostaPoint = {
	x: number
	y: number
	z: number
}

export type CostaCloud = {
	positions: Float32Array
	colors: Float32Array
	/** Always COSTA_MAX_POINTS (padded). */
	count: number
}

export function clampMargin(m: number): number {
	return Math.min(MARGIN_MAX, Math.max(MARGIN_MIN, m))
}

type C = { re: number; im: number }

function c(re: number, im = 0): C {
	return { re, im }
}

function cAdd(a: C, b: C): C {
	return { re: a.re + b.re, im: a.im + b.im }
}

function cSub(a: C, b: C): C {
	return { re: a.re - b.re, im: a.im - b.im }
}

function cMul(a: C, b: C): C {
	return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }
}

function cScale(a: C, s: number): C {
	return { re: a.re * s, im: a.im * s }
}

function cInv(a: C): C {
	const d = a.re * a.re + a.im * a.im
	return { re: a.re / d, im: -a.im / d }
}

function cAbs2(a: C): number {
	return a.re * a.re + a.im * a.im
}

/** Weierstrass ℘ on Λ = ℤ[i]. */
export function weierstrassP(zRe: number, zIm: number): C {
	const z = c(zRe, zIm)
	let sum = cInv(cMul(z, z))
	for (let m = -LATTICE_N; m <= LATTICE_N; m++) {
		for (let n = -LATTICE_N; n <= LATTICE_N; n++) {
			if (m === 0 && n === 0) {
				continue
			}
			const w = c(m, n)
			const zw = cSub(z, w)
			const invZw2 = cInv(cMul(zw, zw))
			const invW2 = cInv(cMul(w, w))
			sum = cAdd(sum, cSub(invZw2, invW2))
		}
	}
	return sum
}

/** Weierstrass ζ on Λ = ℤ[i]. */
export function weierstrassZeta(zRe: number, zIm: number): C {
	const z = c(zRe, zIm)
	let sum = cInv(z)
	for (let m = -LATTICE_N; m <= LATTICE_N; m++) {
		for (let n = -LATTICE_N; n <= LATTICE_N; n++) {
			if (m === 0 && n === 0) {
				continue
			}
			const w = c(m, n)
			const invZw = cInv(cSub(z, w))
			const invW = cInv(w)
			const zOverW2 = cMul(z, cInv(cMul(w, w)))
			sum = cAdd(sum, cAdd(cAdd(invZw, invW), zOverW2))
		}
	}
	return sum
}

/** e₁ = ℘(1/2) for the square lattice (real). */
export const E1 = weierstrassP(0.5, 0).re

/**
 * Costa–Hoffman–Meeks coordinates on the punctured square torus.
 * Domain: u,v ∈ (0,1) away from punctures at 0, 1/2, i/2.
 */
export function costaPoint(u: number, v: number): CostaPoint {
	const zeta = weierstrassZeta(u, v)
	const zetaHalf = weierstrassZeta(u - 0.5, v)
	const zetaIHalf = weierstrassZeta(u, v - 0.5)
	const dZeta = cSub(zetaHalf, zetaIHalf)
	const pi = Math.PI
	const piOver2e1 = pi / (2 * E1)
	const pi2Over4e1 = (pi * pi) / (4 * E1)

	const x1Inner = cAdd(
		cAdd(cScale(zeta, -1), c(pi * u + pi2Over4e1, 0)),
		cScale(dZeta, piOver2e1),
	)
	const x2Inner = cAdd(
		cAdd(cMul(c(0, -1), zeta), c(pi * v + pi2Over4e1, 0)),
		cMul(c(0, -piOver2e1), dZeta),
	)

	const wp = weierstrassP(u, v)
	const num = cSub(wp, c(E1, 0))
	const den = cAdd(wp, c(E1, 0))
	const ratioAbs = Math.sqrt(cAbs2(num) / Math.max(EPS, cAbs2(den)))
	const x3 = (Math.sqrt(2 * pi) / 4) * Math.log(Math.max(EPS, ratioAbs))

	return {
		x: 0.5 * x1Inner.re,
		y: 0.5 * x2Inner.re,
		z: x3,
	}
}

function centerAndScale(positions: Float32Array, count: number, targetRadius: number) {
	if (count === 0) {
		return
	}
	let cx = 0
	let cy = 0
	let cz = 0
	for (let i = 0; i < count; i++) {
		cx += positions[i * 3]
		cy += positions[i * 3 + 1]
		cz += positions[i * 3 + 2]
	}
	cx /= count
	cy /= count
	cz /= count

	let maxR = 0
	for (let i = 0; i < count; i++) {
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
	for (let i = 0; i < count * 3; i++) {
		positions[i] *= s
	}
}

/** Coral → amber → teal by direction (reads on black). */
function writeRibbon(colors: Float32Array, i: number, x: number, y: number, z: number) {
	const r = Math.hypot(x, y, z) || 1
	const u = 0.5 + 0.5 * (x / r)
	const v = 0.5 + 0.5 * (y / r)
	const w = 0.5 + 0.5 * (z / r)
	const t = Math.min(1, Math.max(0, 0.45 * u + 0.25 * v + 0.3 * (1 - w)))
	if (t < 0.5) {
		const s = t / 0.5
		colors[i] = 1
		colors[i + 1] = 0.2 + 0.55 * s
		colors[i + 2] = 0.28 + 0.08 * s
		return
	}
	const s = (t - 0.5) / 0.5
	colors[i] = 1 - 0.82 * s
	colors[i + 1] = 0.75 + 0.22 * s
	colors[i + 2] = 0.36 + 0.58 * s
}

/** Truncated Costa UV chart as a particle cloud. `margin` pulls the domain away from the three punctures. */
export function sampleCostaCloud(margin = DEFAULT_MARGIN): CostaCloud {
	const m = clampMargin(margin)
	const grid = UV_RES
	const vertsPerSide = grid + 1
	const lo = m
	const hi = 1 - m
	const span = hi - lo

	const raw: number[] = []
	for (let iy = 0; iy < vertsPerSide; iy++) {
		const v = lo + (span * iy) / grid
		for (let ix = 0; ix < vertsPerSide; ix++) {
			const u = lo + (span * ix) / grid
			const p = costaPoint(u, v)
			const ok =
				Number.isFinite(p.x) &&
				Number.isFinite(p.y) &&
				Number.isFinite(p.z) &&
				Math.hypot(p.x, p.y, p.z) < 1e6
			if (!ok) {
				continue
			}
			raw.push(p.x, p.y, p.z)
		}
	}

	const total = raw.length / 3
	const keep = Math.min(total, COSTA_MAX_POINTS)
	const stride = total > keep ? total / keep : 1

	const positions = new Float32Array(COSTA_MAX_POINTS * 3)
	const colors = new Float32Array(COSTA_MAX_POINTS * 3)
	for (let i = 0; i < keep; i++) {
		const src = Math.min(total - 1, Math.floor(i * stride)) * 3
		const i3 = i * 3
		positions[i3] = raw[src]
		positions[i3 + 1] = raw[src + 1]
		positions[i3 + 2] = raw[src + 2]
	}

	centerAndScale(positions, keep, TARGET_R)
	for (let i = 0; i < keep; i++) {
		const i3 = i * 3
		writeRibbon(colors, i3, positions[i3], positions[i3 + 1], positions[i3 + 2])
	}
	if (keep > 0) {
		const px = positions[0]
		const py = positions[1]
		const pz = positions[2]
		const cr = colors[0]
		const cg = colors[1]
		const cb = colors[2]
		for (let i = keep; i < COSTA_MAX_POINTS; i++) {
			const i3 = i * 3
			positions[i3] = px
			positions[i3 + 1] = py
			positions[i3 + 2] = pz
			colors[i3] = cr
			colors[i3 + 1] = cg
			colors[i3 + 2] = cb
		}
	}

	return { positions, colors, count: COSTA_MAX_POINTS }
}
