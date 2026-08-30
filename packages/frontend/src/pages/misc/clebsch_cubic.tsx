import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { CLEBSCH_MAX_POINTS, sampleClebschCloud } from '../../utils/clebschCubic'

const ClebschCubic = () => {
	const dispatch = useAppDispatch()
	const seeded = useRef(false)
	const cloud = useMemo(() => sampleClebschCloud(), [])
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

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(CLEBSCH_MAX_POINTS, delta)
		updateProgressUI(toDraw, CLEBSCH_MAX_POINTS)
		checkCompletion(toDraw, CLEBSCH_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={CLEBSCH_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.7]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
		/>
	)
}

ClebschCubic.getDescription = () => (
	<>
		Clebsch’s diagonal cubic (1871) is a smooth degree-3 algebraic surface on which all 27 of the
		classic lines are real (10 Eckardt points where three meet). Classical Chaos plots the Hunt /
		Nordstrand affine zero set in 3D.
		<br />
		<br />
		<strong>Equation</strong> (affine zero set):
		<BlockMath
			math={
				'81(x^{3}+y^{3}+z^{3})-189(x^{2}y+x^{2}z+xy^{2}+xz^{2}+y^{2}z+yz^{2})+54xyz+126(xy+xz+yz)-9(x^{2}+y^{2}+z^{2})-9(x+y+z)+1=0'
			}
		/>
		<br />
		Projectively: <InlineMath math="\sum_{i=0}^{4} x_i = 0" /> and{' '}
		<InlineMath math="\sum_{i=0}^{4} x_i^{3} = 0" /> in <InlineMath math="\mathbb{P}^{4}" />.
		<br />
		Transport <code>n</code> reveals points.
	</>
)

export default ClebschCubic
