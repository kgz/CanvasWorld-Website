const { sin, cos } = Math

// Core tick logic for Bedhead Attractor - can be used by both component and tests
export const bedheadAttractorTick = (
	x: number,
	y: number,
	a: number,
	b: number
): { x: number; y: number } => {
	// Safety check for division by zero or very small b
	const safeB = Math.abs(b) < 0.001 ? 0.001 * (Math.sign(b) || 1) : b
	
	const nx = sin((x * y) / safeB) * y + cos(a * x - y)
	const ny = x + sin(y) / safeB
	
	// Check for NaN or Infinity
	if (!isFinite(nx) || !isFinite(ny)) {
		throw new Error(`Invalid values: nx=${nx}, ny=${ny}, a=${a}, b=${b}`)
	}
	
	return { x: nx, y: ny }
}
