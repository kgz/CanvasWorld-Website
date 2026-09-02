import type { ComponentType } from 'react'
import catalog from '@cw/routes'
import BedheadAttractor from '../pages/attractors/bedhead_attractor'
import BedheadAttractor3d from '../pages/attractors/bedhead_attractor_3d'
import BogdanovMap from '../pages/maps/bogdanov_map'
import CliffordAttractor from '../pages/attractors/clifford_attractor'
import PeterDeJongAttractor from '../pages/attractors/peter_de_jong_attractor'
import FractalDreamAttractor from '../pages/attractors/fractal_dream_attractor'
import GumowskiMiraAttractor from '../pages/attractors/gumowski_mira_attractor'
import HenonMap from '../pages/maps/henon_map'
import HopalongAttractor from '../pages/attractors/hopalong_attractor'
import HopalongAttractorPositive from '../pages/attractors/hopalong_attractor_positive'
import HopalongAttractorAdditive from '../pages/attractors/hopalong_attractor_add'
import HopalongAttractorSinusoidal from '../pages/attractors/hopalong_attractor_sinusoidal'
import GingerbreadMan from '../pages/attractors/gingerbread_man'
import IkedaMap from '../pages/maps/ikeda_map'
import LorenzAttractor from '../pages/attractors/lorenz_attractor'
import Lorenz86Attractor from '../pages/attractors/lorenz_86'
import ModifiedChuaAttractor from '../pages/attractors/modified_chua_attractor'
import AizawaAttractor from '../pages/attractors/aizawa_attractor'
import HalvorsenAttractor from '../pages/attractors/halvorsen_attractor'
import PeterDeJongAttractor3d from '../pages/attractors/peter_de_jong_attractor_3d'
import ThomasAttractor from '../pages/attractors/thomas_attractor'
import PolynomialAbs from '../pages/attractors/polynomial_abs'
import PolynomialTypeA from '../pages/attractors/polynomial_type_a'
import PolynomialTypeB from '../pages/attractors/polynomial_type_b'
import PolynomialTypeC from '../pages/attractors/polynomial_type_c'
import MandelbrotSet from '../pages/maps/mandelbrot_set'
import JuliaSet from '../pages/maps/julia_set'
import Brusselator from '../pages/misc/brusselator'
import BrusselatorRd from '../pages/misc/brusselator_rd'
import SierpinskiTriangle from '../pages/fractals/sierpinski_triangle'
import HilbertCurve from '../pages/fractals/hilbert_curve'
import CalabiYau from '../pages/misc/calabi_yau'
import Gyroid from '../pages/misc/gyroid'
import BarthSextic from '../pages/misc/barth_sextic'
import SchwarzP from '../pages/misc/schwarz_p'
import DiniSurface from '../pages/misc/dini_surface'
import RomanSurface from '../pages/misc/roman_surface'
import EnneperSurface from '../pages/misc/enneper_surface'
import BoySurface from '../pages/misc/boy_surface'
import FigureKnots from '../pages/misc/figure_knots'
import SvenssonAttractor from '../pages/attractors/svensson_attractor'
import SvenssonAttractor3d from '../pages/attractors/svensson_attractor_3d'
import ClebschCubic from '../pages/misc/clebsch_cubic'
import CostaSurface from '../pages/misc/costa_surface'
import HopfFibration from '../pages/misc/hopf_fibration'
import PerlinNoise from '../pages/misc/perlin_noise'

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
	bedhead_attractor_3d: BedheadAttractor3d,
	bogdanov_map: BogdanovMap,
	brusselator: Brusselator,
	brusselator_rd: BrusselatorRd,
	clifford_attractor: CliffordAttractor,
	peter_de_jong_attractor: PeterDeJongAttractor,
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
	lorenz_86: Lorenz86Attractor,
	modified_chua_attractor: ModifiedChuaAttractor,
	aizawa_attractor: AizawaAttractor,
	halvorsen_attractor: HalvorsenAttractor,
	peter_de_jong_attractor_3d: PeterDeJongAttractor3d,
	thomas_attractor: ThomasAttractor,
	polynomial_abs: PolynomialAbs,
	polynomial_type_a: PolynomialTypeA,
	polynomial_type_b: PolynomialTypeB,
	polynomial_type_c: PolynomialTypeC,
	mandelbrot_set: MandelbrotSet,
	julia_set: JuliaSet,
	sierpinski_triangle: SierpinskiTriangle,
	hilbert_curve: HilbertCurve,
	calabi_yau: CalabiYau,
	gyroid: Gyroid,
	barth_sextic: BarthSextic,
	schwarz_p: SchwarzP,
	dini_surface: DiniSurface,
	roman_surface: RomanSurface,
	enneper_surface: EnneperSurface,
	boy_surface: BoySurface,
	figure_knots: FigureKnots,
	svensson_attractor: SvenssonAttractor,
	svensson_attractor_3d: SvenssonAttractor3d,
	clebsch_cubic: ClebschCubic,
	costa_surface: CostaSurface,
	hopf_fibration: HopfFibration,
	perlin_noise: PerlinNoise,
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

export default routes
