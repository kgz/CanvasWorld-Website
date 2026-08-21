import { BlockMath, InlineMath } from 'react-katex'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	CALABI_MAX_POINTS,
	clampDegree,
	clampProj,
	sampleCalabiYauCloud,
} from '../../utils/calabiYau'

const CalabiYau = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				n: { initialValue: 5, min: 2, max: 8, step: 1 },
				a: { initialValue: 0.4, min: 0, max: Math.PI, step: 0.01 },
			},
			examples: [
				{ n: 5, a: 0.4 },
				{ n: 3, a: 0.2 },
				{ n: 4, a: 0.9 },
				{ n: 6, a: 1.1 },
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
	const proj = clampProj(data.a ?? datData.options.a.initialValue)
	const dDegree = useDeferredValue(degree)
	const dProj = useDeferredValue(proj)
	const cloud = useMemo(() => sampleCalabiYauCloud(dDegree, dProj), [dDegree, dProj])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(CALABI_MAX_POINTS, delta)
		updateProgressUI(toDraw, CALABI_MAX_POINTS)
		checkCompletion(toDraw, CALABI_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={CALABI_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.8]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.35}
		/>
	)
}

CalabiYau.getDescription = () => (
	<>
		A 3D projection of a 2-real-dimensional slice of the Fermat quintic used in string-theory
		illustrations of Calabi–Yau 3-folds. The actual Calabi–Yau 3-fold is 6-real-dimensional; this
		page draws the Hanson slice of <InlineMath math="z_1^n + z_2^n = 1" /> in{' '}
		<InlineMath math="\mathbb{C}^2" />, not the full manifold. Particle wire of the surface — no
		lit mesh.
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
		imaginary mixing angle. Transport <code>n</code> reveals points. All{' '}
		<InlineMath math="n\\times n" /> Riemann patches are drawn.
	</>
)

export default CalabiYau
