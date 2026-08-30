import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	POLYNOMIAL_MAP_MAX_POINTS,
	POLYNOMIAL_TYPE_B_DEFAULTS,
	POLYNOMIAL_TYPE_B_PRESET_LACE,
	POLYNOMIAL_TYPE_B_PRESET_OPEN,
	samplePolynomialTypeBCloud,
} from '../../utils/polynomialMaps'

const paramRange = (initialValue: number) => ({
	initialValue,
	min: 0,
	max: 2,
	step: 0.0001,
})

const PolynomialTypeB = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const cloudRef = useRef<ReturnType<typeof samplePolynomialTypeBCloud> | null>(null)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: paramRange(POLYNOMIAL_TYPE_B_DEFAULTS.a),
				b: paramRange(POLYNOMIAL_TYPE_B_DEFAULTS.b),
				c: paramRange(POLYNOMIAL_TYPE_B_DEFAULTS.c),
				d: paramRange(POLYNOMIAL_TYPE_B_DEFAULTS.d),
				e: paramRange(POLYNOMIAL_TYPE_B_DEFAULTS.e),
				f: paramRange(POLYNOMIAL_TYPE_B_DEFAULTS.f),
			},
			examples: [
				{ ...POLYNOMIAL_TYPE_B_DEFAULTS },
				{ ...POLYNOMIAL_TYPE_B_PRESET_LACE },
				{ ...POLYNOMIAL_TYPE_B_PRESET_OPEN },
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
	const f = data.f ?? datData.options.f.initialValue
	const cloud = useMemo(() => samplePolynomialTypeBCloud(a, b, c, d, e, f), [a, b, c, d, e, f])
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
		const toDraw = calculateParticlesToDraw(POLYNOMIAL_MAP_MAX_POINTS, delta)
		updateProgressUI(toDraw, POLYNOMIAL_MAP_MAX_POINTS)
		checkCompletion(toDraw, POLYNOMIAL_MAP_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={POLYNOMIAL_MAP_MAX_POINTS}
			pointSize={isScreenshotMode() ? 1.35 : 1.15}
			tick={tick}
			cameraPosition={[0, 0, 2.2]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
		/>
	)
}

PolynomialTypeB.getDescription = () => (
	<>
		Polynomial Type B extends Type A with scale factors on each product term — six knobs on the same cyclic
		coupling.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = a + y_n - z_n (b y_n)'} />
		<BlockMath math={'y_{n+1} = c + z_n - x_n (d z_n)'} />
		<BlockMath math={'z_{n+1} = e + x_n - y_n (f x_n)'} />
		<br />
		Defaults: <InlineMath math="a=1.6691,\ b=1.0405,\ c=0.2818,\ d=0.2818,\ e=0,\ f=1.1055" />, seed{' '}
		<InlineMath math="(0,0,0)" />. Coral→teal ribbon by direction; transport <code>n</code> reveals the
		cloud.
	</>
)

export default PolynomialTypeB
