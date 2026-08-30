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
	POLYNOMIAL_TYPE_C_COEFF_KEYS,
	POLYNOMIAL_TYPE_C_DEFAULTS,
	POLYNOMIAL_TYPE_C_PRESET_DRIFT,
	POLYNOMIAL_TYPE_C_PRESET_SHELL,
	samplePolynomialTypeCCloud,
	type PolynomialTypeCCoeffs,
} from '../../utils/polynomialMaps'

const optionRange = (initialValue: number) => ({
	initialValue,
	min: -2,
	max: 2,
	step: 0.0001,
})

const coeffsFromData = (
	data: Record<string, number | undefined>,
	options: TDatData['options'],
): PolynomialTypeCCoeffs => {
	const coeffs = { ...POLYNOMIAL_TYPE_C_DEFAULTS }
	for (const key of POLYNOMIAL_TYPE_C_COEFF_KEYS) {
		coeffs[key] = data[key] ?? options[key].initialValue
	}
	return coeffs
}

const PolynomialTypeC = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const cloudRef = useRef<ReturnType<typeof samplePolynomialTypeCCloud> | null>(null)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: Object.fromEntries(
				POLYNOMIAL_TYPE_C_COEFF_KEYS.map((key) => [
					key,
					optionRange(POLYNOMIAL_TYPE_C_DEFAULTS[key]),
				]),
			),
			examples: [
				{ ...POLYNOMIAL_TYPE_C_DEFAULTS },
				{ ...POLYNOMIAL_TYPE_C_PRESET_SHELL },
				{ ...POLYNOMIAL_TYPE_C_PRESET_DRIFT },
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

	const coeffs = useMemo(
		() => coeffsFromData(data, datData.options),
		[data, datData.options],
	)
	const cloud = useMemo(() => samplePolynomialTypeCCloud(coeffs), [coeffs])
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

PolynomialTypeC.getDescription = () => (
	<>
		Polynomial Type C is a per-axis quadratic map: each coordinate has six coefficients (
		<InlineMath math="a\ldots f" /> for that axis), exposed as knobs <code>xa</code>…<code>zf</code>.
		<br />
		<br />
		<strong>Definition</strong> (same shape on each axis):
		<BlockMath math={'x_{n+1} = a_x + x(b_x + c_x x + d_x y) + y(e_x + f_x y)'} />
		<BlockMath math={'y_{n+1} = a_y + y(b_y + c_y y + d_y z) + z(e_y + f_y z)'} />
		<BlockMath math={'z_{n+1} = a_z + z(b_z + c_z z + d_z x) + x(e_z + f_z x)'} />
		<br />
		Seed <InlineMath math="(0,0,0)" />. Coral→teal ribbon by direction; transport <code>n</code> reveals
		the cloud.
	</>
)

export default PolynomialTypeC
