import BedheadAttractor from '../pages/attractors/bedhead_attractor'
import BogdanovMap from '../pages/maps/bogdanov_map'
import Test from '../pages/maps/bogdanov_map'
import Brusselator from '../pages/misc/brusselator'
import CliffordAttractor from '../pages/attractors/clifford_attractor'
import FractalDreamAttractor from '../pages/attractors/fractal_dream_attractor'
import GumowskiMiraAttractor from '../pages/attractors/gumowski_mira_attractor'
import HenonMap from '../pages/maps/henon_map'
import HopalongAttractor from '../pages/attractors/hopalong_attractor'
import HopalongAttractorPositive from '../pages/attractors/hopalong_attractor_positive'
import HopalongAttractorAdditive from '../pages/attractors/hopalong_attractor_add'
import HopalongAttractorSin from '../pages/attractors/hopalong_attractor_sin'

export type TRoutes = {
	name: string
	element: {
		(props: { setDescription: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>> }): JSX.Element
	}
}[]

export const routesV1 = []

export function addRoute(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	console.log({ target, propertyKey, descriptor })
}

export const BaseRoute = null

const routes: TRoutes = [
	{
		name: 'Bedhead Attractor',
		element: BedheadAttractor,
	},
	{
		name: 'Bogdanov Map',
		element: BogdanovMap,
	},
	// {
	// 	name: 'Brusselator',
	// 	element: Brusselator,
	// },
	{
		name: 'Clifford Attractor',
		element: CliffordAttractor,
	},
	{
		name: 'Fractal Dream Attractor',
		element: FractalDreamAttractor,
	},
	{
		name: 'Gumowski-Mira Attractor',
		element: GumowskiMiraAttractor,
	},
	{
		name: 'Henon Map',
		element: HenonMap,
	},
	{
		name: 'Hopalong Attractor',
		element: HopalongAttractor,
	},
	{
		name: 'Hopalong Attractor Positive',
		element: HopalongAttractorPositive,
	},
	{
		name: 'Hopalong Attractor Additive',
		element: HopalongAttractorAdditive,
	},
	{
		name: 'Hopalong Attractor Sin',
		element: HopalongAttractorSin,
	},
]

export default routes
