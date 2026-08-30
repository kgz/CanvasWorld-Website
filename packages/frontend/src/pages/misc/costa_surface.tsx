import { BlockMath, InlineMath } from 'react-katex'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	clampMargin,
	COSTA_MAX_POINTS,
	DEFAULT_MARGIN,
	MARGIN_MAX,
	MARGIN_MIN,
	sampleCostaCloud,
} from '../../utils/costaSurface'

const CostaSurface = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				margin: { initialValue: DEFAULT_MARGIN, min: MARGIN_MIN, max: MARGIN_MAX, step: 0.01 },
			},
			examples: [
				{ margin: 0.05 },
				{ margin: DEFAULT_MARGIN },
				{ margin: 0.12 },
				{ margin: 0.18 },
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

	const margin = clampMargin(data.margin ?? datData.options.margin.initialValue)
	const dMargin = useDeferredValue(margin)
	const cloud = useMemo(() => sampleCostaCloud(dMargin), [dMargin])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(COSTA_MAX_POINTS, delta)
		updateProgressUI(toDraw, COSTA_MAX_POINTS)
		checkCompletion(toDraw, COSTA_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={COSTA_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.7]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
		/>
	)
}

CostaSurface.getDescription = () => (
	<>
		Costa–Hoffman–Meeks is a complete embedded minimal surface of genus 1 with three ends — two
		catenoidal and one planar. Classical Chaos plots a truncated piece from the Weierstrass chart on
		the square torus.
		<br />
		<br />
		<strong>Coordinates</strong> on <InlineMath math="u,v \in (\mathrm{margin},\,1-\mathrm{margin})" />{' '}
		use Weierstrass <InlineMath math="\zeta" /> and <InlineMath math="\wp" /> on{' '}
		<InlineMath math="\mathbb{Z}[i]" />. Punctures at <InlineMath math="0,\,1/2,\,i/2" /> mark where
		the surface runs to infinity; margin keeps the sample away from them.
		<br />
		<br />
		<BlockMath
			math={
				'x_3 = \\frac{\\sqrt{2\\pi}}{4}\\log\\left|\\frac{\\wp(z)-e_1}{\\wp(z)+e_1}\\right|,\\quad z=u+iv'
			}
		/>
		<br />
		UI <InlineMath math="\mathrm{margin}" /> truncates the three ends. Transport <code>n</code>{' '}
		reveals points.
	</>
)

export default CostaSurface
