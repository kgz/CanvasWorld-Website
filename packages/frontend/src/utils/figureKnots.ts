const EPS = 1e-15
const TARGET_R = 1.85
/** Arc length in t — long enough that non-integer freqs still read as a dense knot. */
const T_MAX = Math.PI * 48

/** Fixed GPU budget so a–d scrubs keep a stable buffer / transport `n`. */
export const FIGURE_KNOTS_MAX_POINTS = 60_000

export type FigureKnotCloud = {
	positions: Float32Array
	colors: Float32Array
	count: number
}

export function clampA(a: number): number {
	return Math.min(20, Math.max(0.05, a))
}

export function clampFreq(f: number): number {
	return Math.min(20, Math.max(0, f))
}

/** Archive README: x=(a+cos(b t))cos(c t), y=(a+cos(b t))sin(c t), z=sin(d t) */
export function figureKnotPoint(
	t: number,
	a: number,
	b: number,
	c: number,
	d: number,
): { x: number; y: number; z: number } {
	const tube = a + Math.cos(b * t)
	return {
		x: tube * Math.cos(c * t),
		y: tube * Math.sin(c * t),
		z: Math.sin(d * t),
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

/** Coral → amber → teal along the parameter. */
function writeArcRibbon(colors: Float32Array, i3: number, tN: number) {
	const t = Math.min(1, Math.max(0, tN))
	if (t < 0.5) {
		const s = t / 0.5
		colors[i3] = 1
		colors[i3 + 1] = 0.22 + 0.55 * s
		colors[i3 + 2] = 0.32 + 0.05 * s
		return
	}
	const s = (t - 0.5) / 0.5
	colors[i3] = 1 - 0.82 * s
	colors[i3 + 1] = 0.77 + 0.2 * s
	colors[i3 + 2] = 0.37 + 0.58 * s
}

/**
 * Dense samples along the parametric knot. Pads to FIGURE_KNOTS_MAX_POINTS.
 */
export function sampleFigureKnotCloud(
	a = 7.4,
	b = 8,
	c = 9.1,
	d = 8,
	sampleCount = FIGURE_KNOTS_MAX_POINTS,
): FigureKnotCloud {
	const aa = clampA(a)
	const bb = clampFreq(b)
	const cc = clampFreq(c)
	const dd = clampFreq(d)
	const n = Math.min(FIGURE_KNOTS_MAX_POINTS, Math.max(2, Math.floor(sampleCount)))

	const positions = new Float32Array(FIGURE_KNOTS_MAX_POINTS * 3)
	const colors = new Float32Array(FIGURE_KNOTS_MAX_POINTS * 3)

	for (let i = 0; i < n; i++) {
		const t = n <= 1 ? 0 : (T_MAX * i) / (n - 1)
		const p = figureKnotPoint(t, aa, bb, cc, dd)
		const i3 = i * 3
		positions[i3] = p.x
		positions[i3 + 1] = p.y
		positions[i3 + 2] = p.z
		writeArcRibbon(colors, i3, n <= 1 ? 0 : i / (n - 1))
	}

	centerAndScale(positions, n, TARGET_R)

	if (n > 0) {
		const px = positions[0]
		const py = positions[1]
		const pz = positions[2]
		const cr = colors[0]
		const cg = colors[1]
		const cb = colors[2]
		for (let j = n; j < FIGURE_KNOTS_MAX_POINTS; j++) {
			const j3 = j * 3
			positions[j3] = px
			positions[j3 + 1] = py
			positions[j3 + 2] = pz
			colors[j3] = cr
			colors[j3 + 1] = cg
			colors[j3 + 2] = cb
		}
	}

	return { positions, colors, count: FIGURE_KNOTS_MAX_POINTS }
}
