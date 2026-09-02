import { describe, expect, it } from 'vitest'
import {
	hopalongAdditiveAttractorTick,
	hopalongAttractorTick,
	hopalongPositiveAttractorTick,
	hopalongSinusoidalAttractorTick,
	type HopalongParams,
} from '../../utils/hopalongAttractor'

const defaults: HopalongParams = { a: 1.4, b: 5.157895, c: 2.736842 }

describe('Hopalong family', () => {
	const cases = [
		{
			name: 'classic',
			tick: hopalongAttractorTick,
			expectedX: (x: number, y: number, p: HopalongParams) =>
				y - Math.sign(x) * Math.sqrt(Math.abs(p.b * x - p.c)),
		},
		{
			name: 'positive',
			tick: hopalongPositiveAttractorTick,
			expectedX: (x: number, y: number, p: HopalongParams) =>
				y + Math.sign(x) * Math.sqrt(Math.abs(p.b * x - p.c)),
		},
		{
			name: 'additive',
			tick: hopalongAdditiveAttractorTick,
			expectedX: (x: number, y: number, p: HopalongParams) =>
				y + Math.sqrt(Math.abs(p.b * x - p.c)),
		},
		{
			name: 'sinusoidal',
			tick: hopalongSinusoidalAttractorTick,
			expectedX: (x: number, y: number, p: HopalongParams) => y + Math.sin(p.b * x - p.c),
		},
	] as const

	for (const { name, tick, expectedX } of cases) {
		describe(name, () => {
			it('matches the x update and y = a - x', () => {
				const x = 0.03
				const y = 0.01
				const result = tick(x, y, defaults)

				expect(result.x).toBeCloseTo(expectedX(x, y, defaults), 10)
				expect(result.y).toBeCloseTo(defaults.a - x, 10)
			})

			it('stays finite over many iterations', () => {
				let x = 0.03
				let y = 0.01

				for (let i = 0; i < 500; i++) {
					const next = tick(x, y, defaults)
					expect(Number.isFinite(next.x)).toBe(true)
					expect(Number.isFinite(next.y)).toBe(true)
					x = next.x
					y = next.y
				}
			})
		})
	}
})
