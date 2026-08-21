export type Complex = {
	re: number
	im: number
}

/** Fixed GPU budget so degree/proj scrubs don't remount buffers / reset transport `n`. */
export const CALABI_MAX_POINTS = 30_000
/** Baked grid per patch — interactive remesh stays cheap. */
const GRID_RES = 20
const TARGET_R = 1.65
const EPS = 1e-15
const DOMAIN_PAD = 1e-4

export type CalabiYauCloud = {
	positions: Float32Array
	colors: Float32Array
	/** Always CALABI_MAX_POINTS (padded). */
	count: number
}

export function cadd(a: Complex, b: Complex): Complex {
	return { re: a.re + b.re, im: a.im + b.im }
}

export function cmul(a: Complex, b: Complex): Complex {
	return {
		re: a.re * b.re - a.im * b.im,
		im: a.re * b.im + a.im * b.re,
	}
}

export function cexpI(theta: number): Complex {
	return { re: Math.cos(theta), im: Math.sin(theta) }
}

export function cpow(z: Complex, p: number): Complex {
	const r = Math.hypot(z.re, z.im)
	if (r < EPS) {
		return { re: 0, im: 0 }
	}
	const arg = Math.atan2(z.im, z.re)
	const rp = r ** p
	const a = arg * p
	return { re: rp * Math.cos(a), im: rp * Math.sin(a) }
}

/** cos(x + iy) = cos(x)cosh(y) − i sin(x)sinh(y) */
export function ccos(x: number, y: number): Complex {
	return {
		re: Math.cos(x) * Math.cosh(y),
		im: -Math.sin(x) * Math.sinh(y),
	}
}

/** sin(x + iy) = sin(x)cosh(y) + i cos(x)sinh(y) */
export function csin(x: number, y: number): Complex {
	return {
		re: Math.sin(x) * Math.cosh(y),
		im: Math.cos(x) * Math.sinh(y),
	}
}

export function clampDegree(n: number): number {
	return Math.min(8, Math.max(2, Math.round(n)))
}

export function clampRes(res: number): number {
	return Math.min(36, Math.max(6, Math.round(res)))
}

export function clampProj(proj: number): number {
	return Math.min(Math.PI, Math.max(0, proj))
}

export function fermatPair(
	x: number,
	y: number,
	n: number,
	k1: number,
	k2: number,
): { z1: Complex; z2: Complex } {
	const p = 2 / n
	const z1 = cmul(cexpI((2 * Math.PI * k1) / n), cpow(ccos(x, y), p))
	const z2 = cmul(cexpI((2 * Math.PI * k2) / n), cpow(csin(x, y), p))
	return { z1, z2 }
}

export function projectCalabiYau(
	z1: Complex,
	z2: Complex,
	proj: number,
): { x: number; y: number; z: number } {
	return {
		x: z1.re,
		y: z2.re,
		z: Math.cos(proj) * z1.im + Math.sin(proj) * z2.im,
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

/** Hanson-slice samples as a particle cloud (no lit triangles). */
export function sampleCalabiYauCloud(n: number, proj: number): CalabiYauCloud {
	const degree = clampDegree(n)
	const a = clampProj(proj)
	const grid = GRID_RES
	const vertsPerSide = grid + 1
	const patchCount = degree * degree
	const vertsPerPatch = vertsPerSide * vertsPerSide
	const rawTotal = patchCount * vertsPerPatch

	const scratch = new Float32Array(rawTotal * 3)
	const x0 = DOMAIN_PAD
	const x1 = Math.PI / 2 - DOMAIN_PAD
	const y0 = -Math.PI / 2 + DOMAIN_PAD
	const y1 = Math.PI / 2 - DOMAIN_PAD

	let vi = 0
	for (let k1 = 0; k1 < degree; k1++) {
		for (let k2 = 0; k2 < degree; k2++) {
			for (let iy = 0; iy < vertsPerSide; iy++) {
				const y = y0 + ((y1 - y0) * iy) / grid
				for (let ix = 0; ix < vertsPerSide; ix++) {
					const x = x0 + ((x1 - x0) * ix) / grid
					const { z1, z2 } = fermatPair(x, y, degree, k1, k2)
					const p = projectCalabiYau(z1, z2, a)
					scratch[vi * 3] = p.x
					scratch[vi * 3 + 1] = p.y
					scratch[vi * 3 + 2] = p.z
					vi++
				}
			}
		}
	}

	centerAndScale(scratch, rawTotal, TARGET_R)

	const positions = new Float32Array(CALABI_MAX_POINTS * 3)
	const colors = new Float32Array(CALABI_MAX_POINTS * 3)
	const raw = Math.min(rawTotal, CALABI_MAX_POINTS)
	for (let i = 0; i < raw; i++) {
		const i3 = i * 3
		positions[i3] = scratch[i3]
		positions[i3 + 1] = scratch[i3 + 1]
		positions[i3 + 2] = scratch[i3 + 2]
		writeRibbon(colors, i3, positions[i3], positions[i3 + 1], positions[i3 + 2])
	}
	if (raw > 0) {
		const px = positions[0]
		const py = positions[1]
		const pz = positions[2]
		const cr = colors[0]
		const cg = colors[1]
		const cb = colors[2]
		for (let i = raw; i < CALABI_MAX_POINTS; i++) {
			const i3 = i * 3
			positions[i3] = px
			positions[i3 + 1] = py
			positions[i3 + 2] = pz
			colors[i3] = cr
			colors[i3 + 1] = cg
			colors[i3 + 2] = cb
		}
	}
	return { positions, colors, count: CALABI_MAX_POINTS }
}
