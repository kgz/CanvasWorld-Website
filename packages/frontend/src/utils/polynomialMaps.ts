/** Discrete 3D polynomial maps — piecewise-linear absolute-value and Type A/B/C cousins. */

export type PolynomialAbsCoeffs = {
	xa: number
	xb: number
	xc: number
	xd: number
	xe: number
	xf: number
	xg: number
	ya: number
	yb: number
	yc: number
	yd: number
	ye: number
	yf: number
	yg: number
	za: number
	zb: number
	zc: number
	zd: number
	ze: number
	zf: number
	zg: number
}

export const POLYNOMIAL_ABS_COEFF_KEYS = [
	'xa',
	'xb',
	'xc',
	'xd',
	'xe',
	'xf',
	'xg',
	'ya',
	'yb',
	'yc',
	'yd',
	'ye',
	'yf',
	'yg',
	'za',
	'zb',
	'zc',
	'zd',
	'ze',
	'zf',
	'zg',
] as const satisfies readonly (keyof PolynomialAbsCoeffs)[]

/** Fixed GPU budget so param scrubs don't remount buffers / reset `n`. */
export const POLYNOMIAL_MAP_MAX_POINTS = 120_000
export const POLYNOMIAL_ABS_MAX_POINTS = POLYNOMIAL_MAP_MAX_POINTS
const TARGET_R = 1.85
const WARMUP = 256

export const POLYNOMIAL_ABS_DEFAULTS: PolynomialAbsCoeffs = {
	xa: 0.607407407407407,
	xb: 1.1322,
	xc: 0.4704,
	xd: -0.0148,
	xe: -0.3236,
	xf: -0.4119,
	xg: -0.1913,
	ya: -0.693,
	yb: -0.521,
	yc: 0.399,
	yd: -0.968,
	ye: 0.958,
	yf: 0.305,
	yg: -0.43,
	za: 0.133,
	zb: 0.416,
	zc: 1.144,
	zd: -0.651851851851852,
	ze: -0.844444444444444,
	zf: 0.754,
	zg: -0.414814814814815,
}

/** Stronger |x| coupling — tighter folded volume. */
export const POLYNOMIAL_ABS_PRESET_FOLDED: PolynomialAbsCoeffs = {
	...POLYNOMIAL_ABS_DEFAULTS,
	xb: 1.159,
	xc: 0.281481481481481,
	xd: -0.191,
	xe: -0.348,
	xf: -0.176,
	xg: -0.702,
}

/** Y-axis cross-coupling shift — lobes with a different fold layout. */
export const POLYNOMIAL_ABS_PRESET_WOVEN: PolynomialAbsCoeffs = {
	...POLYNOMIAL_ABS_DEFAULTS,
	yb: -0.35,
	yc: 0.55,
	ye: 0.75,
}

export function polynomialAbsTick(
	x: number,
	y: number,
	z: number,
	c: PolynomialAbsCoeffs,
): { x: number; y: number; z: number } {
	const ax = Math.abs(x)
	const ay = Math.abs(y)
	const az = Math.abs(z)
	return {
		x: c.xa + c.xb * x + c.xc * y + c.xd * z + c.xe * ax + c.xf * ay + c.xg * az,
		y: c.ya + c.yb * x + c.yc * y + c.yd * z + c.ye * ax + c.yf * ay + c.yg * az,
		z: c.za + c.zb * x + c.zc * y + c.zd * z + c.ze * ax + c.zf * ay + c.zg * az,
	}
}

export type PolynomialMapCloud = {
	positions: Float32Array
	colors: Float32Array
	count: number
}

export type PolynomialAbsCloud = PolynomialMapCloud

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

function centerAndScale(positions: Float32Array, count: number, targetRadius: number) {
	if (count === 0) {
		return
	}
	let cx = 0
	let cy = 0
	let cz = 0
	for (let i = 0; i < count; i++) {
		const i3 = i * 3
		cx += positions[i3]
		cy += positions[i3 + 1]
		cz += positions[i3 + 2]
	}
	cx /= count
	cy /= count
	cz /= count
	let maxR = 0
	for (let i = 0; i < count; i++) {
		const i3 = i * 3
		positions[i3] -= cx
		positions[i3 + 1] -= cy
		positions[i3 + 2] -= cz
		maxR = Math.max(maxR, Math.hypot(positions[i3], positions[i3 + 1], positions[i3 + 2]))
	}
	if (maxR < 1e-9) {
		return
	}
	const s = targetRadius / maxR
	for (let i = 0; i < count * 3; i++) {
		positions[i] *= s
	}
}

function padCloud(positions: Float32Array, colors: Float32Array, keep: number, maxPoints: number) {
	if (keep <= 0) {
		return
	}
	const px = positions[0]
	const py = positions[1]
	const pz = positions[2]
	const cr = colors[0]
	const cg = colors[1]
	const cb = colors[2]
	for (let i = keep; i < maxPoints; i++) {
		const i3 = i * 3
		positions[i3] = px
		positions[i3 + 1] = py
		positions[i3 + 2] = pz
		colors[i3] = cr
		colors[i3 + 1] = cg
		colors[i3 + 2] = cb
	}
}

