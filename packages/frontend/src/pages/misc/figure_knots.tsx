import { BlockMath, InlineMath } from 'react-katex'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	clampA,
	clampFreq,
	FIGURE_KNOTS_MAX_POINTS,
	sampleFigureKnotCloud,
} from '../../utils/figureKnots'

const FigureKnots = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 32000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 7.4, min: 0.05, max: 20, step: 0.1 },
				b: { initialValue: 8, min: 0, max: 20, step: 0.1 },
				c: { initialValue: 9.1, min: 0, max: 20, step: 0.1 },
				d: { initialValue: 8, min: 0, max: 20, step: 0.1 },
			},
			examples: [
				{ a: 7.4, b: 8, c: 9.1, d: 8 },
				{ a: 2, b: 2, c: 3, d: 4 },
				{ a: 3, b: 3, c: 5, d: 7 },
				{ a: 1.5, b: 5, c: 8, d: 3 },
			],
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

	const a = clampA(data.a ?? datData.options.a.initialValue)
	const b = clampFreq(data.b ?? datData.options.b.initialValue)
	const c = clampFreq(data.c ?? datData.options.c.initialValue)
	const d = clampFreq(data.d ?? datData.options.d.initialValue)
	const dA = useDeferredValue(a)
	const dB = useDeferredValue(b)
	const dC = useDeferredValue(c)
	const dD = useDeferredValue(d)
	const cloud = useMemo(() => sampleFigureKnotCloud(dA, dB, dC, dD), [dA, dB, dC, dD])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(FIGURE_KNOTS_MAX_POINTS, delta)
		updateProgressUI(toDraw, FIGURE_KNOTS_MAX_POINTS)
		checkCompletion(toDraw, FIGURE_KNOTS_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={FIGURE_KNOTS_MAX_POINTS}
			pointSize={1.1}
			tick={tick}
			cameraPosition={[2.8, 1.9, 3.6]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.3}
		/>
	)
}

FigureKnots.getDescription = () => (
	<>
		Figure knots are a torus-knot-style parametric curve: tube radius <InlineMath math="a" /> wound
		by frequencies <InlineMath math="b,c,d" />. Dense particle samples along <InlineMath math="t" />; not
		a lit tube mesh.
		<br />
		<br />
		<strong>Parametrization:</strong>
		<BlockMath
			math={
				'x=(a+\\cos(b t))\\cos(c t),\\quad y=(a+\\cos(b t))\\sin(c t),\\quad z=\\sin(d t)'
			}
		/>
		<br />
		Defaults: <InlineMath math="a=7.4,\ b=8,\ c=9.1,\ d=8" />. Coral→teal ribbon along{' '}
		<InlineMath math="t" />; transport <code>n</code> reveals points along the curve.
	</>
)

export default FigureKnots
