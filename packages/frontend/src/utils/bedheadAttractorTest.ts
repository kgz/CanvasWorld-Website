const { sin, cos } = Math

// Test function to validate tick behavior - extracted from test file for use in components
export const testBedheadAttractorTick = (a: number, b: number, iterations: number = 100) => {
	let x = 0.1, y = 0
	const results: Array<{x: number, y: number, iteration: number}> = []
	
	for (let i = 0; i < iterations; i++) {
		// Safety check for division by zero or very small b
		let safeB = b
		if (Math.abs(b) < 0.001) {
			console.warn(`Bedhead Attractor: b value ${b} is too small, using 0.001`)
			safeB = 0.001 * (Math.sign(b) || 1) // Use 1 if sign is 0
		}
		
		const nx = sin((x * y) / safeB) * y + cos(a * x - y)
		const ny = x + sin(y) / safeB
		
		// Check for NaN or Infinity
		if (!isFinite(nx) || !isFinite(ny)) {
			console.error(`Bedhead Attractor: Invalid values at iteration ${i}: nx=${nx}, ny=${ny}, a=${a}, b=${b}`)
			break
		}
		
		x = nx
		y = ny
		
		results.push({ x, y, iteration: i })
		
		// Check if values are exploding
		if (Math.abs(x) > 1000 || Math.abs(y) > 1000) {
			console.warn(`Bedhead Attractor: Values exploding at iteration ${i}: x=${x}, y=${y}`)
			break
		}
	}
	
	return results
}
