export type BrusselatorPoint = { x: number; y: number }

/** Continuous Brusselator ODE, one Euler step. */
export function brusselatorTick(
	x: number,
	y: number,
	a: number,
	b: number,
	dt: number,
): BrusselatorPoint {
	const safeDt = Math.max(Math.min(dt, 0.2), 1e-6)
	const dx = a - (b + 1) * x + x * x * y
	const dy = b * x - x * x * y
	let nx = x + dx * safeDt
	let ny = y + dy * safeDt

	if (!isFinite(nx) || !isFinite(ny)) {
		return { x, y }
	}

	const limit = 100
	if (Math.abs(nx) > limit) nx = Math.sign(nx) * limit
	if (Math.abs(ny) > limit) ny = Math.sign(ny) * limit

	return { x: nx, y: ny }
}

export function sampleBrusselator(
	a: number,
	b: number,
	dt: number,
	iterations: number,
	seed: BrusselatorPoint = { x: 1, y: 1 },
): BrusselatorPoint[] {
	let x = seed.x
	let y = seed.y
	const out: BrusselatorPoint[] = []

	for (let i = 0; i < iterations; i++) {
		const next = brusselatorTick(x, y, a, b, dt)
		x = next.x
		y = next.y
		out.push({ x, y })
		if (Math.abs(x) >= 100 || Math.abs(y) >= 100) break
	}

	return out
}
