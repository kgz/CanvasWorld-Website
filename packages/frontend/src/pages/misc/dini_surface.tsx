import { BlockMath, InlineMath } from 'react-katex'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { clampRadius, clampTwist, DINI_MAX_POINTS, sampleDiniCloud } from '../../utils/diniSurface'

const DiniSurface = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 1, min: 0.15, max: 3, step: 0.01 },
				b: { initialValue: 0.2, min: 0, max: 1.2, step: 0.01 },
			},
			examples: [
				{ a: 1, b: 0.2 },
				{ a: 1, b: 0 },
				{ a: 1.4, b: 0.35 },
				{ a: 0.7, b: 0.12 },
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

	const radius = clampRadius(data.a ?? datData.options.a.initialValue)
	const twist = clampTwist(data.b ?? datData.options.b.initialValue)
	const dRadius = useDeferredValue(radius)
	const dTwist = useDeferredValue(twist)
	const cloud = useMemo(() => sampleDiniCloud(dRadius, dTwist), [dRadius, dTwist])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(DINI_MAX_POINTS, delta)
		updateProgressUI(toDraw, DINI_MAX_POINTS)
		checkCompletion(toDraw, DINI_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={DINI_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.7]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
		/>
	)
}

DiniSurface.getDescription = () => (
	<>
		Dini’s surface (1866) is a helicoid of a tractrix: a constant-negative-curvature
		(pseudospherical) surface with a helical twist. When the twist vanishes it is a band of the
		pseudosphere. UV isoline particle wire — no lit mesh.
		<br />
		<br />
		<strong>Parametrization</strong> with radius <InlineMath math="a" /> and twist{' '}
		<InlineMath math="b" />:
		<BlockMath
			math={
				'x = a\\cos u\\,\\sin v,\\quad y = a\\sin u\\,\\sin v,\\quad z = a\\bigl(\\cos v + \\ln\\tan(v/2)\\bigr) + b u'
			}
		/>
		<br />
		UI <InlineMath math="a" /> is the radius, <InlineMath math="b" /> the helical pitch. Transport{' '}
		<code>n</code> reveals points.
	</>
)

export default DiniSurface
