import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const { sqrt } = Math

const G = (x: number, b: number, mu: number) => sqrt(Math.abs(b * x - mu))

const HopalongAttractorAdditive = createAttractorPage({
	params: {
		a: { initialValue: 0, min: -1, max: 1, step: 0.0001 },
		b: { initialValue: 0.0526, min: -1, max: 1, step: 0.0001 },
		mu: { initialValue: 0.0351, min: -1, max: 1, step: 0.0001 },
	},
	seed: { x: 0.723135391715914, y: -0.327585775405169 },
	scale: 55,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -275],
	iterate: (x, y, p) => {
		const xn = y + p.a * (1 - p.b * y ** 2) * y + G(x, p.b, p.mu)
		const yn = -x + G(xn, p.b, p.mu)
		return { x: xn, y: yn }
	},
	description: () => (
		<>
			This visualization shows the Additive Hopalong Attractor, a modern variation of the classic chaotic system discovered by Barry Martin.
			<br />
			<br />
			The original Hopalong attractor uses a sign function to flip direction each step, producing sharp, mirrored "butterfly" or "boomerang" shapes.
			This additive variation removes that sign change and introduces a smooth nonlinear feedback term, giving the motion a more fluid and continuous character.
			<br />
			<br />
			Instead of distinct symmetrical wings, this version forms swirling, asymmetric clouds of points — like an evolving nebula of chaos. The equations blend Hopalong-style chaos with logistic-style growth, resulting in a dynamic but balanced system.
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'x_{n+1} = y_n + a(1 - by_n^2)y_n + G(x_n)'} />
			<BlockMath math={'y_{n+1} = -x_n + G(x_{n+1})'} />
			Where
			<BlockMath math={'G(x) = \\sqrt{|bx - \\mu|}'} />
			<br />
			<strong>Limits:</strong>
			<BlockMath math="a,b,\\mu \\in [-1, 1]" />
			<br />
			<strong>References:</strong>
			<br />
			<a target="_blank" href="https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf">
				www.jolinton.co.uk
			</a>
		</>
	),
})

export default HopalongAttractorAdditive
