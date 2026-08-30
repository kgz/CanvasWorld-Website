/** Improved Perlin (Ken Perlin 2002) — CPU reference for tests / defaults. */

const PERM = new Uint8Array(512)

;(() => {
	const p = new Uint8Array(256)
	for (let i = 0; i < 256; i++) {
		p[i] = i
	}
	let seed = 1619
	for (let i = 255; i > 0; i--) {
		seed = (seed * 1103515245 + 12345) >>> 0
		const j = seed % (i + 1)
		const tmp = p[i]
		p[i] = p[j]
		p[j] = tmp
	}
	for (let i = 0; i < 512; i++) {
		PERM[i] = p[i & 255]
	}
})()

function fade(t: number): number {
	return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number): number {
	return a + t * (b - a)
}

function grad(hash: number, x: number, y: number): number {
	const h = hash & 3
	const u = h < 2 ? x : y
	const v = h < 2 ? y : x
	return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

/** Classic 2D improved Perlin in roughly [−1, 1]. */
export function perlin2(x: number, y: number): number {
	const X = Math.floor(x) & 255
	const Y = Math.floor(y) & 255
	const xf = x - Math.floor(x)
	const yf = y - Math.floor(y)
	const u = fade(xf)
	const v = fade(yf)

	const aa = PERM[PERM[X] + Y]
	const ab = PERM[PERM[X] + Y + 1]
	const ba = PERM[PERM[X + 1] + Y]
	const bb = PERM[PERM[X + 1] + Y + 1]

	const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u)
	const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u)
	return lerp(x1, x2, v)
}

/** Fractal Brownian motion of `perlin2`. */
export function fbm2(x: number, y: number, octaves: number): number {
	const n = Math.max(1, Math.min(6, Math.floor(octaves)))
	let amp = 1
	let freq = 1
	let sum = 0
	let norm = 0
	for (let i = 0; i < n; i++) {
		sum += amp * perlin2(x * freq, y * freq)
		norm += amp
		amp *= 0.5
		freq *= 2
	}
	return norm > 0 ? sum / norm : 0
}

export function clampScale(v: number): number {
	return Math.min(20, Math.max(0.5, v))
}

export function clampOctaves(v: number): number {
	return Math.min(6, Math.max(1, Math.round(v)))
}

export function clampSpeed(v: number): number {
	return Math.min(2, Math.max(0, v))
}

export const PERLIN_DEFAULTS = {
	scale: 4,
	octaves: 4,
	speed: 0.25,
} as const
