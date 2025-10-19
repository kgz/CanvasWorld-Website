import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps, type TsetBodyJSX } from '../../@types/gui'
import Base from '../_base'
import type { ComponentProps } from 'react'
import { useEffect, useMemo } from 'react'
import { setDatData, setData, setDescription } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import type { TRoutes } from '../../@types/routes'

const { sin, cos } = Math

const CliffordAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)

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


// Add static description function to the component
CliffordAttractor.getDescription = () => (
	<>
		This attractor is currently work in progress (WIP).
	</>
)

export default CliffordAttractor
