export function ikedaMapTick(
	x: number,
	y: number,
	a: number,
): { x: number; y: number } {
	const g = 0.4 - 6 / (1 + x ** 2 + y ** 2)
	return {
		x: 1 + a * (x * Math.cos(g) - y * Math.sin(g)),
		y: a * (x * Math.sin(g) + y * Math.cos(g)),
	}
}
