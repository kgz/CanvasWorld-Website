import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const HenonMap = createAttractorPage({
	params: {
		a: { initialValue: 1.4, min: 0, max: 2, step: 0.000001 },
		b: { initialValue: 0.3, min: 0, max: 20, step: 0.000001 },
	},
	seed: { x: 0.03, y: 0.01 },
	scale: 100,
	color: 'hsl-sin',
	cameraPosition: [0, 0, -400],
	iterate: (x, y, p) => ({
		x: -(x * x) + p.b * y + p.a,
		y: x,
	}),
	description: () => (
		<>
			The Henon map is a discrete-time dynamical system.
			<br />
			<br />
			It is a prototypical example of chaotic system that exhibits the phenomenon of strange attractors.
			<br />
			<br />
			It was introduced by Michel Hénon in 1976, while studying the Lorenz attractor map.
			The Hénon map arises from a simplification of the Lorenz system.
			<br />
			<br />
			The Hénon map is area-preserving and exhibits chaotic behavior for certain values of its parameters.
			<br />
			<br />
			Definition:
			<BlockMath math="x_{n + 1} = 1 - a x_n^2 + y_n" />
			<BlockMath math="y_{n + 1} = b x_n" />
			Limits:
			<BlockMath math="a, b \\in [0, 2]" />
		</>
	),
})

export default HenonMap
