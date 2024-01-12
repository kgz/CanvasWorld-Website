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

const { sin, sqrt } = Math

const HopalongAttractorPositive = ({ setDescription }: ComponentProps<TRoutes[0]['element']>) => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.webSiteState)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 0,
						min: -1,
						max: 1,
						step: 0.0001,
					},
					b: {
						initialValue: -0.211,
						min: -1,
						max: 1,
						step: 0.0001,
					},
					mu: {
						initialValue: -0.228,
						min: -1,
						max: 1,
						step: 0.0001,
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
				{/* x' = y + f(x) where f(x) = + SGN(x)√|bx - c) y' = a - x */}
				The Hopalong Attractor is a 2D strange attractor.
				<br />
				<br />
				Definition:
				<BlockMath math={`x_{n+1} = y_n + f(x_n)`} />
				<BlockMath math={`y_{n+1} = a - x_n`} />
				Where
				<BlockMath math={`f(x) = sgn(x)√|bx - \mu|`} />
				<br />
				Limits: <br />
				<BlockMath math="a,b,\mu \in [-1, 1]" />
				Refrences:
				<br />
				<a target="_blank" href="https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf">
					www.jolinton.co.uk
				</a>
			</>,
		)

		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch, setDescription])

	const G = (x: number, b: number, mu: number) => {
		return Math.sign(x) * sqrt(Math.abs(b * x - mu))
	}
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
			const xn = y + a * (1 - b * y ** 2) * y + G(x, b, mu)
			const yn = -x + G(xn, b, mu)
			x = xn
			y = yn

			positions.set([x * 5, y * 5], i * EDimensions.TWO_D)
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
			cameraPosition={[0, 0, -175]}
		/>
	)
}

export default HopalongAttractorPositive
