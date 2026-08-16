/** Row-major: index = y * width + x */
export const xyToIndex = (x: number, y: number, width: number): number =>
	y * width + x

export const indexToXY = (index: number, width: number): { x: number; y: number } => ({
	x: index % width,
	y: Math.floor(index / width),
})
