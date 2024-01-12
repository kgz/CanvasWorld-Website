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

const CliffordAttractor = ({ setDescription }: ComponentProps<TRoutes[0]['element']>) => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.webSiteState)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 1.7,
						min: -3,
						max: 3,
						step: 0.000001,
					},
					b: {
						initialValue: 1.8,
						min: -3,
						max: 3,
						step: 0.000001,
					},
					c: {
						initialValue: 1.9,
						min: -3,
						max: 3,
						step: 0.000001,
					},
					d: {
						initialValue: 0.4,
						min: -3,
						max: 3,
						step: 0.000001,
					},
				},
				examples: [],
			}) as TDatData,
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		setDescription(
			<>
				The Clifford Attractor is a 2D strange attractor.
				<br />
				<br />
				It is characterized by two iterative equations that determine the x and y coordinates of discrete steps in the
				path of a particle across a 2D space. <br />
				The starting point (x0, y0) and the values of four parameters (a, b, c, d) influence the shape of the attractor.
				<br />
				<br />
				It is named after Clifford Pickover, who described it in his book Chaos in Wonderland (1994).
				<br />
				<br />
				Definition: <br />
				<BlockMath math={`x_{n+1} = sin(a * y_n) + c * cos(a * x_n)`} />
				<BlockMath math={`y_{n+1} = sin(b * x_n) + d * cos(b * y_n)`} />
				<br />
				Limits: <br />
				<BlockMath math="a,b,c,d \in [-3, 3]" />
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
		let x = -2,
			y = -2
		const { a, b, c, d } = data

		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const nx = Math.sin(a * y) + c * Math.cos(a * x)
			const ny = Math.sin(b * x) + d * Math.cos(b * y)

			x = nx
			y = ny

			positions.set([x * 100, y * 100], i * 2)

			const color = new THREE.Color()
			const percent = (sin(x + y) / 255) * 255
			// map percent from 0 to 255 to 0 to 1
			color.setHex(0xf87b3)
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
			cameraPosition={[0, 0, -500]}
		/>
	)
}

export default CliffordAttractor
