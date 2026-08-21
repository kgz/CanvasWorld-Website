import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	clampSpan,
	DEFAULT_SPAN,
	ENNEPER_DETAIL,
	ENNEPER_MAX_POINTS,
	ENNEPER_NU,
	ENNEPER_NV,
	sampleEnneperIsolines,
	SPAN_MAX,
	SPAN_MIN,
} from '../../utils/enneperSurface'

const EnneperSurface = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const cloudRef = useRef<ReturnType<typeof sampleEnneperIsolines> | null>(null)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 32000,
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
			setData(
				Object.fromEntries(
					Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]),
				),
			),
		)
	}, [datData, dispatch])

	const span = clampSpan(data.span ?? datData.options.span.initialValue)
	const cloud = useMemo(
		() => sampleEnneperIsolines(ENNEPER_NU, ENNEPER_NV, ENNEPER_DETAIL, span),
		[span],
	)
	if (cloudRef.current !== cloud) {
		cloudRef.current = cloud
		seeded.current = false
	}

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		const next = cloudRef.current
		if (next && !seeded.current) {
			positions.set(next.positions)
			colors.set(next.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(ENNEPER_MAX_POINTS, delta)
		updateProgressUI(toDraw, ENNEPER_MAX_POINTS)
		checkCompletion(toDraw, ENNEPER_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={ENNEPER_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.4]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
		/>
	)
}

EnneperSurface.getDescription = () => (
	<>
		Enneper’s minimal surface (1864) is a complete immersed minimal surface with a polynomial
		parametrization. UV isoline particle wire — no lit mesh. Default domain is large enough that the
		self-intersections read.
		<br />
		<br />
		<strong>Parametrization</strong> on <InlineMath math="u,v \in [-\mathrm{span},\mathrm{span}]" />:
		<BlockMath math={'x = u - u^3/3 + u v^2'} />
		<BlockMath math={'y = v - v^3/3 + v u^2'} />
		<BlockMath math={'z = u^2 - v^2'} />
		<br />
		UI <InlineMath math="\mathrm{span}" /> is the |u|,|v| domain. Transport <code>n</code> reveals
		points.
	</>
)

export default EnneperSurface
