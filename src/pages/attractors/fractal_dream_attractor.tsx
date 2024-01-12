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

const FractalDreamAttractor = ({ setDescription }: ComponentProps<TRoutes[0]['element']>) => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.webSiteState)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 1.1,
						min: 0,
						max: 3,
						step: 0.000001,
					},
					b: {
						initialValue: 2.7640000000000002,
						min: 0,
						max: 3,
						step: 0.000001,
					},
					c: {
						initialValue: 1.07,
						min: 0,
						max: 3,
						step: 0.000001,
					},
					d: {
						initialValue: 1.561,
						min: 0,
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
				The Fractal Dream Attractor is a 2D strange attractor.
				<br />
				<br />
				Definition:
				<BlockMath math={`x_{n+1} = sin(b * y_n) + c * sin(b * x_n)`} />
				<BlockMath math={`y_{n+1} = sin(a * x_n) + d * sin(a * y_n)`} />
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
			const nx = Math.sin(b * y) + c * Math.sin(b * x)
			const ny = Math.sin(a * x) + d * Math.sin(a * y)

			x = nx
			y = ny

			positions.set([x * 100, y * 100], i * 2)

			const color = new THREE.Color()
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

export default FractalDreamAttractor
