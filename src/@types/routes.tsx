import BedheadAttractor from "../pages/bedhead_attractor";
import Test from "../pages/test1";

type TRoutes = {
    name: string,
    element: { (setMenuBody: CallableFunction): JSX.Element },
}[]



const routes: TRoutes = [
    {
        name: 'Bedhead Attractor',
        element: BedheadAttractor,
    },
    {
        name: 'test',
        element: Test
    }
]

export default routes