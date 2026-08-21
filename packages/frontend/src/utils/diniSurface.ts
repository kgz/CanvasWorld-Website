const EPS = 1e-15
const TAN_EPS = 1e-6
const TURNS = 3
const U_MAX = Math.PI * 2 * TURNS
const V_MIN = 0.15
const V_MAX = 1
const TARGET_R = 1.7

/** Fixed GPU budget so param scrubs don't remount buffers / reset `n`. */
export const DINI_MAX_POINTS = 55_000
/** Constant-v spirals (helicoid turns). */
const N_V_RINGS = 64
/** Constant-u profiles (tractrix meridians). */
const N_U_RAYS = 80
/** Samples per isoline — dense enough to read the spiral. */
const DETAIL = 320

export type DiniCloud = {
	positions: Float32Array
	colors: Float32Array
	/** Always DINI_MAX_POINTS (padded). */
	count: number
}

export function clampRadius(a: number): number {
	return Math.min(3, Math.max(0.15, a))
}

export function clampTwist(b: number): number {
	return Math.min(1.2, Math.max(0, b))
}

/** Classic Dini: x=a cos(u) sin(v), y=a sin(u) sin(v), z=a(cos(v)+ln tan(v/2))+b u */
export function diniPoint(u: number, v: number, a: number, b: number): { x: number; y: number; z: number } {
	const t = Math.tan(v / 2)
	const guarded = t > TAN_EPS && Number.isFinite(t) ? t : TAN_EPS
	const sv = Math.sin(v)
	return {
		x: a * Math.cos(u) * sv,
		y: a * Math.sin(u) * sv,
		z: a * (Math.cos(v) + Math.log(guarded)) + b * u,
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
	const end = count * 3
	for (let i = 0; i < end; i++) {
		positions[i] *= s
	}
}

/** Coral → amber → teal by UV (same ribbon as Boy). */
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
 * UV isoline particle wire: constant-v spirals + constant-u meridians.
 * Pads to DINI_MAX_POINTS so a/b scrubbing keeps a stable buffer.
 */
export function sampleDiniCloud(
	a = 1,
	b = 0.2,
	nVRings = N_V_RINGS,
	nURays = N_U_RAYS,
	detail = DETAIL,
): DiniCloud {
	const radius = clampRadius(a)
	const twist = clampTwist(b)
	const rings = Math.max(1, Math.floor(nVRings))
	const rays = Math.max(1, Math.floor(nURays))
	const samples = Math.max(2, Math.floor(detail))
	const rawCount = Math.min((rings + rays) * samples, DINI_MAX_POINTS)

	const positions = new Float32Array(DINI_MAX_POINTS * 3)
	const colors = new Float32Array(DINI_MAX_POINTS * 3)
	let i = 0

	const push = (u: number, v: number) => {
		if (i >= rawCount) {
			return
		}
		const p = diniPoint(u, v, radius, twist)
		const i3 = i * 3
		positions[i3] = p.x
		positions[i3 + 1] = p.y
		positions[i3 + 2] = p.z
		const uN = U_MAX > EPS ? u / U_MAX : 0
		const vN = (v - V_MIN) / (V_MAX - V_MIN)
		writeUvRibbon(colors, i3, uN, vN)
		i += 1
	}

	const ringBudget = Math.min(rings * samples, rawCount)
	for (let ir = 0; ir < rings && i < ringBudget; ir++) {
		const v = V_MIN + ((V_MAX - V_MIN) * (ir + 0.5)) / rings
		for (let s = 0; s < samples && i < ringBudget; s++) {
			const u = samples <= 1 ? 0 : (U_MAX * s) / (samples - 1)
			push(u, v)
		}
	}

	for (let iu = 0; iu < rays && i < rawCount; iu++) {
		const u = (U_MAX * (iu + 0.5)) / rays
		for (let s = 0; s < samples && i < rawCount; s++) {
			const v = samples <= 1 ? V_MIN : V_MIN + ((V_MAX - V_MIN) * s) / (samples - 1)
			push(u, v)
		}
	}

	const written = i
	centerAndScale(positions, written, TARGET_R)

	if (written > 0) {
		const px = positions[0]
		const py = positions[1]
		const pz = positions[2]
		const cr = colors[0]
		const cg = colors[1]
		const cb = colors[2]
		for (let j = written; j < DINI_MAX_POINTS; j++) {
			const j3 = j * 3
			positions[j3] = px
			positions[j3 + 1] = py
			positions[j3 + 2] = pz
			colors[j3] = cr
			colors[j3 + 1] = cg
			colors[j3 + 2] = cb
		}
	}

	return { positions, colors, count: DINI_MAX_POINTS }
}
