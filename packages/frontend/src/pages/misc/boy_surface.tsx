import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildBoyMesh } from '../../utils/boySurface'

const BoySurface = () => {
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

	const mesh = useMemo(() => buildBoyMesh(), [])

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

BoySurface.getDescription = () => (
	<>
		Boy’s surface (Werner Boy, 1901) is an immersion of the real projective plane{' '}
		<InlineMath math="\mathbb{RP}^2" /> in <InlineMath math="\mathbb{R}^3" />: a triple point and
		self-intersection curves, so it is not an embedding. This page uses the Bryant–Kusner
		parametrization on the unit disk.
		<br />
		<br />
		<strong>Parametrization</strong> for <InlineMath math="\|w\|\le 1" />:
		<BlockMath
			math={
				'g_1=-\\tfrac{3}{2}\\operatorname{Im}\\bigl[w(1-w^4)/(w^6+\\sqrt{5}w^3-1)\\bigr]'
			}
		/>
		<BlockMath
			math={
				'g_2=-\\tfrac{3}{2}\\operatorname{Re}\\bigl[w(1+w^4)/(w^6+\\sqrt{5}w^3-1)\\bigr]'
			}
		/>
		<BlockMath
			math={'g_3=\\operatorname{Im}\\bigl[(1+w^6)/(w^6+\\sqrt{5}w^3-1)\\bigr]-\\tfrac{1}{2}'}
		/>
		<BlockMath math={'(x,y,z)=(g_1,g_2,g_3)/(g_1^2+g_2^2+g_3^2)'} />
		<br />
		Transport <code>n</code> reveals triangles.
	</>
)

export default BoySurface
