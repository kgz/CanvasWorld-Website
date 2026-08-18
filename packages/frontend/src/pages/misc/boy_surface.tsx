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
			cameraPosition={[0, 0, 4.2]}
		/>
	)
}

BoySurface.getDescription = () => (
	<>
		Boy’s surface (Werner Boy, 1901) is an immersion of the real projective plane{' '}
		<InlineMath math="\mathbb{RP}^2" /> in <InlineMath math="\mathbb{R}^3" />: a triple point and
		self-intersection curves, so it is not an embedding. This page uses Apéry’s trigonometric
		parametrization.
		<br />
		<br />
		<strong>Parametrization</strong> (Morin–Apéry) with <InlineMath math="u,v\in[0,\pi]" />:
		<BlockMath
			math={
				'x = \\bigl(\\sqrt{2}\\,\\cos 2u\\,\\cos^2 v + \\cos u\\,\\sin 2v\\bigr)/\\bigl(2-\\sqrt{2}\\,\\sin 3u\\,\\sin 2v\\bigr)'
			}
		/>
		<BlockMath
			math={
				'y = \\bigl(\\sqrt{2}\\,\\sin 2u\\,\\cos^2 v - \\sin u\\,\\sin 2v\\bigr)/\\bigl(2-\\sqrt{2}\\,\\sin 3u\\,\\sin 2v\\bigr)'
			}
		/>
		<BlockMath math={'z = 3\\cos^2 v\\,/\\,\\bigl(2-\\sqrt{2}\\,\\sin 3u\\,\\sin 2v\\bigr)'} />
		<br />
		Transport <code>n</code> reveals triangles.
	</>
)

export default BoySurface
