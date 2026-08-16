import { BlockMath } from 'react-katex'
import { Link } from 'react-router-dom'
import { createComplexQuadraticPage } from './complexQuadraticSet'

const MandelbrotSet = createComplexQuadraticPage({
	kind: 'mandelbrot',
	defaultCenter: [-0.5, 0],
	description: () => (
		<>
			The Mandelbrot set is one of the most famous fractals in mathematics, discovered by Benoit Mandelbrot in 1980.
			For each point c in the complex plane, we iterate:
			<BlockMath math={'z_{n+1} = z_n^2 + c'} />
			starting with z₀ = 0. Points where |z| remains bounded belong to the set (shown in black); the exterior is
			grayscale by escape time.
			<br />
			<br />
			Click the set to open the related{' '}
			<Link to="/julia_set">Julia set</Link> for that constant c.
			<br />
			<br />
			<strong>Controls:</strong> scroll zoom, drag pan, iterations in Params, export PNG from the HUD.
			<br />
			<br />
			Reference:{' '}
			<a href="https://en.wikipedia.org/wiki/Mandelbrot_set" target="_blank" rel="noreferrer">
				Mandelbrot Set – Wikipedia
			</a>
		</>
	),
})

export default MandelbrotSet
