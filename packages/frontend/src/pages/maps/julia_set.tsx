import { BlockMath } from 'react-katex'
import { Link } from 'react-router-dom'
import { createComplexQuadraticPage } from './complexQuadraticSet'

const JuliaSet = createComplexQuadraticPage({
	kind: 'julia',
	defaultCenter: [0, 0],
	description: () => (
		<>
			A Julia set uses the same iteration as the Mandelbrot set,
			<BlockMath math={'z_{n+1} = z_n^2 + c'} />
			but fixes the constant c and varies the starting point z₀ across the plane. Each c produces a different shape —
			some connected, some dust-like.
			<br />
			<br />
			Tune <strong>cReal</strong> / <strong>cImag</strong> in Params, or open the{' '}
			<Link to="/mandelbrot_set">Mandelbrot set</Link> and click a point to jump here with that c.
			<br />
			<br />
			<strong>Controls:</strong> scroll zoom, drag pan, iterations + c in Params, export PNG from the HUD.
			<br />
			<br />
			Reference:{' '}
			<a href="https://en.wikipedia.org/wiki/Julia_set" target="_blank" rel="noreferrer">
				Julia Set – Wikipedia
			</a>
		</>
	),
})

export default JuliaSet
