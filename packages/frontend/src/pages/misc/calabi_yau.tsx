import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildCalabiYauMesh, clampDegree, clampRes } from '../../utils/calabiYau'

const CalabiYau = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 8000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				n: { initialValue: 5, min: 2, max: 8, step: 1 },
				a: { initialValue: 0.4, min: 0, max: Math.PI, step: 0.01 },
				res: { initialValue: 18, min: 6, max: 36, step: 1 },
			},
			examples: [
				{ n: 5, a: 0.4, res: 18 },
				{ n: 3, a: 0.2, res: 22 },
				{ n: 4, a: 0.9, res: 18 },
				{ n: 6, a: 1.1, res: 16 },
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

	const degree = clampDegree(data.n ?? datData.options.n.initialValue)
	const proj = data.a ?? datData.options.a.initialValue
	const res = clampRes(data.res ?? datData.options.res.initialValue)

	const mesh = useMemo(() => buildCalabiYauMesh(degree, proj, res), [degree, proj, res])

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
			autoRotateSpeed={0.35}
			cameraPosition={[0, 0, 3.8]}
		/>
	)
}

CalabiYau.getDescription = () => (
	<>
		A 3D projection of a 2-real-dimensional slice of the Fermat quintic used in string-theory
		illustrations of Calabi–Yau 3-folds. The actual Calabi–Yau 3-fold is 6-real-dimensional; this
		page draws the Hanson slice of <InlineMath math="z_1^n + z_2^n = 1" /> in{' '}
		<InlineMath math="\mathbb{C}^2" />, not the full manifold.
		<br />
		<br />
		<strong>Parametrization</strong> (Hanson 1994), with branches{' '}
		<InlineMath math="k_1,k_2 \in \{0,\ldots,n-1\}" /> and{' '}
		<InlineMath math="x \in [0,\pi/2],\ y \in [-\pi/2,\pi/2]" />:
		<BlockMath math={'z_1 = e^{2\\pi i k_1/n}\\,\\bigl(\\cos(x+iy)\\bigr)^{2/n}'} />
		<BlockMath math={'z_2 = e^{2\\pi i k_2/n}\\,\\bigl(\\sin(x+iy)\\bigr)^{2/n}'} />
		<BlockMath
			math={
				'(X,Y,Z) = \\bigl(\\operatorname{Re} z_1,\\ \\operatorname{Re} z_2,\\ \\cos a\\cdot\\operatorname{Im} z_1 + \\sin a\\cdot\\operatorname{Im} z_2\\bigr)'
			}
		/>
		<br />
		UI <InlineMath math="n" /> is the degree (5 = quintic), <InlineMath math="a" /> is the
		imaginary mixing angle, <InlineMath math="res" /> is the grid per patch. Transport{' '}
		<code>n</code> reveals triangles. All <InlineMath math="n\\times n" /> Riemann patches are
		drawn.
	</>
)

export default CalabiYau
