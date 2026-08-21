const EPS = 1e-15
const TARGET_R = 1.7
const SQUASH_MIN = 0.25
const SQUASH_MAX = 2.5

export type RomanPoint = {
	x: number
	y: number
	z: number
}

export type RomanCloud = {
	positions: Float32Array
	colors: Float32Array
	count: number
}

/** Steiner Roman surface. u,v ∈ [0, π]. a scales before normalize. */
export function romanPoint(u: number, v: number, a = 1): RomanPoint {
	const aa = a * a
	const cu = Math.cos(u)
	const su = Math.sin(u)
	const cv = Math.cos(v)
	const sv = Math.sin(v)
	return {
		x: aa * cu * su * sv,
		y: aa * cu * su * cv,
		z: aa * cu * cu * cv * sv,
	}
}

export function clampSquash(s: number): number {
	return Math.min(SQUASH_MAX, Math.max(SQUASH_MIN, s))
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

/** Coral → amber → teal along UV. */
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
 * UV isoline wire of Steiner’s Roman surface.
 * squash: z-axis stretch before normalize (1 = classic proportions).
 */
export function sampleRomanIsolines(
	nU = 48,
	nV = 48,
	samples = 240,
	squash = 1,
): RomanCloud {
	const sq = clampSquash(squash)
	const count = (nU + nV) * samples
	const positions = new Float32Array(count * 3)
	const colors = new Float32Array(count * 3)
	let i = 0

	const push = (u: number, v: number) => {
		const p = romanPoint(u, v)
		const i3 = i * 3
		positions[i3] = p.x
		positions[i3 + 1] = p.y
		positions[i3 + 2] = p.z * sq
		writeUvRibbon(colors, i3, u / Math.PI, v / Math.PI)
		i += 1
	}

	for (let iu = 0; iu < nU; iu++) {
		const u = (Math.PI * (iu + 0.5)) / nU
		for (let s = 0; s < samples; s++) {
			const v = samples <= 1 ? 0 : (Math.PI * s) / (samples - 1)
			push(u, v)
		}
	}
	for (let iv = 0; iv < nV; iv++) {
		const v = (Math.PI * (iv + 0.5)) / nV
		for (let s = 0; s < samples; s++) {
			const u = samples <= 1 ? 0 : (Math.PI * s) / (samples - 1)
			push(u, v)
		}
	}

	centerAndScale(positions, TARGET_R)
	return { positions, colors, count }
}
