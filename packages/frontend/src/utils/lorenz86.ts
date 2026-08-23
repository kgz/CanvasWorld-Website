/** Lorenz 86 ODE step (archive CanvasWorld). Params a,b,f,g; d = dt. */
export function lorenz86Tick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	f: number,
	g: number,
	d: number,
): { x: number; y: number; z: number } {
	const dx = (-a * x - y * y - z * z + a * b) * d
	const dy = (-y + x * y - f * x * z + g) * d
	const dz = (-z + f * x * y + x * z) * d
	return {
		x: x + dx,
		y: y + dy,
		z: z + dz,
	}
}
