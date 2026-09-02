export type GumowskiMiraParams = {
	a: number
	b: number
	mu: number
}

function gumowskiMiraG(x: number, mu: number): number {
	return mu * x + (2 * (1 - mu) * x ** 2) / (1 + x ** 2)
}

export function gumowskiMiraAttractorTick(
	x: number,
	y: number,
	params: GumowskiMiraParams,
): { x: number; y: number } {
	const { a, b, mu } = params
	const xn = y + a * (1 - b * y ** 2) * y + gumowskiMiraG(x, mu)
	const yn = -x + gumowskiMiraG(xn, mu)
	return { x: xn, y: yn }
}
