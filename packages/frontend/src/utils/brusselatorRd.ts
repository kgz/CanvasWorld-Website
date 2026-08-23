/** Spatial Brusselator reaction–diffusion on a rectangular grid (Neumann / reflective borders). */

export const BRUSSELATOR_RD_MIN_SIZE = 32
export const BRUSSELATOR_RD_MAX_SIZE = 192
export const BRUSSELATOR_RD_DEFAULT_SIZE = 96
/** HUD / embed progress target (steps from seed). */
export const BRUSSELATOR_RD_TARGET_STEPS = 2_400

export type BrusselatorRdParams = {
	a: number
	b: number
	du: number
	dv: number
	dt: number
}

export type BrusselatorRdField = {
	size: number
	u: Float32Array
	v: Float32Array
}

export function clampGridSize(n: number): number {
	const rounded = Math.round(n)
	return Math.max(BRUSSELATOR_RD_MIN_SIZE, Math.min(BRUSSELATOR_RD_MAX_SIZE, rounded))
}

export function clampDt(dt: number): number {
	return Math.max(1e-4, Math.min(dt, 0.05))
}

/** Sample with reflective (Neumann) borders: out-of-range indices mirror. */
export function sampleReflective(field: Float32Array, size: number, x: number, y: number): number {
	let ix = x
	let iy = y
	if (ix < 0) ix = -ix
	if (iy < 0) iy = -iy
	if (ix >= size) ix = 2 * size - ix - 2
	if (iy >= size) iy = 2 * size - iy - 2
	ix = Math.max(0, Math.min(size - 1, ix))
	iy = Math.max(0, Math.min(size - 1, iy))
	return field[iy * size + ix] ?? 0
}

export function laplacianNeumann(field: Float32Array, size: number, x: number, y: number): number {
	const c = sampleReflective(field, size, x, y)
	const l = sampleReflective(field, size, x - 1, y)
	const r = sampleReflective(field, size, x + 1, y)
	const d = sampleReflective(field, size, x, y - 1)
	const u = sampleReflective(field, size, x, y + 1)
	return l + r + d + u - 4 * c
}

function mulberry32(seed: number): () => number {
	let t = seed >>> 0
	return () => {
		t += 0x6d2b79f5
		let r = Math.imul(t ^ (t >>> 15), 1 | t)
		r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296
	}
}

/** Steady state (a, b/a) plus small noise — Turing patterns need a perturbation. */
export function seedBrusselatorRd(
	size: number,
	a: number,
	b: number,
	noise = 0.08,
	seed = 0xb50d50,
): BrusselatorRdField {
	const n = clampGridSize(size)
	const u = new Float32Array(n * n)
	const v = new Float32Array(n * n)
	const u0 = a
	const v0 = b / Math.max(a, 1e-6)
	const rand = mulberry32(seed >>> 0)
	for (let i = 0; i < n * n; i++) {
		u[i] = u0 + (rand() * 2 - 1) * noise
		v[i] = v0 + (rand() * 2 - 1) * noise
	}
	return { size: n, u, v }
}

/**
 * One forward-Euler RD step:
 *   ∂u/∂t = Du ∇²u + a − (b+1)u + u²v
 *   ∂v/∂t = Dv ∇²v + bu − u²v
 */
export function stepBrusselatorRd(field: BrusselatorRdField, params: BrusselatorRdParams): void {
	const { size, u, v } = field
	const a = params.a
	const b = params.b
	const du = Math.max(params.du, 0)
	const dv = Math.max(params.dv, 0)
	const dt = clampDt(params.dt)
	const nextU = new Float32Array(size * size)
	const nextV = new Float32Array(size * size)

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const i = y * size + x
			const ui = u[i] ?? 0
			const vi = v[i] ?? 0
			const lu = laplacianNeumann(u, size, x, y)
			const lv = laplacianNeumann(v, size, x, y)
			const u2v = ui * ui * vi
			let nu = ui + (du * lu + a - (b + 1) * ui + u2v) * dt
			let nv = vi + (dv * lv + b * ui - u2v) * dt
			if (!isFinite(nu)) nu = ui
			if (!isFinite(nv)) nv = vi
			nu = Math.max(0, Math.min(nu, 100))
			nv = Math.max(0, Math.min(nv, 100))
			nextU[i] = nu
			nextV[i] = nv
		}
	}

	u.set(nextU)
	v.set(nextV)
}

export function runBrusselatorRdSteps(
	field: BrusselatorRdField,
	params: BrusselatorRdParams,
	steps: number,
): void {
	const n = Math.max(0, Math.floor(steps))
	for (let i = 0; i < n; i++) {
		stepBrusselatorRd(field, params)
	}
}

/** Map u into RGB (teal → amber) for the particle field. */
export function colorFromU(u: number, a: number, out: { r: number; g: number; b: number }): void {
	const mid = Math.max(a, 1e-6)
	const t = Math.max(0, Math.min(1, (u - mid * 0.35) / (mid * 1.4)))
	const h = 0.55 - t * 0.45
	const s = 0.55 + t * 0.35
	const l = 0.28 + t * 0.42
	hslToRgb(h, s, l, out)
}

function hslToRgb(h: number, s: number, l: number, out: { r: number; g: number; b: number }): void {
	if (s === 0) {
		out.r = l
		out.g = l
		out.b = l
		return
	}
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s
	const p = 2 * l - q
	out.r = hue2rgb(p, q, h + 1 / 3)
	out.g = hue2rgb(p, q, h)
	out.b = hue2rgb(p, q, h - 1 / 3)
}

function hue2rgb(p: number, q: number, t: number): number {
	let tt = t
	if (tt < 0) tt += 1
	if (tt > 1) tt -= 1
	if (tt < 1 / 6) return p + (q - p) * 6 * tt
	if (tt < 1 / 2) return q
	if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
	return p
}

/** Pack grid centers into xy positions spanning roughly [-span, span]. */
export function fillGridPositions(positions: Float32Array, size: number, span = 1): void {
	const n = size
	const denom = Math.max(n - 1, 1)
	for (let y = 0; y < n; y++) {
		for (let x = 0; x < n; x++) {
			const i = y * n + x
			positions[i * 2] = (x / denom) * 2 * span - span
			positions[i * 2 + 1] = (y / denom) * 2 * span - span
		}
	}
}

export function fillColorsFromU(
	colors: Float32Array,
	field: BrusselatorRdField,
	a: number,
): void {
	const { size, u } = field
	const rgb = { r: 0, g: 0, b: 0 }
	for (let i = 0; i < size * size; i++) {
		colorFromU(u[i] ?? 0, a, rgb)
		colors[i * 3] = rgb.r
		colors[i * 3 + 1] = rgb.g
		colors[i * 3 + 2] = rgb.b
	}
}
