import type { RootState } from '@react-three/fiber'
import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { clampHomotopy, sampleBoyScanline } from '../../utils/boySurface'

const BoyJuryLines = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				k: { initialValue: 1, min: 0, max: 1, step: 0.01 },
			},
			examples: [
				{ k: 0 },
				{ k: 0.25 },
				{ k: 0.5 },
				{ k: 0.75 },
				{ k: 1 },
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

	const k = clampHomotopy(data.k ?? datData.options.k.initialValue)
	const cloud = useMemo(() => sampleBoyScanline(200, 140, k), [k])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		_state: RootState,
		delta: number,
	) => {
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
			tick={tick}
			drawMode="line"
			lineOpacity={0.92}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
			cameraPosition={[0, 0, 4.2]}
		/>
	)
}

BoyJuryLines.getDescription = () => (
	<>
		Legacy line-scan of the Morin–Apéry family. Scrub <InlineMath math="k" /> from Roman (
		<InlineMath math="k=0" />) to Boy (<InlineMath math="k=1" />
		).
		<br />
		<br />
		<BlockMath math={'\\mathrm{denom}=2-k\\sqrt{2}\\,\\sin 3u\\,\\sin 2v'} />
		<br />
		Transport <code>n</code> reveals the trail.
	</>
)

export default BoyJuryLines
