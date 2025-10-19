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

const { sin, sqrt } = Math

const GingerbreadMan = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: -1,
						min: -1,
						max: 1,
						step: 0.00001,
					},
					b: {
						initialValue: -0.98246,
						min: -1,
						max: 1,
						step: 0.00001,
					},
				},
				examples: [
					// {
					// 	a: 0,
					// 	b: 0.9298,
					// },
					// {
					// 	a: 0,
					// 	b: 0.66667,
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
		const { a, b, mu } = data

		let x = 0.723135391715914,
			y = -0.327585775405169
		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const xn = y + Math.abs(b * x)
			const yn = a - x
			x = xn
			y = yn

			positions.set([x * 20, y * 20], i * EDimensions.TWO_D)
			const color = new THREE.Color()
			const colorI = Math.floor(i / 1000)
			color.setHSL(0.8 + colorI / (255 * 0.2), 1, 0.5)
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
			cameraPosition={[0, 0, -775]}
		/>
	)
}

// Add static description function to the component
GingerbreadMan.getDescription = () => (
	<>
		The Gingerbread Man attractor is a fractal pattern that resembles a gingerbread man cookie.
		<br />
		<br />
		This attractor is currently work in progress (WIP).
	</>
)

export default GingerbreadMan
