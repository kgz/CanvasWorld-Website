import { BlockMath, InlineMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const SvenssonAttractor = createAttractorPage({
	params: {
		a: { initialValue: -3, min: -3, max: 3, step: 0.000001 },
		b: { initialValue: 3, min: -3, max: 3, step: 0.000001 },
		c: { initialValue: 3, min: -3, max: 3, step: 0.000001 },
		d: { initialValue: 3, min: -3, max: 3, step: 0.000001 },
	},
	seed: { x: 0, y: 0 },
	scale: 50,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -500],
	iterate: (x, y, p) => ({
		x: p.d * Math.sin(p.a * x) - Math.sin(p.b * y),
		y: p.c * Math.cos(p.a * x) + Math.cos(p.b * y),
	}),
	description: () => (
		<>
			The Svensson attractor is a 2-dimensional strange attractor defined by a discrete iteration of sine and cosine terms with four real parameters.
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'x_{n+1} = d \\cdot \\sin(a \\cdot x_n) - \\sin(b \\cdot y_n)'} />
			<BlockMath math={'y_{n+1} = c \\cdot \\cos(a \\cdot x_n) + \\cos(b \\cdot y_n)'} />
			<br />
			Where <InlineMath math="a, b, c, d" /> are real constants, and <InlineMath math="(x_0, y_0)" /> is an initial seed point.
			<br />
			<br />
			<strong>Parameter limits:</strong>
			<BlockMath math="a, b, c, d \\in [-3, 3]" />
			<br />
			<br />
			Default parameters on Classical Chaos sit at <InlineMath math="a = -3" />, <InlineMath math="b = 3" />,{' '}
			<InlineMath math="c = 3" />, <InlineMath math="d = 3" />, seed <InlineMath math="(0, 0)" />.
		</>
	),
})

export default SvenssonAttractor
