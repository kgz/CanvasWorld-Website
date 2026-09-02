import { BlockMath, InlineMath } from 'react-katex'
import { peterDeJongAttractorTick } from '../../utils/peterDeJongAttractor'
import { createAttractorPage } from '../_attractorPage'

const PeterDeJongAttractor = createAttractorPage({
	params: {
		a: { initialValue: 2.695, min: -5, max: 5, step: 0.000001 },
		b: { initialValue: 1.72, min: -5, max: 5, step: 0.000001 },
		c: { initialValue: 1.178, min: -5, max: 5, step: 0.000001 },
		d: { initialValue: 0.311, min: -5, max: 5, step: 0.000001 },
	},
	examples: [
		{ a: 2.695, b: 1.72, c: 1.178, d: 0.311 },
		{ a: -2, b: -2, c: -1.2, d: 2 },
		{ a: -2.24, b: 0.43, c: -0.65, d: -2.43 },
	],
	seed: { x: 0, y: 0 },
	scale: 50,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -500],
	iterate: peterDeJongAttractorTick,
	description: () => (
		<>
			The Peter de Jong attractor is a 2D iterated map: four real knobs and a sine–cosine pair with a
			minus between them. Same family of discrete maps as Clifford Pickover’s, different sign and
			pairing.
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'x_{n+1} = \\sin(a y_n) - \\cos(b x_n)'} />
			<BlockMath math={'y_{n+1} = \\sin(c x_n) - \\cos(d y_n)'} />
			<br />
			Defaults: <InlineMath math="a=2.695,\ b=1.72,\ c=1.178,\ d=0.311" />, seed{' '}
			<InlineMath math="(0,0)" />. Named for Peter de Jong; often listed alongside Pickover-style
			maps in generative-art notes.
		</>
	),
})

export default PeterDeJongAttractor
