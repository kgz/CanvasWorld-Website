export function bogdanovMapTick(
	x: number,
	y: number,
	a: number,
	b: number,
	mu: number,
): { x: number; y: number } {
	const ny = y + a * y + b * x * (x - 1) + mu * x * y
	const nx = x + ny
	return { x: nx, y: ny }
}
