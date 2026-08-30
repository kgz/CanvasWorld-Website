/** Halvorsen ODE Euler step (Sprott cyclic form; dt≈0.005 for a≈1.4 at ~18k samples). */
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
