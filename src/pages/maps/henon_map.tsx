import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps, type TsetBodyJSX } from '../../@types/gui'
import Base from '../_base'
import type { ComponentProps } from 'react'
import { useEffect, useMemo } from 'react'
import { setDatData, setData } from '../../@store/webSiteState.slice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import type { TRoutes } from '../../@types/routes'

const { sin, cos } = Math

const HenonMap = ({ setDescription }: ComponentProps<TRoutes[0]['element']>) => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.webSiteState)

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
		setDescription(
			<>
				The Henon map is a discrete-time dynamical system. <br />
				<br />
				It is a prototypical example of chaotic system that exhibits the phenomenon of strange attractors. <br />
				<br />
				It was introduced by Michel Hénon in 1976, while studying the Lorenz attractor map. <br />
				The Hénon map arises from a simplification of the Lorenz system. <br />
				<br />
				The Hénon map is area-preserving and exhibits chaotic behavior for certain values of its parameters. <br />
				<br />
				Definition:
				<BlockMath math="x_{n + 1} = 1 - a x_n^2 + y_n" />
				<BlockMath math="y_{n + 1} = b x_n" />
				Limits:
				<BlockMath math="a, b \in [0, 2]" />
			</>,
		)

		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch, setDescription])

	const tick: TPointsProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		state: RootState,
		delta: number,
		frame?: XRFrame | undefined,
	) => {
		const { a, b } = data
		let x = 0.03,
			y = 0.01
		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const xn = -(x * x) + b * y + a
			const yn = x
			x = xn
			y = yn

			positions.set([x * 100, y * 100], i * 2)

			const color = new THREE.Color()
			const percent = (sin(i) / 255) * 255
			// map percent from 0 to 255 to 0 to 1
			color.setHSL(sin(i), 1, 0.5)
			colors.set([color.r, color.g, color.b], i * 3)
		}

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

export default HenonMap
