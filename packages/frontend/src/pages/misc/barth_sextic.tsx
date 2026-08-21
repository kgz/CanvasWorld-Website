import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimation } from '../../context/AnimationContext'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	BARTH_PHI,
	clampMix,
	clampRadius,
	clampTau,
	sampleBarthCloud,
} from '../../utils/barthSextic'

const BarthSextic = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { currentProgressRef, manualProgress, setManualProgress } = useAnimation()
	const seeded = useRef(false)
	const prevCount = useRef(0)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				tau: { initialValue: BARTH_PHI, min: 1.05, max: 2.2, step: 0.01 },
				radius: { initialValue: 1, min: 0.45, max: 1.55, step: 0.01 },
				mix: { initialValue: 1, min: 0.25, max: 2.4, step: 0.01 },
			},
			examples: [
				{ tau: BARTH_PHI, radius: 1, mix: 1 },
				{ tau: 1.2, radius: 1, mix: 1 },
				{ tau: BARTH_PHI, radius: 0.7, mix: 1.4 },
				{ tau: BARTH_PHI, radius: 1.25, mix: 0.55 },
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

	const tau = clampTau(data.tau ?? datData.options.tau.initialValue)
	const radius = clampRadius(data.radius ?? datData.options.radius.initialValue)
	const mix = clampMix(data.mix ?? datData.options.mix.initialValue)
	const cloud = useMemo(() => sampleBarthCloud(tau, radius, mix), [tau, radius, mix])

	useEffect(() => {
		seeded.current = false
		const prev = prevCount.current
		if (prev > 0 && cloud.count !== prev) {
			const frac = Math.min(1, currentProgressRef.current / prev)
			currentProgressRef.current = Math.max(100, frac * cloud.count)
			if (manualProgress !== null) {
				setManualProgress(Math.min(cloud.count, Math.max(100, Math.floor(frac * cloud.count))))
			}
		}
		prevCount.current = cloud.count
	}, [cloud, currentProgressRef, manualProgress, setManualProgress])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(cloud.count, delta)
		updateProgressUI(toDraw, cloud.count)
		checkCompletion(toDraw, cloud.count)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={cloud.count}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.7]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
		/>
	)
}

BarthSextic.getDescription = () => (
	<>
		Barth’s sextic (1996): degree-6 affine chart with icosahedral symmetry and 65 nodes (50 real).
		Particle wire of the isosurface — no lit mesh.
		<br />
		<br />
		<strong>Field</strong> (classic at <InlineMath math="\tau=\varphi" />, <InlineMath math="R=1" />,{' '}
		<InlineMath math="m=1" />):
		<BlockMath
			math={
				'm\\cdot 4(\\tau^2 x^2-y^2)(\\tau^2 y^2-z^2)(\\tau^2 z^2-x^2) - (1+2\\tau)(x^2+y^2+z^2-R^2)^2 = 0'
			}
		/>
		<br />
		<code>tau</code>: golden lattice — <InlineMath math="\varphi" /> is true Barth; slide to warp spikes.
		<br />
		<code>radius</code>: sphere term <InlineMath math="R" /> — tightens / fattens the shell coupling.
		<br />
		<code>mix</code>: product vs sphere weight — higher = sharper spikes, lower = rounder.
		<br />
		Transport <code>n</code> reveals points.
	</>
)

export default BarthSextic
