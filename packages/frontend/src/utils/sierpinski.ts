export type Vec2 = readonly [number, number]

export const mid = (a: Vec2, b: Vec2): Vec2 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

const sign = (p: Vec2, a: Vec2, b: Vec2): number =>
	(p[0] - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (p[1] - b[1])

export const pointInTriangle = (p: Vec2, a: Vec2, b: Vec2, c: Vec2): boolean => {
	const d1 = sign(p, a, b)
	const d2 = sign(p, b, c)
	const d3 = sign(p, c, a)
	const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
	const hasPos = d1 > 0 || d2 > 0 || d3 > 0
	return !(hasNeg && hasPos)
}

/** Recursive Sierpiński membership: remove middle triangle at each depth. */
export const sierpinskiMember = (p: Vec2, a: Vec2, b: Vec2, c: Vec2, depth: number): boolean => {
	if (!pointInTriangle(p, a, b, c)) return false
	if (depth <= 0) return true
	const mab = mid(a, b)
	const mbc = mid(b, c)
	const mca = mid(c, a)
	if (pointInTriangle(p, mab, mbc, mca)) return false
	return (
		sierpinskiMember(p, a, mab, mca, depth - 1) ||
		sierpinskiMember(p, mab, b, mbc, depth - 1) ||
		sierpinskiMember(p, mca, mbc, c, depth - 1)
	)
}

export const equilateralVertices = (scale: number): [Vec2, Vec2, Vec2] => {
	const s = scale * 0.95
	return [
		[0, s],
		[(-s * Math.sqrt(3)) / 2, -s / 2],
		[(s * Math.sqrt(3)) / 2, -s / 2],
	]
}
