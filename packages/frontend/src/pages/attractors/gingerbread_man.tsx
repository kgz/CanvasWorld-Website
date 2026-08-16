import { BlockMath } from 'react-katex'
import { createAttractorPage } from '../_attractorPage'
import { gingerbreadManTick } from '../../utils/gingerbreadMan'

const GingerbreadMan = createAttractorPage({
	params: {},
	seed: { x: -0.1, y: 0 },
	scale: 20,
	color: 'hsl-chunk',
	cameraPosition: [0, 0, -775],
	iterate: (x, y) => gingerbreadManTick(x, y),
	description: () => (
		<>
			The Gingerbread Man Attractor is a classic example of a chaotic map — a simple, two-dimensional system that produces surprisingly intricate and unpredictable behavior. Despite its playful name, this attractor's shape often resembles a gingerbread man when plotted, earning it its distinctive title.
			<br />
			<br />
			Defined by only two equations, the system evolves as follows:
			<br />
			<br />
			<strong>Definition:</strong>
			<BlockMath math={'x_{n+1} = 1 - y_n + |x_n|'} />
			<BlockMath math={'y_{n+1} = x_n'} />
			<br />
			Each iteration takes the current point and transforms it through absolute value and subtraction, creating a chaotic dance that never repeats yet remains bounded within a distinctive region.
			<br />
			<br />
			The simplicity of the rule hides its beauty — from random starting points, a consistent structure emerges: a chaotic, cookie-shaped figure made of millions of points.
		</>
	),
})

export default GingerbreadMan
