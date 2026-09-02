export type GlossaryEntry = {
	label: string
	definition: string
	context?: string
}

export const GLOSSARY_TERMS = {
	polynomial: {
		label: 'polynomial',
		definition:
			'An expression built from sums of powers of a variable, each multiplied by a coefficient — like ax² + bx + c.',
	},
	attractor: {
		label: 'attractor',
		definition:
			'A set in state space that nearby trajectories approach over time. The motion settles toward it even though individual points keep moving.',
		context: 'On a viz page, the glowing trail often traces one basin of an attractor.',
	},
	'strange-attractor': {
		label: 'strange attractor',
		definition:
			'An attractor with sensitive dependence on starting point: trajectories stay bounded but never settle into a simple repeating loop.',
		context: 'The Lorenz butterfly is the classic first example most courses show.',
	},
	'phase-plane': {
		label: 'phase plane',
		definition:
			'A 2D plot of a dynamical system’s state variables against each other — a slice of how the motion evolves, not a photo of physical space.',
	},
	'phase-space': {
		label: 'phase space',
		definition:
			'The space whose axes are all the variables that describe a system — every point is one complete state, and motion is a path through that space.',
	},
	'state-space': {
		label: 'state space',
		definition:
			'Same idea as phase space: the set of all possible combinations of values the system can take at once.',
	},
	isosurface: {
		label: 'isosurface',
		definition:
			'A 3D surface where a scalar field equals one chosen value — the 3D cousin of a contour line on a map.',
	},
	ode: {
		label: 'ODE',
		definition:
			'An ordinary differential equation: a rule for how a small set of variables changes smoothly with time, given their current values.',
	},
	pde: {
		label: 'PDE',
		definition:
			'A partial differential equation: a rule for how a field (temperature, concentration, height) changes across space and time.',
	},
	'reaction-diffusion': {
		label: 'reaction–diffusion',
		definition:
			'A PDE model where local chemistry creates or destroys material while diffusion spreads it across a grid — patterns like spots and stripes can emerge.',
	},
	diffusion: {
		label: 'diffusion',
		definition:
			'Spreading from high concentration to low — neighbours exchange material until a field smooths out or patterns form when reaction fights back.',
	},
	'euler-method': {
		label: 'Euler method',
		definition:
			'The simplest numerical integrator: take the current slope, step forward a tiny amount, repeat. Crude but easy to read on a screen.',
	},
	integrator: {
		label: 'integrator',
		definition:
			'A numerical recipe that advances a dynamical system one time step at a time when you cannot solve the equations by hand.',
	},
	trajectory: {
		label: 'trajectory',
		definition:
			'The path a system follows through its state space as time advances — what you see when a trail grows on the canvas.',
	},
	orbit: {
		label: 'orbit',
		definition:
			'The sequence of states produced by repeating an update rule — either one continuous flow or one discrete map step after another.',
		context: 'Fractal posts use “orbit” for the path of z under z² + c; ODE posts use it for the trail in phase space.',
	},
	manifold: {
		label: 'manifold',
		definition:
			'A shape that looks flat up close but can curve globally — like how Earth’s surface is 2D locally even though it sits in 3D space.',
		context: 'Hopf fibers live on S³, a 3D manifold embedded in four dimensions.',
	},
	'stereographic-projection': {
		label: 'stereographic projection',
		definition:
			'A way to flatten a sphere (or higher-dimensional sphere) onto a plane by projecting from one pole. Circles can become circles or lines depending on where they sit.',
	},
	'julia-set': {
		label: 'Julia set',
		definition:
			'The boundary between points that escape to infinity and points that stay bounded under repeated squaring with a fixed complex parameter c.',
	},
	'mandelbrot-set': {
		label: 'Mandelbrot set',
		definition:
			'The set of complex parameters c for which starting at z = 0 and iterating z² + c stays bounded — the famous cardioid-and-bulbs map.',
	},
	bifurcation: {
		label: 'bifurcation',
		definition:
			'A parameter threshold where the long-term behaviour of a system splits — a stable point might turn into a cycle, or a cycle into chaos.',
	},
	'lyapunov-exponent': {
		label: 'Lyapunov exponent',
		definition:
			'A number that measures how fast nearby trajectories separate on average. Positive usually means sensitive dependence (chaos).',
	},
	chaos: {
		label: 'chaos',
		definition:
			'In math, “chaos” means deterministic rules that still look unpredictable — small changes in the starting point lead to widely different paths.',
		context: 'Not random noise: the equations are fixed; the sensitivity is the surprise.',
	},
	'sensitive-dependence': {
		label: 'sensitive dependence',
		definition:
			'When two trajectories that start almost on top of each other eventually diverge — the butterfly effect in equations.',
	},
	'discrete-map': {
		label: 'discrete map',
		definition:
			'A rule that jumps from one state to the next in discrete steps — no continuous time or dt, just repeated application.',
		context: 'Hopalong, Hénon, and many 2D attractors on the gallery are maps, not ODE flows.',
	},
	'quadratic-map': {
		label: 'quadratic map',
		definition:
			'An iteration built from squaring (plus adding a constant), like z² + c — the engine behind Mandelbrot and Julia sets.',
	},
	iteration: {
		label: 'iteration',
		definition:
			'Applying the same update rule again and again — each step uses the output of the last one.',
		context: 'Fractal shaders count how many squarings an orbit survives before escaping.',
	},
	fractal: {
		label: 'fractal',
		definition:
			'A shape or pattern that stays detailed when you zoom in — self-similar structure at many scales.',
	},
	'complex-plane': {
		label: 'complex plane',
		definition:
			'A 2D plane where each point is a complex number (real + imaginary part) — the canvas Mandelbrot and Julia shaders paint on.',
	},
	'escape-time': {
		label: 'escape time',
		definition:
			'How many iterations a point survives before blowing past a cutoff radius — used to colour pixels outside a fractal set.',
	},
	bailout: {
		label: 'bailout',
		definition:
			'The radius cutoff in a fractal loop: once |z| exceeds it, the orbit is treated as escaped and the pixel gets a grey shade.',
	},
	'vector-field': {
		label: 'vector field',
		definition:
			'At each point in space, an arrow saying which direction and how fast the flow would move — the right-hand side of an ODE system.',
	},
	'limit-cycle': {
		label: 'limit cycle',
		definition:
			'A closed loop in state space that nearby trajectories spiral toward — a repeating rhythm the system settles into.',
	},
	'periodic-orbit': {
		label: 'periodic orbit',
		definition:
			'A path that returns to exactly the same state after finite time and repeats forever — a perfect loop in the math.',
	},
	'steady-state': {
		label: 'steady state',
		definition:
			'A fixed point or pattern that no longer changes once transients die out — the system’s long-term resting value or shape.',
	},
	equilibrium: {
		label: 'equilibrium',
		definition:
			'A state where all rates of change are zero — nothing moves until something perturbs it.',
	},
	laplacian: {
		label: 'Laplacian',
		definition:
			'A operator that measures how much a field at one spot differs from its neighbours — the spreading term in heat and reaction–diffusion PDEs.',
	},
	'turing-pattern': {
		label: 'Turing pattern',
		definition:
			'Spots, stripes, or mottling that emerge when a fast-diffusing inhibitor and slow activator react on a grid — named after Alan Turing’s 1952 paper.',
	},
	autocatalytic: {
		label: 'autocatalytic',
		definition:
			'A reaction where the product helps make more of itself — a chemical feedback loop that can oscillate or pattern with diffusion.',
	},
	'activator-inhibitor': {
		label: 'activator–inhibitor',
		definition:
			'A pair where one chemical turns production on and another turns it down — timing their diffusion rates can create Turing-style patterns.',
	},
	'neumann-boundary': {
		label: 'Neumann boundary',
		definition:
			'Edge condition where the field’s slope across the border is zero — as if the domain ended with a mirror instead of wrapping around.',
	},
	convection: {
		label: 'convection',
		definition:
			'Fluid motion driven by hot regions rising and cool regions sinking — Lorenz stripped this down to three ODEs as a toy model.',
	},
	'implicit-surface': {
		label: 'implicit surface',
		definition:
			'A surface defined by f(x, y, z) = 0 instead of parameter formulas — you test whether each point satisfies the equation.',
	},
	'parametric-surface': {
		label: 'parametric surface',
		definition:
			'A surface traced by (x, y, z) formulas in one or two parameters — like sliding two knobs to walk across a sheet.',
	},
	curvature: {
		label: 'curvature',
		definition:
			'How sharply a curve or surface bends — tight bends have high curvature, flat patches have almost none.',
	},
	genus: {
		label: 'genus',
		definition:
			'A count of holes through a closed surface — a sphere has genus 0, a doughnut has genus 1.',
	},
	knot: {
		label: 'knot',
		definition:
			'A closed loop embedded in 3D that cannot be untangled without cutting — distinct knots are different ways of tying that loop.',
	},
	shader: {
		label: 'shader',
		definition:
			'A small GPU program that runs per pixel or vertex — fractal pages use one to iterate z² + c for every screen point in parallel.',
	},
} satisfies Record<string, GlossaryEntry>

export type GlossarySlug = keyof typeof GLOSSARY_TERMS

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
	if (Object.prototype.hasOwnProperty.call(GLOSSARY_TERMS, slug)) {
		return GLOSSARY_TERMS[slug as GlossarySlug]
	}
	return undefined
}
