import type { RootState } from '@react-three/fiber'
import { InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { sampleBoyScanline } from '../../utils/boySurface'

const BoyJuryLines = () => {
	const dispatch = useAppDispatch()
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {},
			examples: [],
		}),
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(setData({}))
	}, [datData, dispatch])

	const cloud = useMemo(() => sampleBoyScanline(), [])

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
			cameraPosition={[0, 0, 2.85]}
		/>
	)
}

BoyJuryLines.getDescription = () => (
	<>
		Jury page: line-scan trail of Morin–Apéry Boy’s surface (immersion of{' '}
		<InlineMath math="\mathbb{RP}^2" /> in <InlineMath math="\mathbb{R}^3" />
		). Legacy GPU line strip like Lorenz — not mesh. Temporary — for render-mode comparison only.
		<br />
		<br />
		Transport <code>n</code> reveals the scanline trail.
	</>
)

export default BoyJuryLines
