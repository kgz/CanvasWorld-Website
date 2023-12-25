import BedheadAttractor from "../pages/bedhead_attractor";
import BogdanovMap from "../pages/bogdanov_map";
import Test from "../pages/bogdanov_map";
import Brusselator from "../pages/brusselator";

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
        name: 'brusselator',
        element: Brusselator
    }
]

export default routes