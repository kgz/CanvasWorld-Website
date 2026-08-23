/** Thomas cyclically symmetric attractor — Euler step. */
export function thomasTick(
	x: number,
	y: number,
	z: number,
	b: number,
	dt: number,
): { x: number; y: number; z: number } {
	const dx = Math.sin(y) - b * x
	const dy = Math.sin(z) - b * y
	const dz = Math.sin(x) - b * z
	return {
		x: x + dt * dx,
		y: y + dt * dy,
		z: z + dt * dz,
	}
}
