import type { GlossarySlug } from './terms'

export type GlossaryMatcher = {
	slug: GlossarySlug
	re: RegExp
}

/** Longer / more specific patterns first. */
export const GLOSSARY_MATCHERS: GlossaryMatcher[] = [
	{ slug: 'strange-attractor', re: /\bstrange attractors?\b/gi },
	{ slug: 'sensitive-dependence', re: /\bsensitive depend(?:ence|ent)\b/gi },
	{ slug: 'reaction-diffusion', re: /\breaction[\u2013-]diffusion\b/gi },
	{ slug: 'activator-inhibitor', re: /\bactivator[\u2013-]inhibitors?\b/gi },
	{ slug: 'stereographic-projection', re: /\bstereographic projections?\b/gi },
	{ slug: 'lyapunov-exponent', re: /\bLyapunov exponents?\b/gi },
	{ slug: 'chaos', re: /\bdeterministic chaos\b/gi },
	{ slug: 'chaos', re: /\bcontinuous-time chaos\b/gi },
	{ slug: 'chaos', re: /\blabyrinth chaos\b/gi },
	{ slug: 'mandelbrot-set', re: /\bMandelbrot sets?\b/gi },
	{ slug: 'euler-method', re: /\b(?:forward-)?Euler(?: method| step)?s?\b/gi },
	{ slug: 'julia-set', re: /\bJulia sets?\b/gi },
	{ slug: 'complex-plane', re: /\bcomplex planes?\b/gi },
	{ slug: 'escape-time', re: /\bescape times?\b/gi },
	{ slug: 'phase-plane', re: /\bphase planes?\b/gi },
	{ slug: 'phase-space', re: /\bphase spaces?\b/gi },
	{ slug: 'state-space', re: /\bstate spaces?\b/gi },
	{ slug: 'vector-field', re: /\bvector fields?\b/gi },
	{ slug: 'quadratic-map', re: /\bquadratic maps?\b/gi },
	{ slug: 'discrete-map', re: /\bdiscrete(?: \d+D)? maps?\b/gi },
	{ slug: 'periodic-orbit', re: /\bperiodic orbits?\b/gi },
	{ slug: 'limit-cycle', re: /\blimit cycles?\b/gi },
	{ slug: 'steady-state', re: /\bsteady states?\b/gi },
	{ slug: 'implicit-surface', re: /\bimplicit surfaces?\b/gi },
	{ slug: 'parametric-surface', re: /\bparametric surfaces?\b/gi },
	{ slug: 'neumann-boundary', re: /\bNeumann(?:\/reflective)? boundary(?: conditions?)?\b/gi },
	{ slug: 'neumann-boundary', re: /\bNeumann\b/g },
	{ slug: 'turing-pattern', re: /\bTuring(?:[- ]style)?(?: patterns?| mottling)?\b/gi },
	{ slug: 'integrator', re: /\bnumerical integrators?\b/gi },
	{ slug: 'isosurface', re: /\bisosurfaces?\b/gi },
	{ slug: 'bifurcation', re: /\bbifurcations?\b/gi },
	{ slug: 'polynomial', re: /\bpolynomials?\b/gi },
	{ slug: 'autocatalytic', re: /\bautocatalytic\b/gi },
	{ slug: 'equilibrium', re: /\bequilibri(?:um|a)\b/gi },
	{ slug: 'convection', re: /\bconvections?\b/gi },
	{ slug: 'manifold', re: /\bmanifolds?\b/gi },
	{ slug: 'laplacian', re: /\b[Ll]aplacians?\b/g },
	{ slug: 'curvature', re: /\bcurvatures?\b/gi },
	{ slug: 'trajectory', re: /\btrajectories?\b/gi },
	{ slug: 'attractor', re: /\battractors?\b/gi },
	{ slug: 'iteration', re: /\biterations?\b/gi },
	{ slug: 'fractal', re: /\bfractals?\b/gi },
	{ slug: 'integrator', re: /\bintegrators?\b/gi },
	{ slug: 'diffusion', re: /\bdiffusions?\b/gi },
	{ slug: 'orbit', re: /\borbits?\b/gi },
	{ slug: 'bailout', re: /\bbailouts?\b/gi },
	{ slug: 'genus', re: /\bgenus\b/gi },
	{ slug: 'shader', re: /\bshaders?\b/gi },
	{ slug: 'knot', re: /\bknots?\b/gi },
	{ slug: 'chaos', re: /\bchaos\b/gi },
	{ slug: 'ode', re: /\bODEs?\b/g },
	{ slug: 'pde', re: /\bPDEs?\b/g },
]

export const GLOSSARY_PROTECTED_PHRASES = [
	'Classical Chaos',
	'Int. J. Bifurc. Chaos',
	'Bifurc. Chaos',
] as const
