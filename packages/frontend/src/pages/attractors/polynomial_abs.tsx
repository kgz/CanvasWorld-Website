import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	POLYNOMIAL_ABS_COEFF_KEYS,
	POLYNOMIAL_ABS_DEFAULTS,
	POLYNOMIAL_ABS_MAX_POINTS,
	POLYNOMIAL_ABS_PRESET_WOVEN,
	POLYNOMIAL_ABS_PRESET_FOLDED,
	samplePolynomialAbsCloud,
	type PolynomialAbsCoeffs,
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
): PolynomialAbsCoeffs => {
	const coeffs = { ...POLYNOMIAL_ABS_DEFAULTS }
	for (const key of POLYNOMIAL_ABS_COEFF_KEYS) {
		coeffs[key] = data[key] ?? options[key].initialValue
	}
	return coeffs
}

const PolynomialAbs = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const cloudRef = useRef<ReturnType<typeof samplePolynomialAbsCloud> | null>(null)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: Object.fromEntries(
				POLYNOMIAL_ABS_COEFF_KEYS.map((key) => [key, optionRange(POLYNOMIAL_ABS_DEFAULTS[key])]),
			),
			examples: [
				{ ...POLYNOMIAL_ABS_DEFAULTS },
				{ ...POLYNOMIAL_ABS_PRESET_FOLDED },
				{ ...POLYNOMIAL_ABS_PRESET_WOVEN },
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
	const cloud = useMemo(() => samplePolynomialAbsCloud(coeffs), [coeffs])
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
		const toDraw = calculateParticlesToDraw(POLYNOMIAL_ABS_MAX_POINTS, delta)
		updateProgressUI(toDraw, POLYNOMIAL_ABS_MAX_POINTS)
		checkCompletion(toDraw, POLYNOMIAL_ABS_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={POLYNOMIAL_ABS_MAX_POINTS}
			pointSize={isScreenshotMode() ? 1.35 : 1.15}
			tick={tick}
			cameraPosition={[0, 0, 2.2]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
		/>
	)
}

PolynomialAbs.getDescription = () => (
	<>
		Polynomial ABS is a 3D absolute-value affine map: each new coordinate is a linear combination of{' '}
		<InlineMath math="x,y,z" /> and <InlineMath math="|x|,|y|,|z|" />. Seven coeffs per axis (
		<code>xa</code>…<code>zg</code>).
		<br />
		<br />
		<strong>Definition</strong> (same shape on each axis):
		<BlockMath
			math={
				'x_{n+1} = a_x + b_x x + c_x y + d_x z + e_x |x| + f_x |y| + g_x |z|'
			}
		/>
		<BlockMath
			math={
				'y_{n+1} = a_y + b_y x + c_y y + d_y z + e_y |x| + f_y |y| + g_y |z|'
			}
		/>
		<BlockMath
			math={
				'z_{n+1} = a_z + b_z x + c_z y + d_z z + e_z |x| + f_z |y| + g_z |z|'
			}
		/>
		<br />
		Seed <InlineMath math="(0,0,0)" />. Coral→teal ribbon by direction (same family as Schwarz P). Transport{' '}
		<code>n</code> reveals the cloud.
	</>
)

export default PolynomialAbs
