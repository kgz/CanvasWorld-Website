export type Complex = {
	re: number
	im: number
}

const EPS = 1e-15
const DOMAIN_PAD = 1e-4

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

export type CalabiYauMesh = {
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
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

export function buildCalabiYauMesh(n: number, proj: number, res: number): CalabiYauMesh {
	const degree = clampDegree(n)
	const grid = clampRes(res)
	const vertsPerSide = grid + 1
	const patchCount = degree * degree
	const vertsPerPatch = vertsPerSide * vertsPerSide
	const positions = new Float32Array(patchCount * vertsPerPatch * 3)
	const colors = new Float32Array(patchCount * vertsPerPatch * 3)
	const indices = new Uint32Array(patchCount * grid * grid * 6)

	const x0 = DOMAIN_PAD
	const x1 = Math.PI / 2 - DOMAIN_PAD
	const y0 = -Math.PI / 2 + DOMAIN_PAD
	const y1 = Math.PI / 2 - DOMAIN_PAD

	let patch = 0
	for (let k1 = 0; k1 < degree; k1++) {
		const t1 = degree <= 1 ? 0 : k1 / (degree - 1)
		for (let k2 = 0; k2 < degree; k2++) {
			const t2 = degree <= 1 ? 0 : k2 / (degree - 1)
			const cr = 0.28 + 0.72 * t1
			const cg = 0.1 + 0.58 * t2
			const cb = 0.48 + 0.42 * (1 - t1)
			const base = patch * vertsPerPatch

			for (let iy = 0; iy < vertsPerSide; iy++) {
				const y = y0 + ((y1 - y0) * iy) / grid
				for (let ix = 0; ix < vertsPerSide; ix++) {
					const x = x0 + ((x1 - x0) * ix) / grid
					const { z1, z2 } = fermatPair(x, y, degree, k1, k2)
					const p = projectCalabiYau(z1, z2, proj)
					const vi = base + iy * vertsPerSide + ix
					positions[vi * 3] = p.x
					positions[vi * 3 + 1] = p.y
					positions[vi * 3 + 2] = p.z
					colors[vi * 3] = cr
					colors[vi * 3 + 1] = cg
					colors[vi * 3 + 2] = cb
				}
			}

			const ibase = patch * grid * grid * 6
			let t = 0
			for (let iy = 0; iy < grid; iy++) {
				for (let ix = 0; ix < grid; ix++) {
					const a = base + iy * vertsPerSide + ix
					const b = a + 1
					const c = a + vertsPerSide
					const d = c + 1
					indices[ibase + t] = a
					indices[ibase + t + 1] = c
					indices[ibase + t + 2] = b
					indices[ibase + t + 3] = b
					indices[ibase + t + 4] = c
					indices[ibase + t + 5] = d
					t += 6
				}
			}
			patch++
		}
	}

	centerAndScale(positions, 1.65)
	return { positions, indices, colors }
}
