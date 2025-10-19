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

// Test function that uses the core tick logic
export const testBedheadAttractorTick = (a: number, b: number, iterations: number = 100) => {
	let x = 0.1, y = 0
	const results: Array<{x: number, y: number, iteration: number}> = []
	
	for (let i = 0; i < iterations; i++) {
		try {
			const next = bedheadAttractorTick(x, y, a, b)
			x = next.x
			y = next.y
			
			results.push({ x, y, iteration: i })
			
			// Check if values are exploding
			if (Math.abs(x) > 1000 || Math.abs(y) > 1000) {
				console.warn(`Bedhead Attractor: Values exploding at iteration ${i}: x=${x}, y=${y}`)
				break
			}
		} catch (error) {
			console.error(`Bedhead Attractor: Error at iteration ${i}:`, error.message)
			break
		}
	}
	
	return results
}
