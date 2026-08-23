/** Halvorsen ODE Euler step (classic cyclic form; demos use dt≈0.01). */
export function halvorsenTick(
	x: number,
	y: number,
	z: number,
	a: number,
	dt: number,
): { x: number; y: number; z: number } {
	const dx = -a * x - 4 * y - 4 * z - y * y
	const dy = -a * y - 4 * z - 4 * x - z * z
	const dz = -a * z - 4 * x - 4 * y - x * x
	return {
		x: x + dt * dx,
		y: y + dt * dy,
		z: z + dt * dz,
	}
}
