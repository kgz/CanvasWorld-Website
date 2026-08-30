/** Modified Chua (multi-scroll) ODE Euler step — archive CanvasWorld used dt≈0.1 (points). */
export function modifiedChuaTick(
	x: number,
	y: number,
	z: number,
	alpha: number,
	beta: number,
	a: number,
	b: number,
	d: number,
	dt: number,
): { x: number; y: number; z: number } {
	const h = -b * Math.sin((Math.PI * x) / (2 * a) + d)
	const dx = alpha * (y - h)
	const dy = x - y + z
	const dz = -beta * y
	return {
		x: x + dt * dx,
		y: y + dt * dy,
		z: z + dt * dz,
	}
}
