import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'

const { sin } = Math

const G = (x: number, b: number, mu: number) => sin(b * x - mu)

const HopalongAttractorSinusoidal = createAttractorPage({
	params: {
		a: { initialValue: 0, min: -1, max: 1, step: 0.00001 },
		b: { initialValue: 0.61404, min: -1, max: 1, step: 0.00001 },
		mu: { initialValue: 0.54386, min: -1, max: 1, step: 0.00001 },
	},
	examples: [
		{ a: 0, b: 0.9298, mu: 0.40351 },
		{ a: 0, b: 0.66667, mu: 0.54386 },
	],
	seed: { x: 0.723135391715914, y: -0.327585775405169 },
	scale: 2,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -775],
	iterate: (x, y, p) => {
		const xn = y + p.a * (1 - p.b * y ** 2) * y + G(x, p.b, p.mu)
		const yn = -x + G(xn, p.b, p.mu)
		return { x: xn, y: yn }
	},
	description: () => (
		<>
			This visualization represents the Sinusoidal Hopalong Attractor, a creative variation of the classic Hopalong fractal system.
			<br />
			<br />
			While the original Hopalong uses a square-root relationship and abrupt sign flips to generate chaotic, mirrored "butterfly" forms, this sinusoidal variation replaces that square root with a smooth sine function. The result is a gentler, wave-driven form of chaos that blends periodic motion with fractal structure.
			<br />
			<br />
			Instead of sharp transitions, each point now follows a sinusoidal feedback loop, producing flowing, ribbon-like or orbital shapes that feel both rhythmic and unpredictable. The dynamics still depend on three key parameters (a, b, μ), which control the amplitude, curvature, and overall harmony of the attractor.
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'x_{n+1} = y_n + a(1 - by_n^2)y_n + \\sin(bx_n - \\mu)'} />
			<BlockMath math={'y_{n+1} = -x_n + \\sin(bx_{n+1} - \\mu)'} />
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

export default HopalongAttractorSinusoidal
