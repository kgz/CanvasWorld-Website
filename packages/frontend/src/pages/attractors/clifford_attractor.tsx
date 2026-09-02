import { BlockMath, InlineMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'
import { cliffordAttractorTick } from '../../utils/cliffordAttractor'

const CliffordAttractor = createAttractorPage({
	params: {
		a: { initialValue: 1.7, min: -3, max: 3, step: 0.000001 },
		b: { initialValue: 1.8, min: -3, max: 3, step: 0.000001 },
		c: { initialValue: 1.9, min: -3, max: 3, step: 0.000001 },
		d: { initialValue: 0.4, min: -3, max: 3, step: 0.000001 },
	},
	seed: { x: -2, y: -2 },
	scale: 100,
	color: 'purple',
	cameraPosition: [0, 0, -500],
	iterate: cliffordAttractorTick,
	description: () => (
		<>
			The Clifford Attractor is a fascinating example of a 2-dimensional strange (chaotic) attractor defined by a simple discrete iteration of two functions. It's both mathematically rich and visually compelling.
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'x_{n+1} = \\sin(a \\cdot y_n) + c \\cdot \\cos(a \\cdot x_n)'} />
			<BlockMath math={'y_{n+1} = \\sin(b \\cdot x_n) + d \\cdot \\cos(b \\cdot y_n)'} />
			<br />
			Where <InlineMath math="a, b, c, d" /> are real constants, and <InlineMath math="(x_0, y_0)" /> is an initial seed point.
			<br />
			<br />
			<strong>Why it's interesting:</strong>
			<br />
			• <strong>Visual richness:</strong> Different parameter choices produce wildly different shapes — loops, ribbons, swirls, almost-cellular structures
			<br />
			• <strong>Simplicity + complexity:</strong> Simple sine/cosine formula yet complex chaotic behavior with sensitive dependence and fractal boundaries
			<br />
			• <strong>Fractal nature:</strong> Often has non-integer dimension with self-similarity when zoomed
			<br />
			• <strong>Parameter exploration:</strong> Slight variations can dramatically change the attractor shape
			<br />
			<br />
			<strong>Parameter limits:</strong>
			<BlockMath math="a, b, c, d \\in [-3, 3]" />
			<br />
			<br />
			The attractor is named after Clifford A. Pickover and is popular in generative art due to its visual richness and ease of parameter experimentation.
		</>
	),
})

export default CliffordAttractor
