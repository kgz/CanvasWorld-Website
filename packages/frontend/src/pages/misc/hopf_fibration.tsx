import { BlockMath, InlineMath } from 'react-katex'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	clampFibers,
	clampStereo,
	HOPF_MAX_POINTS,
	sampleHopfCloud,
} from '../../utils/hopfFibration'

const HopfFibration = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				fibers: { initialValue: 48, min: 4, max: 120, step: 1 },
				stereo: { initialValue: 0.85, min: 0.15, max: 1, step: 0.01 },
			},
			examples: [
				{ fibers: 24, stereo: 0.7 },
				{ fibers: 48, stereo: 0.85 },
				{ fibers: 72, stereo: 0.95 },
				{ fibers: 96, stereo: 0.6 },
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

	const fibers = clampFibers(data.fibers ?? datData.options.fibers.initialValue)
	const stereo = clampStereo(data.stereo ?? datData.options.stereo.initialValue)
	const dFibers = useDeferredValue(fibers)
	const dStereo = useDeferredValue(stereo)
	const cloud = useMemo(() => sampleHopfCloud(dFibers, dStereo), [dFibers, dStereo])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(HOPF_MAX_POINTS, delta)
		updateProgressUI(toDraw, HOPF_MAX_POINTS)
		checkCompletion(toDraw, HOPF_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={HOPF_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 4.4]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.3}
		/>
	)
}

HopfFibration.getDescription = () => (
	<>
		The Hopf fibration (Heinz Hopf, 1931) is a map{' '}
		<InlineMath math="S^3 \to S^2" /> whose fibers are circles. Every point of the 2-sphere has a
		circle of preimages on the 3-sphere; those circles are pairwise linked. Classical Chaos draws
		stereographic images of a grid of fibers as a particle wire — no lit mesh.
		<br />
		<br />
		<strong>Hopf coordinates</strong> on <InlineMath math="S^3" /> with{' '}
		<InlineMath math="\eta \in [0,\pi/2]" /> and phases <InlineMath math="\xi_1,\xi_2" />:
		<BlockMath
			math={
				'( \\sin\\eta\\,\\cos\\xi_1,\\; \\sin\\eta\\,\\sin\\xi_1,\\; \\cos\\eta\\,\\cos\\xi_2,\\; \\cos\\eta\\,\\sin\\xi_2 )'
			}
		/>
		Fiber over base <InlineMath math="(\eta,\varphi)" />: <InlineMath math="\xi_1=t" />,{' '}
		<InlineMath math="\xi_2=t+\varphi" />. Stereographic projection from the <InlineMath math="w" />
		-pole uses strength <code>stereo</code>:
		<BlockMath math={'\\frac{(x,y,z)}{1 - k\\,w}'} />
		<br />
		<code>fibers</code> sets how many base circles to sample. Scrub trail length <code>n</code> to
		reveal more of the cage.
	</>
)

export default HopfFibration
