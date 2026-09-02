import type { ComponentType } from 'react'

export type VizPageModule = {
	default: ComponentType
}

export const vizPageLoaders: Record<string, () => Promise<VizPageModule>> = {
	bedhead_attractor: () => import('../pages/attractors/bedhead_attractor'),
	bedhead_attractor_3d: () => import('../pages/attractors/bedhead_attractor_3d'),
	bogdanov_map: () => import('../pages/maps/bogdanov_map'),
	brusselator: () => import('../pages/misc/brusselator'),
	brusselator_rd: () => import('../pages/misc/brusselator_rd'),
	clifford_attractor: () => import('../pages/attractors/clifford_attractor'),
	peter_de_jong_attractor: () => import('../pages/attractors/peter_de_jong_attractor'),
	fractal_dream_attractor: () => import('../pages/attractors/fractal_dream_attractor'),
	'gumowski-mira_attractor': () => import('../pages/attractors/gumowski_mira_attractor'),
	henon_map: () => import('../pages/maps/henon_map'),
	hopalong_attractor: () => import('../pages/attractors/hopalong_attractor'),
	hopalong_attractor_positive: () => import('../pages/attractors/hopalong_attractor_positive'),
	hopalong_attractor_additive: () => import('../pages/attractors/hopalong_attractor_add'),
	hopalong_attractor_sinusoidal: () => import('../pages/attractors/hopalong_attractor_sinusoidal'),
	gingerbread_man: () => import('../pages/attractors/gingerbread_man'),
	ikeda_map: () => import('../pages/maps/ikeda_map'),
	lorenz_attractor: () => import('../pages/attractors/lorenz_attractor'),
	lorenz_86: () => import('../pages/attractors/lorenz_86'),
	modified_chua_attractor: () => import('../pages/attractors/modified_chua_attractor'),
	aizawa_attractor: () => import('../pages/attractors/aizawa_attractor'),
	halvorsen_attractor: () => import('../pages/attractors/halvorsen_attractor'),
	peter_de_jong_attractor_3d: () => import('../pages/attractors/peter_de_jong_attractor_3d'),
	thomas_attractor: () => import('../pages/attractors/thomas_attractor'),
	polynomial_abs: () => import('../pages/attractors/polynomial_abs'),
	polynomial_type_a: () => import('../pages/attractors/polynomial_type_a'),
	polynomial_type_b: () => import('../pages/attractors/polynomial_type_b'),
	polynomial_type_c: () => import('../pages/attractors/polynomial_type_c'),
	mandelbrot_set: () => import('../pages/maps/mandelbrot_set'),
	julia_set: () => import('../pages/maps/julia_set'),
	sierpinski_triangle: () => import('../pages/fractals/sierpinski_triangle'),
	hilbert_curve: () => import('../pages/fractals/hilbert_curve'),
	calabi_yau: () => import('../pages/misc/calabi_yau'),
	gyroid: () => import('../pages/misc/gyroid'),
	barth_sextic: () => import('../pages/misc/barth_sextic'),
	schwarz_p: () => import('../pages/misc/schwarz_p'),
	dini_surface: () => import('../pages/misc/dini_surface'),
	roman_surface: () => import('../pages/misc/roman_surface'),
	enneper_surface: () => import('../pages/misc/enneper_surface'),
	boy_surface: () => import('../pages/misc/boy_surface'),
	figure_knots: () => import('../pages/misc/figure_knots'),
	svensson_attractor: () => import('../pages/attractors/svensson_attractor'),
	svensson_attractor_3d: () => import('../pages/attractors/svensson_attractor_3d'),
	clebsch_cubic: () => import('../pages/misc/clebsch_cubic'),
	costa_surface: () => import('../pages/misc/costa_surface'),
	hopf_fibration: () => import('../pages/misc/hopf_fibration'),
	perlin_noise: () => import('../pages/misc/perlin_noise'),
}

export function loadVizPage(slug: string): Promise<VizPageModule> {
	const load = vizPageLoaders[slug]
	if (!load) {
		return Promise.reject(new Error(`no viz page loader for "${slug}"`))
	}
	return load()
}
