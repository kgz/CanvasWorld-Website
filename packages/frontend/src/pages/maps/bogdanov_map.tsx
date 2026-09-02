import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps } from '../../@types/gui'
import Base from '../_base'
import { useEffect, useMemo } from 'react'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { bogdanovMapTick } from '../../utils/bogdanovMap'

const BogdanovMap = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 0.0025,
						min: 0,
						max: 0.01,
						step: 0.0001,
					},
					b: {
						initialValue: 1.44,
						min: 0.5,
						max: 2.5,
						step: 0.01,
					},
					mu: {
						initialValue: -0.1,
						min: -0.5,
						max: 0.5,
						step: 0.01,
					},
				},
				examples: [],
			}) as TDatData,
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch])

	const tick: TPointsProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		_state: RootState,
		delta: number,
		_frame?: XRFrame | undefined,
	) => {
		const { a, b, mu } = data

		const safeA = a !== undefined ? a : datData.options.a.initialValue
		const safeB = b !== undefined ? b : datData.options.b.initialValue
		const safeMu = mu !== undefined ? mu : datData.options.mu.initialValue

		const totalParticles = positions.length / EDimensions.TWO_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)

		let x = 0.1,
			y = 0
		for (let i = 0; i < totalParticles; i++) {
			if (i < particlesToDraw) {
				const next = bogdanovMapTick(x, y, safeA, safeB, safeMu)
				x = next.x
				y = next.y

				positions.set([x * 150, y * 150], i * 2)

				if (i >= particlesToDraw - 100) {
					colors.set([1.0, 1.0, 0.0], i * 3)
				} else {
					const color = new THREE.Color()
					color.setHSL((Math.round(i) % 360) / 360, 1, 0.5)
					colors.set([color.r, color.g, color.b], i * 3)
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

	return (
		<Base<TData>
			dimension={EDimensions.TWO_D}
			numParticles={200_000}
			tick={tick}
			pointSize={0.5}
			cameraPosition={[0, 0, -100]}
		/>
	)
}

BogdanovMap.getDescription = () => (
	<>
		The Bogdanov map is a discrete dynamical system introduced by Rifkat Bogdanov. Classical Chaos iterates the
		standard form with parameters <em>a</em>, <em>b</em>, and <em>μ</em>.
		<br />
		<br />
		Definition:
		<BlockMath math={'y\\prime = y + a y + b x(x - 1) + \\mu\\, x y'} />
		<BlockMath math={'x\\prime = x + y\\prime'} />
		Limits:
		<BlockMath math="a \\in [0, 0.01]" />
		<BlockMath math="b \\in [0.5, 2.5]" />
		<BlockMath math="\\mu \\in [-0.5, 0.5]" />
		<br />
		<br />
		Default seed is <code>(0.1, 0)</code> with <code>a = 0.0025</code>, <code>b = 1.44</code>,{' '}
		<code>μ = −0.1</code>.
	</>
)

export default BogdanovMap
