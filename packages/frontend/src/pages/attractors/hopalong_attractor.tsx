import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const HopalongAttractor = createAttractorPage({
	params: {
		a: { initialValue: 1.4, min: -20, max: 20, step: 0.000001 },
		b: { initialValue: 5.157895, min: -20, max: 20, step: 0.000001 },
		c: { initialValue: 2.736842, min: -20, max: 20, step: 0.000001 },
	},
	examples: [
		{ a: 1.4, b: 5.157895, c: 2.736842 },
		{ a: -11, b: 0.3, c: -0.5 },
		{ a: 1.4, b: 5.157895, c: -4.561404 },
	],
	seed: { x: 0.03, y: 0.01 },
	scale: 5,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -220],
	iterate: (x, y, p) => {
		const xn = y - Math.sign(x) * Math.sqrt(Math.abs(p.b * x - p.c))
		const yn = p.a - x
		return { x: xn, y: yn }
	},
	description: () => (
		<>
			The Hopalong Attractor is a fractal also known as the "Skull Attractor" or "Martin's Attractor".
			<br />
			<br />
			It was discovered by Barry Martin in 1981 and at the core is just a modified simple ellipse.
			<br />
			<br />
			Definition:
			<BlockMath math={'x_{n+1} = y_n - \\mathrm{sgn}(x_n)\\sqrt{|b x_n - c|}'} />
			<BlockMath math={'y_{n+1} = a - x_n'} />
			Limits:
			<BlockMath math={'a, b, c \\in [-20, 20]'} />
		</>
	),
})

export default HopalongAttractor
