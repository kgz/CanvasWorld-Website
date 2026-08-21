import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { clampHomotopy, sampleBoyIsolines } from '../../utils/boySurface'

const CURVES = 48
const DETAIL = 160

const BoyJuryIsolines = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 32000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				k: { initialValue: 1, min: 0, max: 1, step: 0.01 },
			},
			examples: [{ k: 0 }, { k: 0.25 }, { k: 0.5 }, { k: 0.75 }, { k: 1 }],
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
	const cloud = useMemo(() => sampleBoyIsolines(CURVES, CURVES, DETAIL, k), [k])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

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
			pointSize={1.2}
			tick={tick}
			cameraPosition={[0, 0, 4.2]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
		/>
	)
}

BoyJuryIsolines.getDescription = () => (
	<>
		Morin–Apéry family: scrub <InlineMath math="k" /> from the Roman surface (
		<InlineMath math="k=0" />) to Boy’s surface (<InlineMath math="k=1" />
		). Isoline wire (legacy points).
		<br />
		<br />
		<BlockMath math={'\\mathrm{denom}=2-k\\sqrt{2}\\,\\sin 3u\\,\\sin 2v'} />
		<br />
		Transport <code>n</code> reveals points.
	</>
)

export default BoyJuryIsolines
