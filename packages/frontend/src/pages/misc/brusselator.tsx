import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'
import { brusselatorTick } from '../../utils/brusselator'

const Brusselator = createAttractorPage({
	params: {
		a: { initialValue: 1, min: 0.1, max: 3, step: 0.0001 },
		b: { initialValue: 3, min: 0.1, max: 5, step: 0.0001 },
		dt: { initialValue: 0.02, min: 0.001, max: 0.1, step: 0.001 },
	},
	examples: [
		{ a: 1, b: 3, dt: 0.02 },
		{ a: 1, b: 2.5, dt: 0.02 },
		{ a: 0.5, b: 1.2, dt: 0.02 },
	],
	seed: { x: 1, y: 1 },
	scale: 60,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -350],
	iterate: (x, y, p) => brusselatorTick(x, y, p.a, p.b, p.dt),
	description: () => (
		<>
			The Brusselator is a theoretical model of an autocatalytic chemical oscillator, introduced by Ilya Prigogine
			and collaborators. This visualization integrates the continuous ODEs with a fixed Euler step.
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'\\frac{dx}{dt} = a - (b + 1)x + x^2 y'} />
			<BlockMath math={'\\frac{dy}{dt} = b x - x^2 y'} />
			<br />
			For a classic oscillatory regime try a = 1, b = 3.
			<br />
			<br />
			<strong>Limits:</strong>
			<BlockMath math="a \\in [0.1, 3],\\quad b \\in [0.1, 5],\\quad dt \\in [0.001, 0.1]" />
		</>
	),
})

export default Brusselator
