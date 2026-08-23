const EPS = 1e-9
const TARGET_R = 1.75
const ETA_MIN = 0.12
const ETA_MAX = Math.PI / 2 - 0.18
const DETAIL = 280

/** Fixed GPU budget so fiber/stereo scrubs don't remount buffers. */
export const HOPF_MAX_POINTS = 60_000

export type HopfCloud = {
	positions: Float32Array
	colors: Float32Array
	/** Always HOPF_MAX_POINTS (padded). */
	count: number
}

export type HopfS3 = { x: number; y: number; z: number; w: number }
export type HopfR3 = { x: number; y: number; z: number }

export function clampFibers(n: number): number {
	return Math.min(120, Math.max(4, Math.round(n)))
}

export function clampStereo(s: number): number {
	return Math.min(1, Math.max(0.15, s))
}

/**
 * Hopf coordinates on S³ ⊂ ℝ⁴:
 * (sin η cos ξ₁, sin η sin ξ₁, cos η cos ξ₂, cos η sin ξ₂), η ∈ [0, π/2].
 */
export function hopfS3(eta: number, xi1: number, xi2: number): HopfS3 {
	const s = Math.sin(eta)
	const c = Math.cos(eta)
	return {
		x: s * Math.cos(xi1),
		y: s * Math.sin(xi1),
		z: c * Math.cos(xi2),
		w: c * Math.sin(xi2),
	}
}

/**
 * Stereographic projection S³ \ {pole} → ℝ³ from the w-pole,
 * with strength k ∈ (0,1]: denom = 1 − k w (classic stereo is k = 1).
 */
export function stereographic(p: HopfS3, stereo: number): HopfR3 {
	const k = clampStereo(stereo)
	const denom = Math.max(EPS, 1 - k * p.w)
	return {
		x: p.x / denom,
		y: p.y / denom,
		z: p.z / denom,
	}
}

/**
 * One point on the Hopf fiber over base (η, φ): ξ₁ = t, ξ₂ = t + φ.
 * Base on S² is determined by η and relative phase φ.
 */
export function hopfFiberPoint(eta: number, phi: number, t: number, stereo: number): HopfR3 {
	return stereographic(hopfS3(eta, t, t + phi), stereo)
}

/** Hopf map π: S³ → S² ⊂ ℝ³. */
export function hopfMap(p: HopfS3): HopfR3 {
	return {
		x: 2 * (p.x * p.z + p.y * p.w),
		y: 2 * (p.y * p.z - p.x * p.w),
		z: p.x * p.x + p.y * p.y - p.z * p.z - p.w * p.w,
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

/** Coral → amber → teal by base (η, φ). */
function writeBaseRibbon(colors: Float32Array, i: number, etaN: number, phiN: number) {
	const t = Math.min(1, Math.max(0, 0.55 * etaN + 0.45 * phiN))
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
 * Sample Hopf fibers as a particle wire. Pads to HOPF_MAX_POINTS.
 * Fibers are spread on a latitude×longitude grid in (η, φ).
 */
export function sampleHopfCloud(
	fiberCount = 48,
	stereo = 0.85,
	detail = DETAIL,
): HopfCloud {
	const fibers = clampFibers(fiberCount)
	const k = clampStereo(stereo)
	const samples = Math.max(2, Math.floor(detail))
	const rawCount = Math.min(fibers * samples, HOPF_MAX_POINTS)

	const positions = new Float32Array(HOPF_MAX_POINTS * 3)
	const colors = new Float32Array(HOPF_MAX_POINTS * 3)

	const nEta = Math.max(1, Math.round(Math.sqrt(fibers)))
	const nPhi = Math.max(1, Math.ceil(fibers / nEta))
	let written = 0

	for (let ie = 0; ie < nEta && written < rawCount; ie++) {
		const eta = ETA_MIN + ((ETA_MAX - ETA_MIN) * (ie + 0.5)) / nEta
		const etaN = (eta - ETA_MIN) / (ETA_MAX - ETA_MIN)
		for (let ip = 0; ip < nPhi && written < rawCount; ip++) {
			if (ie * nPhi + ip >= fibers) {
				break
			}
			const phi = (Math.PI * 2 * (ip + 0.5)) / nPhi
			const phiN = phi / (Math.PI * 2)
			for (let s = 0; s < samples && written < rawCount; s++) {
				const t = samples <= 1 ? 0 : (Math.PI * 2 * s) / (samples - 1)
				const p = hopfFiberPoint(eta, phi, t, k)
				const i3 = written * 3
				positions[i3] = p.x
				positions[i3 + 1] = p.y
				positions[i3 + 2] = p.z
				writeBaseRibbon(colors, i3, etaN, phiN)
				written += 1
			}
		}
	}

	centerAndScale(positions, written, TARGET_R)

	if (written > 0) {
		const px = positions[0]
		const py = positions[1]
		const pz = positions[2]
		const cr = colors[0]
		const cg = colors[1]
		const cb = colors[2]
		for (let j = written; j < HOPF_MAX_POINTS; j++) {
			const j3 = j * 3
			positions[j3] = px
			positions[j3 + 1] = py
			positions[j3 + 2] = pz
			colors[j3] = cr
			colors[j3 + 1] = cg
			colors[j3 + 2] = cb
		}
	}

	return { positions, colors, count: HOPF_MAX_POINTS }
}
