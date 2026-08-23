/** 3D Peter de Jong discrete map step (archive CanvasWorld simultaneous update). */
export function peterDeJong3dTick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number,
): { x: number; y: number; z: number } {
	return {
		x: Math.sin(a * z) - Math.cos(b * x),
		y: Math.sin(c * x) - Math.cos(d * y),
		z: Math.sin(e * y) - Math.cos(f * z),
	}
}
