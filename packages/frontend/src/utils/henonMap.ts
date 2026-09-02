export type HenonParams = {
	a: number
	b: number
}

export function henonMapTick(x: number, y: number, params: HenonParams): { x: number; y: number } {
	const { a, b } = params
	return {
		x: 1 - a * x * x + y,
		y: b * x,
	}
}
