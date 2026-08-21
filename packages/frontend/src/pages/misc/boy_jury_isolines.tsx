import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	clampCurves,
	clampDetail,
	clampHomotopy,
	sampleBoyIsolines,
} from '../../utils/boySurface'

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
				curves: { initialValue: 48, min: 16, max: 80, step: 1 },
				detail: { initialValue: 160, min: 64, max: 280, step: 4 },
			},
			examples: [
				{ k: 0, curves: 40, detail: 140 },
				{ k: 0.25, curves: 48, detail: 160 },
				{ k: 0.5, curves: 52, detail: 180 },
				{ k: 0.75, curves: 56, detail: 180 },
				{ k: 1, curves: 64, detail: 200 },
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

	const cloud = useMemo(
		() => sampleBoyIsolines(curves, curves, detail, k),
		[curves, detail, k],
	)

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
		Morin–Apéry family of immersions of <InlineMath math="\mathbb{RP}^2" />: scrub{' '}
		<InlineMath math="k" /> from the Roman surface (<InlineMath math="k=0" />) to Boy’s surface (
		<InlineMath math="k=1" />
		). Isoline wire (legacy points), not the lit mesh.
		<br />
		<br />
		<strong>Homotopy</strong> (same UV chart as MathWorld / mathcurve):
		<BlockMath
			math={
				'\\mathrm{denom}=2-k\\sqrt{2}\\,\\sin 3u\\,\\sin 2v'
			}
		/>
		<br />
		UI <InlineMath math="k" /> is the family parameter, <code>curves</code> how many u/v isolines,{' '}
		<code>detail</code> samples along each. Transport <code>n</code> reveals points.
	</>
)

export default BoyJuryIsolines
