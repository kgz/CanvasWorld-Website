import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildEnneperMesh, clampSpan, DEFAULT_SPAN, SPAN_MAX, SPAN_MIN } from '../../utils/enneperSurface'

const EnneperSurface = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 10000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				span: { initialValue: DEFAULT_SPAN, min: SPAN_MIN, max: SPAN_MAX, step: 0.05 },
			},
			examples: [{ span: 1.6 }, { span: DEFAULT_SPAN }, { span: 2.0 }, { span: 2.4 }],
		}),
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch])

	const span = clampSpan(data.span ?? datData.options.span.initialValue)
	const mesh = useMemo(() => buildEnneperMesh(span), [span])

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

EnneperSurface.getDescription = () => (
	<>
		Enneper’s minimal surface (1864) is a complete immersed minimal surface with polynomial parametrization. The default
		domain is large enough that the self-intersections read.
		<br />
		<br />
		<strong>Parametrization</strong> on <InlineMath math="u,v \in [-\mathrm{span},\mathrm{span}]" />:
		<BlockMath math={'x = u - u^3/3 + u v^2'} />
		<BlockMath math={'y = v - v^3/3 + v u^2'} />
		<BlockMath math={'z = u^2 - v^2'} />
		<br />
		UI <InlineMath math="\mathrm{span}" /> is the |u|,|v| domain. Transport <code>n</code> reveals triangles.
	</>
)

export default EnneperSurface
