/** Classic Lorenz ODE step. a=σ, b=ρ, c=β. */
export function lorenzTick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	c: number,
	dt: number,
): { x: number; y: number; z: number } {
	const dx = a * (y - x)
	const dy = x * (b - z) - y
	const dz = x * y - c * z
	return {
		x: x + dx * dt,
		y: y + dy * dt,
		z: z + dz * dt,
	}
}
