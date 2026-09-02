import { BlockMath, InlineMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'
import { henonMapTick } from '../../utils/henonMap'

/** Classic Hénon 1976: x' = 1 − a x² + y, y' = b x */
const HenonMap = createAttractorPage({
	params: {
		a: { initialValue: 1.4, min: 0, max: 2, step: 0.000001 },
		b: { initialValue: 0.3, min: 0, max: 2, step: 0.000001 },
	},
	seed: { x: 0.03, y: 0.01 },
	scale: 100,
	color: 'hsl-sin',
	cameraPosition: [0, 0, -400],
	iterate: henonMapTick,
	description: () => (
		<>
			The Hénon map is a discrete-time dynamical system introduced by Michel Hénon in 1976 as a
			simplified model while studying the Lorenz attractor. Classical Chaos iterates the classic form.
			<br />
			<br />
			Definition:
			<BlockMath math="x_{n + 1} = 1 - a x_n^2 + y_n" />
			<BlockMath math="y_{n + 1} = b x_n" />
			Limits:
			<BlockMath math="a, b \\in [0, 2]" />
			<br />
			<br />
			Jacobian determinant is <InlineMath math="-b" /> (not area-preserving unless{' '}
			<InlineMath math="|b|=1" />). Classic chaotic defaults: <code>a = 1.4</code>, <code>b = 0.3</code>.
		</>
	),
})

export default HenonMap
