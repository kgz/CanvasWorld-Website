import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { sampleBoyCloud } from '../../utils/boySurface'

const BoyJuryPoints = () => {
	const dispatch = useAppDispatch()
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

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

	const cloud = useMemo(() => sampleBoyCloud(96, 96), [])

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
			pointSize={1.5}
			tick={tick}
			cameraPosition={[0, 0, 4.2]}
			autoRotate={!isScreenshotMode()}
		/>
	)
}

BoyJuryPoints.getDescription = () => (
	<>
		Temporary jury page: points/dots render of the Morin–Apéry Boy surface (legacy attractor look), not
		the lit mesh.
	</>
)

export default BoyJuryPoints
