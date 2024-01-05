import BedheadAttractor from "../pages/bedhead_attractor";
import BogdanovMap from "../pages/bogdanov_map";
import Test from "../pages/bogdanov_map";
import Brusselator from "../pages/brusselator";
import CliffordAttractor from "../pages/clifford_attractor";
import FractalDreamAttractor from "../pages/fractal_dream_attractor";
import GumowskiMiraAttractor from "../pages/gumowski_mira_attractor";

type TRoutes = {
    name: string,
    element: { ({ setBodyJSX }): JSX.Element },
}[]



const routes: TRoutes = [
    {
        name: 'Bedhead Attractor',
        element: BedheadAttractor,
    },
    {
        name: 'Bogdanov Map',
        element: BogdanovMap
    },
    {
        name: 'Brusselator',
        element: Brusselator
    },
    {
        name: 'Clifford Attractor',
        element: CliffordAttractor
    },
    {
        name: 'Fractal Dream Attractor',
        element: FractalDreamAttractor
    },
    {
        name: 'Gumowski-Mira Attractor',
        element: GumowskiMiraAttractor
    }
]

export default routes