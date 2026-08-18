import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildRomanSurfaceMesh } from '../../utils/romanSurface'

const RomanSurface = () => {
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

	const mesh = useMemo(() => buildRomanSurfaceMesh(), [])

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

RomanSurface.getDescription = () => (
	<>
		Steiner’s Roman surface is a self-intersecting immersion of the real projective plane{' '}
		<InlineMath math="\mathbb{RP}^2" />. This page uses the standard trigonometric parametrization
		with <InlineMath math="a=1" />.
		<br />
		<br />
		<strong>Parametrization</strong> for <InlineMath math="u,v\in[0,\pi]" />:
		<BlockMath
			math={
				'x = a^2\\cos u\\sin u\\sin v,\\quad y = a^2\\cos u\\sin u\\cos v,\\quad z = a^2\\cos^2 u\\cos v\\sin v'
			}
		/>
		<br />
		Transport <code>n</code> reveals triangles.
	</>
)

export default RomanSurface
