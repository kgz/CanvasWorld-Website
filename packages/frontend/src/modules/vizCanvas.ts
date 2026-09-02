export function findVizCanvas(): HTMLCanvasElement | null {
	const el = document.querySelector('#cw-viz-canvas')
	return el instanceof HTMLCanvasElement ? el : null
}
