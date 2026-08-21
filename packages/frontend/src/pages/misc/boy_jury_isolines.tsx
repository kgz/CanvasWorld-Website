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
	clampDetail,
	clampHomotopy,
	sampleBoyIsolines,
} from '../../utils/boySurface'

/** Max isolines per family (u and v). Fixed GPU buffer so `n` stays stable. */
const MAX_CURVES = 80
const MAX_DETAIL = 280
const MAX_POINTS = (MAX_CURVES + MAX_CURVES) * MAX_DETAIL

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
				/** How many separate u- and v-wires (sparse cage ↔ dense cage). */
				curves: { initialValue: 40, min: 16, max: MAX_CURVES, step: 1 },
				/** Points along each wire — crank this for tight lobe packing. */
				detail: { initialValue: 200, min: 64, max: MAX_DETAIL, step: 4 },
			},
			examples: [
				{ k: 1, curves: 28, detail: 120 },
				{ k: 1, curves: 40, detail: 200 },
				{ k: 1, curves: 36, detail: 280 },
				{ k: 0.5, curves: 48, detail: 220 },
				{ k: 0, curves: 40, detail: 200 },
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
	const detail = clampDetail(data.detail ?? datData.options.detail.initialValue)
	const cloud = useMemo(() => sampleBoyIsolines(curves, curves, detail, k), [curves, detail, k])

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
		<code>curves</code> = how many separate wires.
		<br />
		<code>detail</code> = points packed along each wire — that is what tightens the three lobes into dense
		balls (try the third example: medium curves, max detail).
		<br />
		Transport <code>n</code> reveals points.
	</>
)

export default BoyJuryIsolines
