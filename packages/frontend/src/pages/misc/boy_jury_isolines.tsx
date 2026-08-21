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
	clampBlend,
	clampDetail,
	clampHomotopy,
	clampRays,
	clampRings,
	sampleBoyMorphIsolines,
} from '../../utils/boySurface'

const MAX_RINGS = 80
const MAX_RAYS = 96
const MAX_DETAIL = 280
const MAX_POINTS = (MAX_RINGS + MAX_RAYS) * MAX_DETAIL

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
				bryant: { initialValue: 1, min: 0, max: 1, step: 0.01 },
				rings: { initialValue: 40, min: 8, max: MAX_RINGS, step: 1 },
				rays: { initialValue: 48, min: 12, max: MAX_RAYS, step: 1 },
				detail: { initialValue: 200, min: 64, max: MAX_DETAIL, step: 4 },
			},
			examples: [
				{ k: 0, bryant: 0, rings: 40, rays: 48, detail: 200 },
				{ k: 1, bryant: 0, rings: 40, rays: 48, detail: 200 },
				{ k: 1, bryant: 0.5, rings: 40, rays: 48, detail: 200 },
				{ k: 1, bryant: 1, rings: 48, rays: 64, detail: 240 },
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
	const bryant = clampBlend(data.bryant ?? datData.options.bryant.initialValue)
	const rings = clampRings(data.rings ?? datData.options.rings.initialValue)
	const rays = clampRays(data.rays ?? datData.options.rays.initialValue)
	const detail = clampDetail(data.detail ?? datData.options.detail.initialValue)
	const cloud = useMemo(
		() => sampleBoyMorphIsolines(rings, rays, detail, k, bryant),
		[rings, rays, detail, k, bryant],
	)

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
		Two morph axes on a shared polar wire:
		<br />
		<code>k</code>: Roman (<InlineMath math="0" />) → Morin–Apéry Boy (<InlineMath math="1" />
		).
		<br />
		<code>bryant</code>: Apéry petals → Bryant–Kusner three-balls (your reference).
		<br />
		<br />
		<BlockMath math={'p=(1-b)\\,P_{\\mathrm{Ap\\acute{e}ry}}(k)+b\\,P_{\\mathrm{Bryant}}'} />
		<br />
		<code>rings</code> / <code>rays</code> / <code>detail</code> = wire density. Examples: Roman, Apéry,
		mid-blend, Bryant.
		<br />
		Transport <code>n</code> reveals points.
	</>
)

export default BoyJuryIsolines
