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

const BedheadAttractor = ({ setDescription }: ComponentProps<TRoutes[0]['element']>) => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.webSiteState)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 0.65343,
						min: -1,
						max: 1,
						step: 0.0001,
					},
					b: {
						initialValue: 0.7345345,
						min: -1,
						max: 1,
						step: 0.01,
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
				Cannot actually find any information on this attractor, but it looks cool.
				<br />
				Definitions:
				<BlockMath math="x_{n+1} = sin(x \cdot y/b) \cdot y + cos(a \cdot x - y)" />
				<BlockMath math="y_{n+1} = x + sin(y)/b" />
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
		let x = 0.1,
			y = 0
		const { a, b } = data

		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const nx = sin((x * y) / b) * y + cos(a * x - y)
			const ny = x + sin(y) / b

			x = nx
			y = ny

			positions.set([x * 50, y * 50], i * 2)

			const color = new THREE.Color()
			color.setRGB(47, 161, 214)
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
			cameraPosition={[0, 0, -300]}
		/>
	)
}

export default BedheadAttractor
