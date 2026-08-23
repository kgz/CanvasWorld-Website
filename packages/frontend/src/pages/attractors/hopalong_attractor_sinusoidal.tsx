import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const HopalongAttractorSinusoidal = createAttractorPage({
	params: {
		a: { initialValue: 2.5, min: -20, max: 20, step: 0.000001 },
		b: { initialValue: 4.0, min: -20, max: 20, step: 0.000001 },
		c: { initialValue: 0.2, min: -20, max: 20, step: 0.000001 },
	},
	examples: [
		{ a: 2.5, b: 4.0, c: 0.2 },
		{ a: 1.4, b: 5.157895, c: 2.736842 },
		{ a: 0.1, b: 5.0, c: 2.0 },
	],
	seed: { x: 0.03, y: 0.01 },
	scale: 1.1,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -220],
	iterate: (x, y, p) => {
		const xn = y + Math.sin(p.b * x - p.c)
		const yn = p.a - x
		return { x: xn, y: yn }
	},
	description: () => (
		<>
			Sinusoidal Hopalong is Barry Martin's sine variant of the classic map: the square-root term is replaced by a sine.
			Small <code>b</code> stays near-periodic (thin rings); larger <code>b</code> fills a chaotic cloud.
			<br />
			<br />
			Definition:
			<BlockMath math={'x_{n+1} = y_n + \\sin(b x_n - c)'} />
			<BlockMath math={'y_{n+1} = a - x_n'} />
			Defaults: <code>a = 2.5</code>, <code>b = 4</code>, <code>c = 0.2</code>.
			Limits:
			<BlockMath math={'a, b, c \\in [-20, 20]'} />
		</>
	),
})

export default HopalongAttractorSinusoidal
