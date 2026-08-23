import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	buildCostaMesh,
	clampMargin,
	DEFAULT_MARGIN,
	MARGIN_MAX,
	MARGIN_MIN,
} from '../../utils/costaSurface'

const CostaSurface = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 10000,
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
	const mesh = useMemo(() => buildCostaMesh(margin), [margin])

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

CostaSurface.getDescription = () => (
	<>
		Costa–Hoffman–Meeks (Costa 1984; Hoffman–Meeks embeddedness) is a complete embedded minimal
		surface of genus 1 with three ends — two catenoidal and one planar. This page draws a truncated
		lit mesh of the classical Weierstrass–ζ/℘ chart on the square torus.
		<br />
		<br />
		<strong>Coordinates</strong> on <InlineMath math="u,v \in (\mathrm{margin},\,1-\mathrm{margin})" />{' '}
		use Weierstrass <InlineMath math="\zeta" /> and <InlineMath math="\wp" /> on{' '}
		<InlineMath math="\mathbb{Z}[i]" /> (Gray / Lin closed form). Punctures at{' '}
		<InlineMath math="0,\,1/2,\,i/2" /> are cut by the margin.
		<br />
		<br />
		<BlockMath
			math={
				'x_3 = \\frac{\\sqrt{2\\pi}}{4}\\log\\left|\\frac{\\wp(z)-e_1}{\\wp(z)+e_1}\\right|,\\quad z=u+iv'
			}
		/>
		<br />
		UI <InlineMath math="\mathrm{margin}" /> truncates the three ends. Transport <code>n</code>{' '}
		reveals triangles.
	</>
)

export default CostaSurface
