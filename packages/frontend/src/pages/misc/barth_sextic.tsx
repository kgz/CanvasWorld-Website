import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildBarthMesh } from '../../utils/barthSextic'

const BarthSextic = () => {
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

	const mesh = useMemo(() => buildBarthMesh(), [])

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

BarthSextic.getDescription = () => (
	<>
		Barth’s sextic (1996) is a degree-6 algebraic surface with icosahedral symmetry and 65 ordinary
		double points (15 of them at infinity in <InlineMath math="\mathbb{RP}^3" />). This page meshes
		the usual affine chart.
		<br />
		<br />
		<strong>Equation</strong> with golden ratio <InlineMath math="\tau=(1+\sqrt{5})/2" />:
		<BlockMath
			math={
				'4(\\tau^2 x^2-y^2)(\\tau^2 y^2-z^2)(\\tau^2 z^2-x^2) - (1+2\\tau)(x^2+y^2+z^2-1)^2 = 0'
			}
		/>
		<br />
		Transport <code>n</code> reveals triangles.
	</>
)

export default BarthSextic