function sampleIteratedCloud(
	step: (x: number, y: number, z: number) => { x: number; y: number; z: number },
	maxPoints = POLYNOMIAL_MAP_MAX_POINTS,
): PolynomialMapCloud {
	const keep = maxPoints
	const positions = new Float32Array(keep * 3)
	const colors = new Float32Array(keep * 3)

	let x = 0
	let y = 0
	let z = 0
	for (let i = 0; i < WARMUP; i++) {
		const next = step(x, y, z)
		x = next.x
		y = next.y
		z = next.z
	}

	for (let i = 0; i < keep; i++) {
		const next = step(x, y, z)
		x = next.x
		y = next.y
		z = next.z
		const i3 = i * 3
		positions[i3] = x
		positions[i3 + 1] = y
		positions[i3 + 2] = z
	}

	centerAndScale(positions, keep, TARGET_R)
	for (let i = 0; i < keep; i++) {
		const i3 = i * 3
		writeRibbon(colors, i3, positions[i3], positions[i3 + 1], positions[i3 + 2])
	}
	padCloud(positions, colors, keep, maxPoints)

	return { positions, colors, count: maxPoints }
}

/** Iterate the map into a centred, ribbon-coloured particle cloud. */
export function samplePolynomialAbsCloud(c: PolynomialAbsCoeffs): PolynomialAbsCloud {
	return sampleIteratedCloud((x, y, z) => polynomialAbsTick(x, y, z, c))
}

export function polynomialTypeATick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	c: number,
): { x: number; y: number; z: number } {
	return {
		x: a + y - z * y,
		y: b + z - x * z,
		z: c + x - y * x,
	}
}

export const POLYNOMIAL_TYPE_A_DEFAULTS = {
	a: 1.586,
	b: 1.124,
	c: 0.281,
} as const

/** Dense tangled shell — slightly higher cross-coupling. */
export const POLYNOMIAL_TYPE_A_PRESET_DENSE = {
	a: 1.65,
	b: 1.1,
	c: 0.25,
} as const

/** Twin-lobed cyclic fold. */
export const POLYNOMIAL_TYPE_A_PRESET_TWIN = {
	a: 1.6,
	b: 1.1,
	c: 0.25,
} as const

export function samplePolynomialTypeACloud(a: number, b: number, c: number): PolynomialMapCloud {
	return sampleIteratedCloud((x, y, z) => polynomialTypeATick(x, y, z, a, b, c))
}

export function polynomialTypeBTick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
): { x: number; y: number; z: number } {
	return {
		x: a + y - z * (b * y),
		y: c + z - x * (d * z),
		z: e + x - y * (f * x),
	}
}

export const POLYNOMIAL_TYPE_B_DEFAULTS = {
	a: 1.6691,
	b: 1.0405,
	c: 0.2818,
	d: 0.2818,
	e: 0,
	f: 1.1055,
} as const

/** Stronger z-scale on the y leg — wider lace. */
export const POLYNOMIAL_TYPE_B_PRESET_LACE = {
	a: 1.5607,
	b: 1.0405,
	c: 0.5419,
	d: 0.2818,
	e: 1.539,
	f: 1.6257,
} as const

/** Softer b/d scales — open woven volume. */
export const POLYNOMIAL_TYPE_B_PRESET_OPEN = {
	a: 1.6,
	b: 0.9,
	c: 0.4,
	d: 0.3,
	e: 0,
	f: 1.5,
} as const

export function samplePolynomialTypeBCloud(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
): PolynomialMapCloud {
	return sampleIteratedCloud((x, y, z) => polynomialTypeBTick(x, y, z, a, b, c, d, e, f))
}

export type PolynomialTypeCCoeffs = {
	xa: number
	xb: number
	xc: number
	xd: number
	xe: number
	xf: number
	ya: number
	yb: number
	yc: number
	yd: number
	ye: number
	yf: number
	za: number
	zb: number
	zc: number
	zd: number
	ze: number
	zf: number
}

export const POLYNOMIAL_TYPE_C_COEFF_KEYS = [
	'xa',
	'xb',
	'xc',
	'xd',
	'xe',
	'xf',
	'ya',
	'yb',
	'yc',
	'yd',
	'ye',
	'yf',
	'za',
	'zb',
	'zc',
	'zd',
	'ze',
	'zf',
] as const satisfies readonly (keyof PolynomialTypeCCoeffs)[]

export const POLYNOMIAL_TYPE_C_DEFAULTS: PolynomialTypeCCoeffs = {
	xa: -0.653165,
	xb: -0.972152,
	xc: -0.713924,
	xd: -0.481,
	xe: 0.516456,
	xf: -0.592405,
	ya: -0.268,
	yb: 0.827,
	yc: 0.379747,
	yd: -0.943,
	ye: -0.072,
	yf: 1.2,
	za: -0.47,
	zb: 0.041,
	zc: 0,
	zd: 0.914,
	ze: -0.531646,
	zf: 0.364557,
}

/** Lower y-curvature — fuller shell. */
export const POLYNOMIAL_TYPE_C_PRESET_SHELL: PolynomialTypeCCoeffs = {
	...POLYNOMIAL_TYPE_C_DEFAULTS,
	yc: 0.28,
	ze: -0.582,
}

/** Milder x-leg slope — drifted quadratic folds. */
export const POLYNOMIAL_TYPE_C_PRESET_DRIFT: PolynomialTypeCCoeffs = {
	...POLYNOMIAL_TYPE_C_DEFAULTS,
	xb: -0.922,
	ze: -0.482,
}

export function polynomialTypeCTick(
	x: number,
	y: number,
	z: number,
	c: PolynomialTypeCCoeffs,
): { x: number; y: number; z: number } {
	return {
		x: c.xa + x * (c.xb + c.xc * x + c.xd * y) + y * (c.xe + c.xf * y),
		y: c.ya + y * (c.yb + c.yc * y + c.yd * z) + z * (c.ye + c.yf * z),
		z: c.za + z * (c.zb + c.zc * z + c.zd * x) + x * (c.ze + c.zf * x),
	}
}

export function samplePolynomialTypeCCloud(c: PolynomialTypeCCoeffs): PolynomialMapCloud {
	return sampleIteratedCloud((x, y, z) => polynomialTypeCTick(x, y, z, c))
}
