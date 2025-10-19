import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath, InlineMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps, type TsetBodyJSX } from '../../@types/gui'
import Base from '../_base'
import type { ComponentProps } from 'react'
import { useEffect, useMemo } from 'react'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import type { TRoutes } from '../../@types/routes'

const { sin, sqrt } = Math

const IkedaMap = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 1, //0.87719,
						min: 0,
						max: 1,
						step: 0.00001,
					},
				},
				examples: [
					{
						a: 0.87719,
					},
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

		let x = 0.0,
			y = 0.0
		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const G = 0.4 - 6 / (1 + Math.pow(x, 2) + Math.pow(y, 2))

			const xn = 1 + safeA * (x * Math.cos(G) - y * Math.sin(G))
			const yn = safeA * (x * Math.sin(G) + y * Math.cos(G))
			y = yn
			x = xn
			positions.set([x * 50 - 20, y * 50 - 200], i * EDimensions.TWO_D)
			const color = new THREE.Color()
			color.setHex(0xf87b3)
			colors.set([color.r, color.g, color.b], i * 3)
		}

		// void dispatch(
		// 	setData({
		// 		...data,
		// 		a: data.a + 0.01,
		// 	}),
		// )

		// fast at start then slow down, ease out
		// if (a < 1) {
		// 	void dispatch(
		// 		setData({
		// 			...data,
		// 			// a: a == 0 ? 0.00001 : a + 0.01 * (1 - Math.exp(-a)),
		// 			//opposite
		// 			a: a == 0 ? 0.00001 : a + 0.01 * Math.exp(-a),
		// 		}),
		// 	)
		// } else {
		// 	void dispatch(
		// 		setData({
		// 			...data,
		// 			a: 0,
		// 		}),
		// 	)
		// }
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
IkedaMap.getDescription = () => (
	<>
		The Ikeda Map is a 2D strange attractor.
		<br />
		Where <InlineMath math={'a \\ge 0.6'} /> It has a{' '}
		<a target="_blank" href="https://en.wikipedia.org/wiki/Attractor">
			Chaotic Attraction
		</a>
		.
		<br />
		<br />
		Definition:
		<BlockMath math={'x_{n+1} = 1 + a(x_n cos(f) - y_n sin(f))'} />
		<BlockMath math={'y_{n+1} = y_n cos(f) + x_n sin(f)'} />
		Where
		<BlockMath math={'f(x, y) = 0.4 - \\frac{6}{1 + x_n^2 + y_n^2}'} />
		<br />
		Limits: <br />
		<BlockMath math="a \\in [0, 1]" />
	</>
)

export default IkedaMap
