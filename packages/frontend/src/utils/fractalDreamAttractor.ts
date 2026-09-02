export type FractalDreamParams = {
	a: number
	b: number
	c: number
	d: number
}

export function fractalDreamAttractorTick(
	x: number,
	y: number,
	params: FractalDreamParams,
): { x: number; y: number } {
	const { a, b, c, d } = params
	return {
		x: Math.sin(b * y) + c * Math.sin(b * x),
		y: Math.sin(a * x) + d * Math.sin(a * y),
	}
}
