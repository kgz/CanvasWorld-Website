const EPS = 1e-15
const TARGET_R = 1.7

export const SPAN_MIN = 1.2
export const SPAN_MAX = 2.5
export const DEFAULT_SPAN = 1.8

/** Fixed isoline budget (u-curves + v-curves). */
export const ENNEPER_NU = 48
export const ENNEPER_NV = 48
export const ENNEPER_DETAIL = 200
export const ENNEPER_MAX_POINTS = (ENNEPER_NU + ENNEPER_NV) * ENNEPER_DETAIL

export function clampSpan(span: number): number {
	return Math.min(SPAN_MAX, Math.max(SPAN_MIN, span))
}

/** Classical Enneper polynomial: x = u − u³/3 + u v², y = v − v³/3 + v u², z = u² − v². */
export function enneperPoint(u: number, v: number): { x: number; y: number; z: number } {
	const u2 = u * u
	const v2 = v * v
	return {
		x: u - (u2 * u) / 3 + u * v2,
		y: v - (v2 * v) / 3 + v * u2,
		z: u2 - v2,
	}
}

export type EnneperCloud = {
	positions: Float32Array
	colors: Float32Array
	count: number
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

/** Constant-u / constant-v isolines on the Enneper domain. */
export function sampleEnneperIsolines(
	nu = ENNEPER_NU,
	nv = ENNEPER_NV,
	samples = ENNEPER_DETAIL,
	span = DEFAULT_SPAN,
): EnneperCloud {
	const s = clampSpan(span)
	const count = (nu + nv) * samples
	const positions = new Float32Array(count * 3)
	const colors = new Float32Array(count * 3)
	let i = 0

	for (let iu = 0; iu < nu; iu++) {
		const uN = nu <= 1 ? 0.5 : iu / (nu - 1)
		const u = -s + 2 * s * uN
		for (let t = 0; t < samples; t++) {
			const vN = samples <= 1 ? 0.5 : t / (samples - 1)
			const v = -s + 2 * s * vN
			const p = enneperPoint(u, v)
			const i3 = i * 3
			positions[i3] = p.x
			positions[i3 + 1] = p.y
			positions[i3 + 2] = p.z
			writeUvRibbon(colors, i3, uN, vN)
			i += 1
		}
	}
	for (let iv = 0; iv < nv; iv++) {
		const vN = nv <= 1 ? 0.5 : iv / (nv - 1)
		const v = -s + 2 * s * vN
		for (let t = 0; t < samples; t++) {
			const uN = samples <= 1 ? 0.5 : t / (samples - 1)
			const u = -s + 2 * s * uN
			const p = enneperPoint(u, v)
			const i3 = i * 3
			positions[i3] = p.x
			positions[i3 + 1] = p.y
			positions[i3 + 2] = p.z
			writeUvRibbon(colors, i3, uN, vN)
			i += 1
		}
	}

	centerAndScale(positions, count, TARGET_R)
	return { positions, colors, count }
}
