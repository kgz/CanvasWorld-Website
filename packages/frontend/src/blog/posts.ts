export type NotebookPost = {
	id: string
	tag: string
	title: string
	excerpt: string
	meta: string
	featured?: boolean
	thumbSlug?: string
	href?: string
}

/** Sample notes from the OD blog.html prototype until MDX (#86) lands. */
export const NOTEBOOK_POSTS: NotebookPost[] = [
	{
		id: 'lorenz-never-closes',
		tag: 'Attractors',
		title: 'Why the Lorenz attractor never closes',
		excerpt:
			'Three coupled equations, one seed, and a trajectory that folds back on itself forever without ever repeating. A short tour of sensitivity, butterfly wings, and why "chaotic" doesn\'t mean "random."',
		meta: 'Aug 2026 · 6 min read',
		featured: true,
		thumbSlug: 'lorenz_attractor',
	},
	{
		id: 'render-loop',
		tag: 'Engineering',
		title: 'Rendering nine thousand points at sixty frames a second',
		excerpt:
			'How the canvas stage batches trajectory segments, ages their opacity, and keeps a single 2D context fast enough to feel alive.',
		meta: 'Jul 2026 · 5 min read',
	},
	{
		id: 'mandelbrot-escape',
		tag: 'Fractals',
		title: 'Escape time: how the Mandelbrot boundary gets drawn',
		excerpt:
			'Every pixel is a tiny experiment — iterate, check the bound, count the steps. The boundary is where the answer stops being obvious.',
		meta: 'Jun 2026 · 7 min read',
	},
	{
		id: 'hud-void',
		tag: 'Design notes',
		title: "A HUD that doesn't compete with the void",
		excerpt:
			'Swapping the default mrdoob-style perf stats for a quiet mono readout that earns its place in the chrome instead of shouting over it.',
		meta: 'Jun 2026 · 4 min read',
	},
	{
		id: 'l-systems',
		tag: 'Fractals',
		title: 'L-systems: a grammar for trees',
		excerpt:
			'Rewrite a string a dozen times, hand it to a turtle, and a branching structure falls out — no geometry required, just substitution rules.',
		meta: 'May 2026 · 5 min read',
	},
	{
		id: 'halvorsen',
		tag: 'Attractors',
		title: 'Halvorsen and the cost of symmetry',
		excerpt:
			'A cyclically symmetric system that still manages to look nothing like its own reflection. Notes on picking constants that stay in bounds.',
		meta: 'Apr 2026 · 5 min read',
	},
	{
		id: 'params-interface',
		tag: 'Design notes',
		title: 'Parameters as the primary interface',
		excerpt:
			'Why every visualization ships with sliders before it ships with anything else — and how that decision shaped the side-panel layout.',
		meta: 'Mar 2026 · 4 min read',
	},
]
