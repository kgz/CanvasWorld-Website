export type SvenssonParams = {
	a: number
	b: number
	c: number
	d: number
}

export function svenssonAttractorTick(
	x: number,
	y: number,
	params: SvenssonParams,
): { x: number; y: number } {
	const { a, b, c, d } = params
	return {
		x: d * Math.sin(a * x) - Math.sin(b * y),
		y: c * Math.cos(a * x) + Math.cos(b * y),
	}
}
