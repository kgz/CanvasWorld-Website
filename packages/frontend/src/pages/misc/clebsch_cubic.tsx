import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildClebschMesh } from '../../utils/clebschCubic'

const ClebschCubic = () => {
	const dispatch = useAppDispatch()
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 14000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {},
			examples: [],
		}),
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(setData({}))
	}, [datData, dispatch])

	const mesh = useMemo(() => buildClebschMesh(), [])

	const tick = (delta: number) => {
		const total = mesh.indices.length
		const toDraw = calculateParticlesToDraw(total, delta)
		updateProgressUI(toDraw, total)
		checkCompletion(toDraw, total)
		return toDraw
	}

	return (
		<Base<TData>
			drawMode="mesh"
			positions={mesh.positions}
			indices={mesh.indices}
			colors={mesh.colors}
			progressTick={tick}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
			cameraPosition={[0, 0, 3.7]}
		/>
	)
}

ClebschCubic.getDescription = () => (
	<>
		Clebsch’s diagonal cubic (1871) is a smooth degree-3 algebraic surface on which all 27 of the
		classic lines are real (10 Eckardt points where three meet). This page meshes the Hunt /
		Nordstrand affine chart — a lit triangle mesh, not a particle wire.
		<br />
		<br />
		<strong>Equation</strong> (affine zero set):
		<BlockMath
			math={
				'81(x^{3}+y^{3}+z^{3})-189(x^{2}y+x^{2}z+xy^{2}+xz^{2}+y^{2}z+yz^{2})+54xyz+126(xy+xz+yz)-9(x^{2}+y^{2}+z^{2})-9(x+y+z)+1=0'
			}
		/>
		<br />
		Projectively: <InlineMath math="\sum_{i=0}^{4} x_i = 0" /> and{' '}
		<InlineMath math="\sum_{i=0}^{4} x_i^{3} = 0" /> in <InlineMath math="\mathbb{P}^{4}" />.
		<br />
		Transport <code>n</code> reveals triangles.
	</>
)

export default ClebschCubic
