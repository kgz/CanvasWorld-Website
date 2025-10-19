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

const { sin, cos } = Math

const GumowskiMiraAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)

	const datData = useMemo(() => ({
		options: {
			a: {
				initialValue: 0.79253300698474,
				min: -1,
				max: 1,
				step: 0.01,
			},
			b: {
				initialValue: 0.345703079365194,
				min: -1,
				max: 1,
				step: 0.01,
			},
			mu: {
				initialValue: -0.228,
				min: -1,
				max: 1,
				step: 0.01,
			},
		},
		examples: [
			{
				a: 0.008,
				b: -0.7,
				mu: -0.228,
			},
			{
				a: 0.79253300698474,
				b: 0.345703079365194,
				mu: -0.228,
			},
			{
				a: 0.579161538276821,
				b: -0.820410779677331,
				mu: -0.228,
			},
			{
				a: 0.062683217227459,
				b: -0.436713613104075,
				mu: -0.228,
			},
		],
	}) as TDatData, [])

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch])

	const G = (x: number, mu: number) => {
		return mu * x + (2 * (1 - mu) * x ** 2) / (1.0 + x ** 2)
	}

	const tick: TPointsProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		state: RootState,
		delta: number,
		frame?: XRFrame | undefined,
	) => {
		const { a, b, mu } = data

		// Use fallback values if parameters are undefined
		const safeA = a !== undefined ? a : datData.options.a.initialValue
		const safeB = b !== undefined ? b : datData.options.b.initialValue
		const safeMu = mu !== undefined ? mu : datData.options.mu.initialValue


		let x = 0.723135391715914,
			y = -0.327585775405169
		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const xn = y + safeA * (1 - safeB * y ** 2) * y + G(x, safeMu)
			const yn = -x + G(xn, safeMu)
			x = xn
			y = yn

			positions.set([x * 5, y * 5], i * EDimensions.TWO_D)
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
			cameraPosition={[0, 0, -175]}
		/>
	)
}

// Add static description function to the component
GumowskiMiraAttractor.getDescription = () => (
	<>
		The Gumowski-Mira Attractor is a mathematical model that describes the behavior of a dynamic system.
		<br />
		<br />
		It is often used in chaos theory and fractal geometry to generate visually interesting patterns. The equations
		in the code represent the iterative formulas for calculating the next values of the variables x and y in the
		Gumowski-Mira Attractor.
		<br />
		<br />
		These equations involve parameters a, b, and μ, which determine the shape and characteristics of the
		attractor.
		<br />
		<br /> By varying these parameters, you can create different visual patterns and explore the complex dynamics
		of the system.
		<br />
		<br />
		Definition:
		<BlockMath math={'x_{n+1} = y_n + a(1 - b y_n^2)y_n + G(x_n, \\mu)'} />
		<BlockMath math={'y_{n+1} = -x_n + G(x_{n+1}, \\mu)'} />
		Where:
		<BlockMath math={'G(x, \\mu) = \\mu x + 2(1 - \\mu) \\frac{x^2}{1 + x^2}'} />
		Limits:
		<BlockMath math="a, b,\mu \\in [-1, 1]" />
	</>
)

export default GumowskiMiraAttractor
