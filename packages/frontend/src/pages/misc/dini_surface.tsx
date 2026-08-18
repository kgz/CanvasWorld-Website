import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildDiniMesh, clampRadius, clampTwist } from '../../utils/diniSurface'

const DiniSurface = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 12000,
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

	const mesh = useMemo(() => buildDiniMesh(radius, twist), [radius, twist])

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

DiniSurface.getDescription = () => (
	<>
		Dini’s surface (1866) is a helicoid of a tractrix: a constant-negative-curvature
		(pseudospherical) surface with a helical twist. When the twist vanishes it is a band of the
		pseudosphere.
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
		<code>n</code> reveals triangles.
	</>
)

export default DiniSurface
