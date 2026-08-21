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
	clampCurves,
	clampHomotopy,
	sampleBoyIsolines,
} from '../../utils/boySurface'

/** Baked samples along each isoline — density knob is `curves` only. */
const DETAIL = 160
/** Max isolines per family (u and v). Keeps GPU buffer size fixed so `n` stays stable. */
const MAX_CURVES = 80
const MAX_POINTS = (MAX_CURVES + MAX_CURVES) * DETAIL

const BoyJuryIsolines = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { currentProgressRef, manualProgress, setManualProgress } = useAnimation()
	const seeded = useRef(false)
	const prevCount = useRef(0)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 32000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				k: { initialValue: 1, min: 0, max: 1, step: 0.01 },
				curves: { initialValue: 48, min: 16, max: MAX_CURVES, step: 1 },
			},
			examples: [
				{ k: 0, curves: 40 },
				{ k: 0.5, curves: 48 },
				{ k: 1, curves: 48 },
				{ k: 1, curves: 72 },
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
	const curves = clampCurves(data.curves ?? datData.options.curves.initialValue)
	const cloud = useMemo(() => sampleBoyIsolines(curves, curves, DETAIL, k), [curves, k])

	useEffect(() => {
		seeded.current = false
		const prev = prevCount.current
		if (prev > 0 && cloud.count !== prev) {
			const frac = Math.min(1, currentProgressRef.current / prev)
			const next = Math.max(100, frac * cloud.count)
			currentProgressRef.current = next
			if (manualProgress !== null) {
				setManualProgress(Math.min(cloud.count, Math.max(100, Math.floor(frac * cloud.count))))
			}
		}
		prevCount.current = cloud.count
	}, [cloud, currentProgressRef, manualProgress, setManualProgress])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.fill(0)
			colors.fill(0)
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = Math.min(cloud.count, calculateParticlesToDraw(cloud.count, delta))
		updateProgressUI(toDraw, cloud.count)
		checkCompletion(toDraw, cloud.count)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={MAX_POINTS}
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
		Morin–Apéry family: scrub <InlineMath math="k" /> from Roman (<InlineMath math="k=0" />) to Boy
		(<InlineMath math="k=1" />
		). Isoline wire (legacy points).
		<br />
		<br />
		<BlockMath math={'\\mathrm{denom}=2-k\\sqrt{2}\\,\\sin 3u\\,\\sin 2v'} />
		<br />
		UI <code>curves</code> is how many constant-u and constant-v isolines (wire density). Transport{' '}
		<code>n</code> reveals points — stays put when you change <code>curves</code>.
	</>
)

export default BoyJuryIsolines
