const { sin, cos } = Math

/** Discrete Bedhead 3D map step (archive CanvasWorld workshop). */
export function bedheadAttractor3dTick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
): { x: number; y: number; z: number } {
	const safeB = Math.abs(b) < 0.001 ? 0.001 * (Math.sign(b) || 1) : b
	const nx = sin((x * y) / safeB) * y + cos(a * x - y)
	const ny = x + sin(y) / safeB
	const nz = y + cos(y * x) / safeB
	return { x: nx, y: ny, z: nz }
}
