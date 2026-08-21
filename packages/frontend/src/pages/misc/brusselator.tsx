import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'
import { brusselatorTick } from '../../utils/brusselator'

/** Classic a=1,b=3 limit cycle sits in Q1 — subtract so the trail frames on origin. */
const FRAME_CX = 2.1
const FRAME_CY = 2.8
const FRAME_SCALE = 95

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
	scale: (x, y) => [(x - FRAME_CX) * FRAME_SCALE, (y - FRAME_CY) * FRAME_SCALE],
	color: 'hsl-chunk',
	pointSize: 1.25,
	cameraPosition: [0, 0, 280],
	iterate: (x, y, p) => brusselatorTick(x, y, p.a, p.b, p.dt),
	description: () => (
		<>
			The Brusselator is a theoretical model of an autocatalytic chemical oscillator, introduced by Ilya Prigogine
			and collaborators (Brussels school). Classical Chaos integrates the well-mixed ODEs with a fixed Euler step and
			draws the <em>phase orbit</em> — concentrations <code>(x, y)</code> as a trail in the plane. This is not a
			spatial reaction–diffusion field (spots/stripes on a grid).
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'\\frac{dx}{dt} = a - (b + 1)x + x^2 y'} />
			<BlockMath math={'\\frac{dy}{dt} = b x - x^2 y'} />
			<br />
			Classic oscillatory regime: <code>a = 1</code>, <code>b = 3</code>. Seed here: <code>(1, 1)</code>.
			<br />
			<br />
			<strong>Limits:</strong>
			<BlockMath math="a \\in [0.1, 3],\\quad b \\in [0.1, 5],\\quad dt \\in [0.001, 0.1]" />
		</>
	),
})

export default Brusselator
