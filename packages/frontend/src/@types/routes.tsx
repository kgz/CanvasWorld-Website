import type { ComponentType } from 'react'
import catalog from '@cw/routes'
import BedheadAttractor from '../pages/attractors/bedhead_attractor'
import BogdanovMap from '../pages/maps/bogdanov_map'
import CliffordAttractor from '../pages/attractors/clifford_attractor'
import FractalDreamAttractor from '../pages/attractors/fractal_dream_attractor'
import GumowskiMiraAttractor from '../pages/attractors/gumowski_mira_attractor'
import HenonMap from '../pages/maps/henon_map'
import HopalongAttractor from '../pages/attractors/hopalong_attractor'
import HopalongAttractorPositive from '../pages/attractors/hopalong_attractor_positive'
import HopalongAttractorAdditive from '../pages/attractors/hopalong_attractor_add'
import HopalongAttractorSinusoidal from '../pages/attractors/hopalong_attractor_sinusoidal'
import GingerbreadMan from '../pages/attractors/gingerbread_man'
import IkedaMap from '../pages/maps/ikeda Map'
import LorenzAttractor from '../pages/attractors/lorenz_attractor'
import MandelbrotSet from '../pages/maps/mandelbrot_set'
import JuliaSet from '../pages/maps/julia_set'
import Brusselator from '../pages/misc/brusselator'
import SierpinskiTriangle from '../pages/fractals/sierpinski_triangle'
import CalabiYau from '../pages/misc/calabi_yau'
import Gyroid from '../pages/misc/gyroid'

export type CatalogEntry = {
	slug: string
	title: string
	category: string
	description: string
	thumbnail: string
	renderMode: string
	active: boolean
}

export type TRoute = {
	name: string
	slug: string
	category: string
	description: string
	thumbnail: string
	renderMode: string
	element: ComponentType
}

export type TRoutes = TRoute[]

const components: Record<string, ComponentType> = {
	bedhead_attractor: BedheadAttractor,
	bogdanov_map: BogdanovMap,
	brusselator: Brusselator,
	clifford_attractor: CliffordAttractor,
	fractal_dream_attractor: FractalDreamAttractor,
	'gumowski-mira_attractor': GumowskiMiraAttractor,
	henon_map: HenonMap,
	hopalong_attractor: HopalongAttractor,
	hopalong_attractor_positive: HopalongAttractorPositive,
	hopalong_attractor_additive: HopalongAttractorAdditive,
	hopalong_attractor_sinusoidal: HopalongAttractorSinusoidal,
	gingerbread_man: GingerbreadMan,
	ikeda_map: IkedaMap,
	lorenz_attractor: LorenzAttractor,
	mandelbrot_set: MandelbrotSet,
	julia_set: JuliaSet,
	sierpinski_triangle: SierpinskiTriangle,
	calabi_yau: CalabiYau,
	gyroid: Gyroid,
}

const catalogEntries: CatalogEntry[] = catalog

const routes: TRoutes = catalogEntries
	.filter((entry) => entry.active)
	.map((entry) => {
		const element = components[entry.slug]
		if (!element) {
			throw new Error(`active catalog entry "${entry.slug}" has no FE component`)
		}
		return {
			name: entry.title,
			slug: entry.slug,
			category: entry.category,
			description: entry.description,
			thumbnail: entry.thumbnail,
			renderMode: entry.renderMode,
			element,
		}
	})

export const routesV1 = []

export const BaseRoute = null


export default routes
