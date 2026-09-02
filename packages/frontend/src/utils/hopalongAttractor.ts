export type HopalongParams = {
	a: number
	b: number
	c: number
}

function hopalongNextY(a: number, x: number): number {
	return a - x
}

export function hopalongAttractorTick(
	x: number,
	y: number,
	params: HopalongParams,
): { x: number; y: number } {
	const { a, b, c } = params
	return {
		x: y - Math.sign(x) * Math.sqrt(Math.abs(b * x - c)),
		y: hopalongNextY(a, x),
	}
}

export function hopalongPositiveAttractorTick(
	x: number,
	y: number,
	params: HopalongParams,
): { x: number; y: number } {
	const { a, b, c } = params
	return {
		x: y + Math.sign(x) * Math.sqrt(Math.abs(b * x - c)),
		y: hopalongNextY(a, x),
	}
}

export function hopalongAdditiveAttractorTick(
	x: number,
	y: number,
	params: HopalongParams,
): { x: number; y: number } {
	const { a, b, c } = params
	return {
		x: y + Math.sqrt(Math.abs(b * x - c)),
		y: hopalongNextY(a, x),
	}
}

export function hopalongSinusoidalAttractorTick(
	x: number,
	y: number,
	params: HopalongParams,
): { x: number; y: number } {
	const { a, b, c } = params
	return {
		x: y + Math.sin(b * x - c),
		y: hopalongNextY(a, x),
	}
}
