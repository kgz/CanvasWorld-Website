import type { RootState } from '@react-three/fiber'

import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { useEffect, useMemo } from 'react'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { indexToXY, xyToIndex } from '../../utils/matrixCoords'
import { equilateralVertices, sierpinskiMember } from '../../utils/sierpinski'

const GRID_W = 500
const GRID_H = 400
const NUM_PARTICLES = GRID_W * GRID_H
/** Maps GUI scale (~1–3) into default particle camera space (z≈400). */
const WORLD = 200

const CREAM: [number, number, number] = [0.96, 0.93, 0.86]

const SierpinskiTriangle = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

	const datData: TDatData = useMemo(
		() => ({
			options: {
				scale: {
					initialValue: 1.65,
					min: 0.8,
					max: 3.5,
					step: 0.01,
				},
				depth: {
					initialValue: 1,
					min: 0,
					max: 8,
					step: 1,
				},
			},
			examples: [
				{ scale: 1.65, depth: 1 },
				{ scale: 1.65, depth: 3 },
				{ scale: 2.2, depth: 2 },
			],
		}),
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch])

	const tick: TParticleProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		_state: RootState,
		delta: number,
		_frame?: XRFrame | undefined,
	) => {
		const scale = data.scale !== undefined ? data.scale : datData.options.scale.initialValue
		const depth = data.depth !== undefined ? Math.round(data.depth) : Math.round(datData.options.depth.initialValue)

		const totalParticles = positions.length / 2
		// Grid membership is static — fill quickly (shared attractor rate is ~2k/s).
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta * 50)

		const worldScale = scale * WORLD
		const [v0, v1, v2] = equilateralVertices(worldScale)
		const s = worldScale * 0.95

		for (let i = 0; i < totalParticles; i++) {
			if (i < particlesToDraw) {
				const { x, y } = indexToXY(i, GRID_W)
				const idx = xyToIndex(x, y, GRID_W)
				const u = GRID_W <= 1 ? 0.5 : x / (GRID_W - 1)
				const v = GRID_H <= 1 ? 0.5 : y / (GRID_H - 1)
				const px = -s * Math.sqrt(3) * 0.5 + u * s * Math.sqrt(3)
				const py = s - v * (s - -s / 2)

				const inside = sierpinskiMember([px, py], v0, v1, v2, depth)
				positions.set([px, py], idx * 2)
				if (inside) {
					colors.set(CREAM, idx * 3)
				} else {
					colors.set([0, 0, 0], idx * 3)
				}
			} else {
				positions.set([9999, 9999], i * 2)
				colors.set([0, 0, 0], i * 3)
			}
		}

		updateProgressUI(particlesToDraw, totalParticles)
		checkCompletion(particlesToDraw, totalParticles)

		return { positions, colors }
	}

	// Grid spacing ≈ (scale*WORLD*√3)/GRID_W → ~1.1 at default scale; size matches cell fill.
	return <Base<TData> dimension={EDimensions.TWO_D} numParticles={NUM_PARTICLES} tick={tick} pointSize={1.2} />
}

SierpinskiTriangle.getDescription = () => (
	<>
		Each screen sample is a cell in a row-major grid: index <code>i</code> maps to <code>(x, y)</code> with width{' '}
		<code>{GRID_W}</code>, height <code>{GRID_H}</code>.
		<br />
		<br />
		Recursive Sierpinski: subdivide the equilateral triangle into four; remove the center triangle; repeat on the three
		corners. Depth 1 is one removal (three solid triangles with a central void), matching a pixelated gasket.
		<br />
		<br />
		Membership (corners <code>a, b, c</code>, depth <code>d &gt; 0</code>): remove points inside the middle triangle; else
		union of the three corner sub-triangles at depth <code>d - 1</code>.
		<BlockMath math="T_d = T^{(1)}_{a,m_{ab},m_{ca}} \cup T^{(1)}_{m_{ab},b,m_{bc}} \cup T^{(1)}_{m_{ca},m_{bc},c}" />
	</>
)

export default SierpinskiTriangle
