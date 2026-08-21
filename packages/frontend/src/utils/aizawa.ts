/** Aizawa ODE Euler step (archive CanvasWorld defaults use dt≈0.01). */
export function aizawaTick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
	dt: number,
): { x: number; y: number; z: number } {
	const dx = (z - b) * x - d * y
	const dy = d * x + (z - b) * y
	const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)
	return {
		x: x + dt * dx,
		y: y + dt * dy,
		z: z + dt * dz,
	}
}
