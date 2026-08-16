export type Point2 = { x: number; y: number }

/** Classic Gingerbreadman map: x' = 1 - y + |x|, y' = x */
export function gingerbreadManTick(x: number, y: number): Point2 {
	const nx = 1 - y + Math.abs(x)
	const ny = x
	if (!isFinite(nx) || !isFinite(ny)) {
		return { x, y }
	}
	return { x: nx, y: ny }
}

export function sampleGingerbreadMan(
	iterations: number,
	seed: Point2 = { x: -0.1, y: 0 },
): Point2[] {
	let x = seed.x
	let y = seed.y
	const out: Point2[] = []
	for (let i = 0; i < iterations; i++) {
		const next = gingerbreadManTick(x, y)
		x = next.x
		y = next.y
		out.push({ x, y })
		if (Math.abs(x) > 1e6 || Math.abs(y) > 1e6) break
	}
	return out
}
