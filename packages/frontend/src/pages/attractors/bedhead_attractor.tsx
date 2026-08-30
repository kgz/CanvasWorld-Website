import { BlockMath, InlineMath } from 'react-katex'
import * as THREE from 'three'
import { createAttractorPage } from '../_attractorPage'
import { bedheadAttractorTick } from '../../utils/bedheadAttractor'

const _hsl = new THREE.Color()

const BedheadAttractor = createAttractorPage({
	params: {
		a: { initialValue: 0.65343, min: -2, max: 2, step: 0.001 },
		b: { initialValue: 0.7345345, min: 0.1, max: 2, step: 0.01 },
	},
	examples: [
		{ a: 0.65343, b: 0.7345345 },
		{ a: -0.81, b: -0.92 },
		{ a: -0.64, b: 0.76 },
		{ a: 0.06, b: 0.98 },
	],
	seed: { x: 1, y: 1 },
	scale: 50,
	cameraPosition: [0, 0, -300],
	color: (i, n) => {
		const t = i / Math.max(n - 1, 1)
		if (i >= n - 120) {
			_hsl.setHSL(0.14, 0.92, 0.62)
		} else {
			_hsl.setHSL(0.44 - 0.1 * t, 0.82, 0.42 + 0.18 * t)
		}
		return [_hsl.r, _hsl.g, _hsl.b]
	},
	iterate: (x, y, p) => bedheadAttractorTick(x, y, p.a, p.b),
	description: () => (
		<>
			The Bedhead attractor (Ivan Emrich) is a 2D discrete map that builds intricate fractal
			clouds from a simple sine–cosine update.
			<br />
			<br />
			Definitions:
			<BlockMath math={'x_{n+1} = \\sin(x \\cdot y/b) \\cdot y + \\cos(a \\cdot x - y)'} />
			<BlockMath math={'y_{n+1} = x + \\sin(y)/b'} />
			<br />
			<br />
			Parameters <InlineMath math="a" /> and <InlineMath math="b" /> control the shape; seed{' '}
			<InlineMath math="(1,1)" /> matches common catalog presets. Mint-to-teal body with a gold
			tip on the newest iterates.
		</>
	),
})

export default BedheadAttractor
