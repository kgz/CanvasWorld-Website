import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { clampBlend, clampHomotopy, sampleBoyMorphIsolines } from '../../utils/boySurface'

const RINGS = 48
const RAYS = 64
const DETAIL = 240
const NUM_PARTICLES = (RINGS + RAYS) * DETAIL

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
				bryant: { initialValue: 1, min: 0, max: 1, step: 0.01 },
			},
			examples: [
				{ k: 0, bryant: 0 },
				{ k: 1, bryant: 0 },
				{ k: 1, bryant: 0.5 },
				{ k: 1, bryant: 1 },
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
	const cloud = useMemo(() => sampleBoyMorphIsolines(RINGS, RAYS, DETAIL, k, bryant), [k, bryant])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
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
			numParticles={NUM_PARTICLES}
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
		<code>k</code>: Roman (<InlineMath math="0" />) → Morin–Apéry Boy (<InlineMath math="1" />
		).
		<br />
		<code>bryant</code>: Apéry petals → Bryant–Kusner three-balls.
		<br />
		<br />
		<BlockMath math={'p=(1-b)\\,P_{\\mathrm{Ap\\acute{e}ry}}(k)+b\\,P_{\\mathrm{Bryant}}'} />
		<br />
		Transport <code>n</code> reveals points.
	</>
)

export default BoyJuryIsolines
