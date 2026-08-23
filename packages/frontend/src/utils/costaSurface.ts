const EPS = 1e-15
const TARGET_R = 1.7
/** Lattice half-width for ℘ / ζ sums on ℤ[i]. */
const LATTICE_N = 8

export const UV_RES = 56
export const MARGIN_MIN = 0.04
export const MARGIN_MAX = 0.2
export const DEFAULT_MARGIN = 0.08

export type CostaPoint = {
	x: number
	y: number
	z: number
}

export type CostaMesh = {
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
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

function triArea(
	positions: Float32Array,
	ia: number,
	ib: number,
	ic: number,
): number {
	const ax = positions[ia * 3]
	const ay = positions[ia * 3 + 1]
	const az = positions[ia * 3 + 2]
	const bx = positions[ib * 3] - ax
	const by = positions[ib * 3 + 1] - ay
	const bz = positions[ib * 3 + 2] - az
	const cx = positions[ic * 3] - ax
	const cy = positions[ic * 3 + 1] - ay
	const cz = positions[ic * 3 + 2] - az
	const nx = by * cz - bz * cy
	const ny = bz * cx - bx * cz
	const nz = bx * cy - by * cx
	return 0.5 * Math.hypot(nx, ny, nz)
}

/** Truncated Costa UV mesh. `margin` pulls the domain away from the three punctures. */
export function buildCostaMesh(margin = DEFAULT_MARGIN): CostaMesh {
	const m = clampMargin(margin)
	const grid = UV_RES
	const vertsPerSide = grid + 1
	const vertCount = vertsPerSide * vertsPerSide
	const positions = new Float32Array(vertCount * 3)
	const colors = new Float32Array(vertCount * 3)
	const valid = new Uint8Array(vertCount)

	let minX = Infinity
	let minY = Infinity
	let minZ = Infinity
	let maxX = -Infinity
	let maxY = -Infinity
	let maxZ = -Infinity

	const lo = m
	const hi = 1 - m
	const span = hi - lo

	for (let iy = 0; iy < vertsPerSide; iy++) {
		const v = lo + (span * iy) / grid
		for (let ix = 0; ix < vertsPerSide; ix++) {
			const u = lo + (span * ix) / grid
			const vi = iy * vertsPerSide + ix
			const p = costaPoint(u, v)
			const ok =
				Number.isFinite(p.x) &&
				Number.isFinite(p.y) &&
				Number.isFinite(p.z) &&
				Math.hypot(p.x, p.y, p.z) < 1e6
			valid[vi] = ok ? 1 : 0
			positions[vi * 3] = ok ? p.x : 0
			positions[vi * 3 + 1] = ok ? p.y : 0
			positions[vi * 3 + 2] = ok ? p.z : 0
			if (!ok) {
				continue
			}
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
	for (let i = 0; i < vertCount; i++) {
		if (!valid[i]) {
			colors[i * 3] = 0.5
			colors[i * 3 + 1] = 0.5
			colors[i * 3 + 2] = 0.5
			continue
		}
		const nx = (positions[i * 3] - minX) / dx
		const ny = (positions[i * 3 + 1] - minY) / dy
		const nz = (positions[i * 3 + 2] - minZ) / dz
		colors[i * 3] = 0.72 + 0.22 * nx
		colors[i * 3 + 1] = 0.42 + 0.28 * ny
		colors[i * 3 + 2] = 0.18 + 0.55 * (1 - nz)
	}

	const rawIdx: number[] = []
	const areaMin = 1e-10
	for (let iy = 0; iy < grid; iy++) {
		for (let ix = 0; ix < grid; ix++) {
			const a = iy * vertsPerSide + ix
			const b = a + 1
			const cIdx = a + vertsPerSide
			const d = cIdx + 1
			if (!valid[a] || !valid[b] || !valid[cIdx] || !valid[d]) {
				continue
			}
			if (triArea(positions, a, cIdx, b) > areaMin) {
				rawIdx.push(a, cIdx, b)
			}
			if (triArea(positions, b, cIdx, d) > areaMin) {
				rawIdx.push(b, cIdx, d)
			}
		}
	}

	centerAndScale(positions, TARGET_R)
	return {
		positions,
		indices: Uint32Array.from(rawIdx),
		colors,
	}
}
