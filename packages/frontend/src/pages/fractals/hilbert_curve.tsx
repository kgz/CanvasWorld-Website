import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TParticleProps } from '../../@types/gui'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { resolveParticleCount } from '../../modules/embedMode'
import {
	hilbertGridSize,
	hilbertPointCount,
	hilbertWorldPoint,
} from '../../utils/hilbert'
import Base from '../_base'

const MIN_ORDER = 3
const MAX_ORDER = 9
const DEFAULT_ORDER = 7
const FRAME_SPAN = 190
const TRAIL_TIP = 80

function clampOrder(raw: number | undefined): number {
	if (raw === undefined) {
		return DEFAULT_ORDER
	}
	return Math.min(MAX_ORDER, Math.max(MIN_ORDER, Math.round(raw)))
}

const HilbertCurve = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

	const datData = useMemo(
		(): TDatData => ({
			options: {
				order: {
					initialValue: DEFAULT_ORDER,
					min: MIN_ORDER,
					max: MAX_ORDER,
					step: 1,
				},
			},
			examples: [{ order: 5 }, { order: 7 }, { order: 8 }],
		}),
		[],
	)

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

	const order = clampOrder(data.order)
	const curveLen = hilbertPointCount(order)
	const n = hilbertGridSize(order)
	const cellSize = FRAME_SPAN / Math.max(n - 1, 1)

	const tick: TParticleProps<Record<string, number>>['tick'] = (
		positions,
		colors,
		_state,
		delta,
	) => {
		const totalParticles = positions.length / EDimensions.TWO_D
		const drawn = Math.min(calculateParticlesToDraw(totalParticles, delta), totalParticles)

		for (let i = 0; i < totalParticles; i++) {
			if (i < drawn) {
				const { x, y } = hilbertWorldPoint(i, n, cellSize)
				positions.set([x, y], i * EDimensions.TWO_D)

				if (i >= drawn - TRAIL_TIP) {
					colors.set([1.0, 1.0, 0.0], i * 3)
				} else {
					const color = new THREE.Color()
					color.setHSL(0.75 * (1 - i / Math.max(totalParticles - 1, 1)), 1, 0.5)
					colors.set([color.r, color.g, color.b], i * 3)
				}
			} else {
				positions.set([9999, 9999], i * EDimensions.TWO_D)
				colors.set([0, 0, 0], i * 3)
			}
		}

		updateProgressUI(drawn, totalParticles)
		checkCompletion(drawn, totalParticles)

		return drawn
	}

	return (
		<Base
			key={order}
			dimension={EDimensions.TWO_D}
			numParticles={resolveParticleCount(curveLen)}
			tick={tick}
			pointSize={1.15}
			cameraPosition={[0, 0, 280]}
		/>
	)
}

HilbertCurve.getDescription = () => (
	<>
		The Hilbert curve is a continuous space-filling curve: as order rises it snakes through every
		cell of a square grid while staying a single path. Classical Chaos maps Hilbert index{' '}
		<code>i</code> to a grid cell with the classic bit-twiddle (archive <code>hindex2xy</code>) and
		draws those cells as particles in index order.
		<br />
		<br />
		<strong>Order</strong> <code>k</code> uses an <code>N = 2^k</code> board and{' '}
		<code>N²</code> points. Default <code>k = {DEFAULT_ORDER}</code> (
		<code>N = {hilbertGridSize(DEFAULT_ORDER)}</code>).
		<br />
		<br />
		Hue walks the path; the newest tip is yellow. Scrub <code>n</code> to grow or retract the
		curve.
		<br />
		<br />
		<strong>Limits:</strong>
		<BlockMath math={`k \\in [${MIN_ORDER}, ${MAX_ORDER}]`} />
	</>
)

export default HilbertCurve
