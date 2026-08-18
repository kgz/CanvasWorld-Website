export type Vec3 = readonly [number, number, number]

export type IsoMesh = {
	positions: Float32Array
	indices: Uint32Array
}

const CUBE_CORNERS: readonly Vec3[] = [
	[0, 0, 0],
	[1, 0, 0],
	[1, 1, 0],
	[0, 1, 0],
	[0, 0, 1],
	[1, 0, 1],
	[1, 1, 1],
	[0, 1, 1],
]

/** Six tets sharing cube diagonal (0–6). */
const TETS: readonly (readonly [number, number, number, number])[] = [
	[0, 1, 2, 6],
	[0, 2, 3, 6],
	[0, 1, 5, 6],
	[0, 4, 5, 6],
	[0, 3, 7, 6],
	[0, 4, 7, 6],
]

function interp(p: Vec3, q: Vec3, vp: number, vq: number): Vec3 {
	const den = vp - vq
	const t = Math.abs(den) < 1e-12 ? 0.5 : vp / den
	const u = Math.min(1, Math.max(0, t))
	return [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, p[2] + (q[2] - p[2]) * u]
}

function vertKey(p: Vec3): string {
	return `${Math.round(p[0] * 1e5)}:${Math.round(p[1] * 1e5)}:${Math.round(p[2] * 1e5)}`
}

/**
 * Polygonise a regular scalar grid (row-major x, then y, then z).
 * Values are field − isolevel; the surface is the zero set.
 */
export function polygoniseGrid(
	values: Float32Array,
	nx: number,
	ny: number,
	nz: number,
	origin: Vec3,
	cell: Vec3,
): IsoMesh {
	const positions: number[] = []
	const indices: number[] = []
	const weld = new Map<string, number>()

	const at = (i: number, j: number, k: number): number => values[i + nx * (j + ny * k)]

	const cornerPos = (i: number, j: number, k: number, c: Vec3): Vec3 => [
		origin[0] + (i + c[0]) * cell[0],
		origin[1] + (j + c[1]) * cell[1],
		origin[2] + (k + c[2]) * cell[2],
	]

	const pushVert = (p: Vec3): number => {
		const key = vertKey(p)
		const existing = weld.get(key)
		if (existing !== undefined) {
			return existing
		}
		const id = positions.length / 3
		positions.push(p[0], p[1], p[2])
		weld.set(key, id)
		return id
	}

	const pushTri = (a: Vec3, b: Vec3, c: Vec3) => {
		indices.push(pushVert(a), pushVert(b), pushVert(c))
	}

	const emitTet = (pts: readonly Vec3[], v: readonly number[]) => {
		let npos = 0
		for (let i = 0; i < 4; i++) {
			if (v[i] >= 0) {
				npos++
			}
		}
		if (npos === 0 || npos === 4) {
			return
		}

		const edge = (i: number, j: number): Vec3 => interp(pts[i], pts[j], v[i], v[j])

		if (npos === 1 || npos === 3) {
			const wantPos = npos === 1
			let lonely = 0
			for (let i = 0; i < 4; i++) {
				if ((v[i] >= 0) === wantPos) {
					lonely = i
					break
				}
			}
			const o: number[] = []
			for (let i = 0; i < 4; i++) {
				if (i !== lonely) {
					o.push(i)
				}
			}
			pushTri(edge(lonely, o[0]), edge(lonely, o[1]), edge(lonely, o[2]))
			return
		}

		const pos: number[] = []
		const neg: number[] = []
		for (let i = 0; i < 4; i++) {
			if (v[i] >= 0) {
				pos.push(i)
			} else {
				neg.push(i)
			}
		}
		const a = edge(pos[0], neg[0])
		const b = edge(pos[0], neg[1])
		const c = edge(pos[1], neg[1])
		const d = edge(pos[1], neg[0])
		pushTri(a, b, c)
		pushTri(a, c, d)
	}

	for (let k = 0; k < nz - 1; k++) {
		for (let j = 0; j < ny - 1; j++) {
			for (let i = 0; i < nx - 1; i++) {
				const p: Vec3[] = []
				const val: number[] = []
				for (let c = 0; c < 8; c++) {
					const corner = CUBE_CORNERS[c]
					p.push(cornerPos(i, j, k, corner))
					val.push(at(i + corner[0], j + corner[1], k + corner[2]))
				}
				for (let t = 0; t < TETS.length; t++) {
					const tet = TETS[t]
					emitTet(
						[p[tet[0]], p[tet[1]], p[tet[2]], p[tet[3]]],
						[val[tet[0]], val[tet[1]], val[tet[2]], val[tet[3]]],
					)
				}
			}
		}
	}

	return {
		positions: new Float32Array(positions),
		indices: new Uint32Array(indices),
	}
}
