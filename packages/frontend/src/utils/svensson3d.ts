/** Modified 3D Svensson discrete map — sine/cosine pair plus a z leg from x,y. */

export const SVENSSON_3D_MAX_POINTS = 120_000
const TARGET_R = 1.85
const WARMUP = 256

export const SVENSSON_3D_DEFAULTS = {
	a: -3,
	b: 3,
	c: 3,
	d: 3,
	e: 3,
} as const

/** Softer trig scaling — wider ribbon folds. */
export const SVENSSON_3D_PRESET_SOFT = {
	a: -2.2,
	b: 2.6,
	c: 1.8,
	d: 2.4,
	e: 2.1,
} as const

/** Mixed-sign preset — tighter braided volume. */
export const SVENSSON_3D_PRESET_BRAID = {
	a: 1.4,
	b: -1.9,
	c: 2.5,
	d: -2.1,
	e: 1.7,
} as const

export function svensson3dTick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
): { x: number; y: number; z: number } {
	return {
		x: d * Math.sin(a * x) - Math.sin(b * y),
		y: c * Math.cos(a * x) + Math.cos(b * y),
		z: e * Math.sin(a * x) + Math.sin(b * y),
	}
}

export type Svensson3dCloud = {
	positions: Float32Array
	colors: Float32Array
	count: number
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

export function sampleSvensson3dCloud(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
): Svensson3dCloud {
	const keep = SVENSSON_3D_MAX_POINTS
	const positions = new Float32Array(keep * 3)
	const colors = new Float32Array(keep * 3)

	let x = 0
	let y = 0
	let z = 0
	for (let i = 0; i < WARMUP; i++) {
		const next = svensson3dTick(x, y, z, a, b, c, d, e)
		x = next.x
		y = next.y
		z = next.z
	}

	for (let i = 0; i < keep; i++) {
		const next = svensson3dTick(x, y, z, a, b, c, d, e)
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
	padCloud(positions, colors, keep, SVENSSON_3D_MAX_POINTS)

	return { positions, colors, count: SVENSSON_3D_MAX_POINTS }
}
