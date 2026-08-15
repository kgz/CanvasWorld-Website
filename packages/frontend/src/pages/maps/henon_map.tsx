import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps, type TsetBodyJSX } from '../../@types/gui'
import Base from '../_base'
import type { ComponentProps } from 'react'
import { useEffect, useMemo } from 'react'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import type { TRoutes } from '../../@types/routes'
import { useAnimationState } from '../../hooks/useAnimationState'

const { sin, cos } = Math

const HenonMap = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 1.4,
						min: 0,
						max: 2,
						step: 0.000001,
					},
					b: {
						initialValue: 0.3,
						min: 0,
						max: 20,
						step: 0.000001,
					},
				},
				examples: [
					// {
					// 	a: 1.4,
					// 	b: 5.157895,
					// 	c: 2.736842,
					// },
					// {
					// 	a: -11,
					// 	b: 0.3,
					// 	c: -0.5,
					// },
					// {
					// 	a: 1.4,
					// 	b: 5.157895,
					// 	c: -4.561404,
					// },
				],
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
		state: RootState,
		delta: number,
		frame?: XRFrame | undefined,
	) => {
		const { a, b } = data
		
		// Use fallback values if parameters are undefined
		const safeA = a !== undefined ? a : datData.options.a.initialValue
		const safeB = b !== undefined ? b : datData.options.b.initialValue
		
		const totalParticles = positions.length / EDimensions.TWO_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		
		let x = 0.03,
			y = 0.01
		for (let i = 0; i < totalParticles; i++) {
			if (i < particlesToDraw) {
				const xn = -(x * x) + safeB * y + safeA
				const yn = x
				x = xn
				y = yn

				positions.set([x * 100, y * 100], i * 2)

				if (i >= particlesToDraw - 100) {
					colors.set([1.0, 1.0, 0.0], i * 3)
				} else {
					const color = new THREE.Color()
					color.setHSL(sin(i), 1, 0.5)
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
			cameraPosition={[0, 0, -400]}
		/>
	)
}

// Add static description function to the component
HenonMap.getDescription = () => (
	<>
		The Henon map is a discrete-time dynamical system.
		<br />
		<br />
		It is a prototypical example of chaotic system that exhibits the phenomenon of strange attractors.
		<br />
		<br />
		It was introduced by Michel Hénon in 1976, while studying the Lorenz attractor map.
		The Hénon map arises from a simplification of the Lorenz system.
		<br />
		<br />
		The Hénon map is area-preserving and exhibits chaotic behavior for certain values of its parameters.
		<br />
		<br />
		Definition:
		<BlockMath math="x_{n + 1} = 1 - a x_n^2 + y_n" />
		<BlockMath math="y_{n + 1} = b x_n" />
		Limits:
		<BlockMath math="a, b \\in [0, 2]" />
	</>
)

export default HenonMap
