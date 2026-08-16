import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const { sqrt } = Math

const G = (x: number, b: number, mu: number) => Math.sign(x) * sqrt(Math.abs(b * x - mu))

const HopalongAttractorPositive = createAttractorPage({
	params: {
		a: { initialValue: 0, min: -1, max: 1, step: 0.0001 },
		b: { initialValue: -0.211, min: -1, max: 1, step: 0.0001 },
		mu: { initialValue: -0.228, min: -1, max: 1, step: 0.0001 },
	},
	seed: { x: 0.723135391715914, y: -0.327585775405169 },
	scale: 5,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -175],
	iterate: (x, y, p) => {
		const xn = y + p.a * (1 - p.b * y ** 2) * y + G(x, p.b, p.mu)
		const yn = -x + G(xn, p.b, p.mu)
		return { x: xn, y: yn }
	},
	description: () => (
		<>
			This visualization is based on the Positive Hopalong Attractor, a variation of the original chaotic system first described by Barry Martin.
			<br />
			<br />
			The classic Hopalong attractor uses a sign function to alternate direction, producing its distinctive mirrored "butterfly" shape.
			This positive variation keeps that sign dependency — it multiplies the square root term by the sign of x — but combines it with a smooth nonlinear feedback term for added dynamism.
			<br />
			<br />
			The result is a balanced form of chaos: still sharply structured like the original, but with smoother curvature and a more continuous flow between regions. Each point follows the recursive rule:
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'x_{n+1} = y_n + a(1 - by_n^2)y_n + \\text{sgn}(x_n)\\sqrt{|bx_n - \\mu|}'} />
			<BlockMath math={'y_{n+1} = -x_n + \\text{sgn}(x_{n+1})\\sqrt{|bx_{n+1} - \\mu|}'} />
			<br />
			This combination preserves the attractor's mirror symmetry while softening its edges — giving rise to graceful, wave-like patterns that still retain their fractal heart.
			<br />
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

export default HopalongAttractorPositive
