import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	SVENSSON_3D_DEFAULTS,
	SVENSSON_3D_MAX_POINTS,
	SVENSSON_3D_PRESET_BRAID,
	SVENSSON_3D_PRESET_SOFT,
	sampleSvensson3dCloud,
} from '../../utils/svensson3d'

const paramRange = (initialValue: number) => ({
	initialValue,
	min: -3,
	max: 3,
	step: 0.001,
})

const SvenssonAttractor3d = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const cloudRef = useRef<ReturnType<typeof sampleSvensson3dCloud> | null>(null)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: paramRange(SVENSSON_3D_DEFAULTS.a),
				b: paramRange(SVENSSON_3D_DEFAULTS.b),
				c: paramRange(SVENSSON_3D_DEFAULTS.c),
				d: paramRange(SVENSSON_3D_DEFAULTS.d),
				e: paramRange(SVENSSON_3D_DEFAULTS.e),
			},
			examples: [
				{ ...SVENSSON_3D_DEFAULTS },
				{ ...SVENSSON_3D_PRESET_SOFT },
				{ ...SVENSSON_3D_PRESET_BRAID },
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

	const a = data.a ?? datData.options.a.initialValue
	const b = data.b ?? datData.options.b.initialValue
	const c = data.c ?? datData.options.c.initialValue
	const d = data.d ?? datData.options.d.initialValue
	const e = data.e ?? datData.options.e.initialValue
	const cloud = useMemo(() => sampleSvensson3dCloud(a, b, c, d, e), [a, b, c, d, e])
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
		const toDraw = calculateParticlesToDraw(SVENSSON_3D_MAX_POINTS, delta)
		updateProgressUI(toDraw, SVENSSON_3D_MAX_POINTS)
		checkCompletion(toDraw, SVENSSON_3D_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={SVENSSON_3D_MAX_POINTS}
			pointSize={isScreenshotMode() ? 1.35 : 1.15}
			tick={tick}
			cameraPosition={[0, 0, 2.2]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
		/>
	)
}

SvenssonAttractor3d.getDescription = () => (
	<>
		A modified 3D Svensson map: the classic sine/cosine pair in <InlineMath math="x" /> and{' '}
		<InlineMath math="y" /> plus a third iterate in <InlineMath math="z" /> from the same trig
		legs. Discrete steps, not an ODE. Distinct from the flat 2D Svensson page.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = d \\sin(a x_n) - \\sin(b y_n)'} />
		<BlockMath math={'y_{n+1} = c \\cos(a x_n) + \\cos(b y_n)'} />
		<BlockMath math={'z_{n+1} = e \\sin(a x_n) + \\sin(b y_n)'} />
		<br />
		Defaults: <InlineMath math="a=-3,\ b=c=d=e=3" />, seed <InlineMath math="(0,0,0)" />.
		Coral→teal ribbon by direction; transport <code>n</code> reveals the cloud.
	</>
)

export default SvenssonAttractor3d
