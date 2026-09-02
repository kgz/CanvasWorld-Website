export type CliffordParams = {
	a: number
	b: number
	c: number
	d: number
}

export function cliffordAttractorTick(
	x: number,
	y: number,
	params: CliffordParams,
): { x: number; y: number } {
	const { a, b, c, d } = params
	return {
		x: Math.sin(a * y) + c * Math.cos(a * x),
		y: Math.sin(b * x) + d * Math.cos(b * y),
	}
}
