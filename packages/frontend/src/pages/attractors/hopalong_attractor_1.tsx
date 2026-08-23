import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const HopalongAttractor1 = createAttractorPage({
	params: {
		a: { initialValue: 2.38442, min: 0, max: 10, step: 0.000001 },
		b: { initialValue: 5.2, min: 0, max: 10, step: 0.000001 },
		c: { initialValue: 4.8, min: 0, max: 10, step: 0.000001 },
	},
	examples: [
		{ a: 2.38442, b: 5.2, c: 4.8 },
		{ a: 1.4, b: 5.157895, c: 2.736842 },
		{ a: 4.2, b: 3.1, c: 6.5 },
	],
	seed: { x: 0, y: 0 },
	scale: 12,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -120],
	iterate: (x, y, p) => {
		const xn = y - 1 - Math.sqrt(Math.abs(p.b * x - 1 - p.c)) * Math.sin(x - 1)
		const yn = p.a - x - 1
		return { x: xn, y: yn }
	},
	description: () => (
		<>
			Hopalong Attractor 1 is the archive typo variant of classic Hopalong: <code>sin</code> where
			<code>sign</code> was meant. The cloud still works, so it stayed as its own map.
			<br />
			<br />
			Compared with classic Hopalong, the square-root term is multiplied by a smooth sine instead of a
			hard sign flip, and the absolute value uses <code>|b x − 1 − c|</code> rather than{' '}
			<code>|b x − c|</code>.
			<br />
			<br />
			Definition:
			<BlockMath math="x_{n+1} = y_n - 1 - \sin(x_n - 1)\sqrt{|b x_n - 1 - c|}" />
			<BlockMath math="y_{n+1} = a - x_n - 1" />
			Limits:
			<BlockMath math="a, b, c \in [0, 10]" />
		</>
	),
})

export default HopalongAttractor1
