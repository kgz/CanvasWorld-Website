/** Discrete 3D polynomial maps from the CanvasWorld archive. */

export type PolynomialAbsCoeffs = {
	xa: number
	xb: number
	xc: number
	xd: number
	xe: number
	xf: number
	xg: number
	ya: number
	yb: number
	yc: number
	yd: number
	ye: number
	yf: number
	yg: number
	za: number
	zb: number
	zc: number
	zd: number
	ze: number
	zf: number
	zg: number
}

export function polynomialAbsTick(
	x: number,
	y: number,
	z: number,
	c: PolynomialAbsCoeffs,
): { x: number; y: number; z: number } {
	const ax = Math.abs(x)
	const ay = Math.abs(y)
	const az = Math.abs(z)
	return {
		x: c.xa + c.xb * x + c.xc * y + c.xd * z + c.xe * ax + c.xf * ay + c.xg * az,
		y: c.ya + c.yb * x + c.yc * y + c.yd * z + c.ye * ax + c.yf * ay + c.yg * az,
		z: c.za + c.zb * x + c.zc * y + c.zd * z + c.ze * ax + c.zf * ay + c.zg * az,
	}
}

export function polynomialTypeATick(
	x: number,
	y: number,
	z: number,
	a: number,
	b: number,
	c: number,
): { x: number; y: number; z: number } {
	return {
		x: a + y - z * y,
		y: b + z - x * z,
		z: c + x - y * x,
	}
}

export function polynomialTypeBTick(
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
		x: a + y - z * (b * y),
		y: c + z - x * (d * z),
		z: e + x - y * (f * x),
	}
}

export type PolynomialTypeCCoeffs = {
	xa: number
	xb: number
	xc: number
	xd: number
	xe: number
	xf: number
	ya: number
	yb: number
	yc: number
	yd: number
	ye: number
	yf: number
	za: number
	zb: number
	zc: number
	zd: number
	ze: number
	zf: number
}

export function polynomialTypeCTick(
	x: number,
	y: number,
	z: number,
	c: PolynomialTypeCCoeffs,
): { x: number; y: number; z: number } {
	return {
		x: c.xa + x * (c.xb + c.xc * x + c.xd * y) + y * (c.xe + c.xf * y),
		y: c.ya + y * (c.yb + c.yc * y + c.yd * z) + z * (c.ye + c.yf * z),
		z: c.za + z * (c.zb + c.zc * z + c.zd * x) + x * (c.ze + c.zf * x),
	}
}
