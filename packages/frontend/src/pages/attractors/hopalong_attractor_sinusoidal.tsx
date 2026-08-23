import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const HopalongAttractorSinusoidal = createAttractorPage({
	params: {
		a: { initialValue: 2.0, min: -20, max: 20, step: 0.000001 },
		b: { initialValue: 1.0, min: -20, max: 20, step: 0.000001 },
		c: { initialValue: 0.5, min: -20, max: 20, step: 0.000001 },
	},
	examples: [
		{ a: 2.0, b: 1.0, c: 0.5 },
		{ a: 3.0, b: 0.5, c: 1.0 },
		{ a: 1.5, b: 0.8, c: 0.3 },
	],
	seed: { x: 0.03, y: 0.01 },
	scale: 90,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -180],
	iterate: (x, y, p) => {
		const xn = y + Math.sin(p.b * x - p.c)
		const yn = p.a - x
		return { x: xn, y: yn }
	},
	description: () => (
		<>
			Sinusoidal Hopalong is Barry Martin's sine variant of the classic map: the square-root term is replaced by a sine.
			<br />
			<br />
			Definition:
			<BlockMath math={'x_{n+1} = y_n + \\sin(b x_n - c)'} />
			<BlockMath math={'y_{n+1} = a - x_n'} />
			Limits:
			<BlockMath math={'a, b, c \\in [-20, 20]'} />
		</>
	),
})

export default HopalongAttractorSinusoidal
