export type Point2 = { x: number; y: number }

const BASE: readonly Point2[] = [
	{ x: 0, y: 0 },
	{ x: 0, y: 1 },
	{ x: 1, y: 1 },
	{ x: 1, y: 0 },
]

export function last2bits(x: number): number {
	return x & 3
}

/** Grid size for Hilbert order k (k ≥ 1). */
export function hilbertGridSize(order: number): number {
	return 2 ** order
}

/** Number of cells / points for order k. */
export function hilbertPointCount(order: number): number {
	const n = hilbertGridSize(order)
	return n * n
}

/**
 * Map Hilbert index → grid cell on an N×N board (N power of 2).
 * Port of CanvasWorld_archive `(2d) Hilbert Curve` `hindex2xy`.
 */
export function hindex2xy(hindex: number, n: number): Point2 {
	const base = BASE[last2bits(hindex)]
	let h = hindex >>> 2
	let x = base.x
	let y = base.y

	for (let size = 4; size <= n; size *= 2) {
		const half = size / 2
		switch (last2bits(h)) {
			case 0: {
				const tmp = x
				x = y
				y = tmp
				break
			}
			case 1: {
				y = y + half
				break
			}
			case 2: {
				x = x + half
				y = y + half
				break
			}
			case 3: {
				const tmp = y
				y = half - 1 - x
				x = half - 1 - tmp
				x = x + half
				break
			}
			default:
				break
		}
		h = h >>> 2
	}

	return { x, y }
}

/** Centered world coords so the N×N curve frames near the origin. */
export function hilbertWorldPoint(hindex: number, n: number, cellSize: number): Point2 {
	const { x, y } = hindex2xy(hindex, n)
	const mid = (n - 1) / 2
	return {
		x: (x - mid) * cellSize,
		y: (y - mid) * cellSize,
	}
}
