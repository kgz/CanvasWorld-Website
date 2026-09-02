export type PeterDeJongParams = {
	a: number
	b: number
	c: number
	d: number
}

export function peterDeJongAttractorTick(
	x: number,
	y: number,
	params: PeterDeJongParams,
): { x: number; y: number } {
	const { a, b, c, d } = params
	return {
		x: Math.sin(a * y) - Math.cos(b * x),
		y: Math.sin(c * x) - Math.cos(d * y),
	}
}
