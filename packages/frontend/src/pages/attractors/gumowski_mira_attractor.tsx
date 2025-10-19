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

	const datData: TDatData = {
		options: {
			a: {
				initialValue: 0.4,
				min: -1,
				max: 1,
				step: 0.01,
			},
			b: {
				initialValue: 0.3,
				min: -1,
				max: 1,
				step: 0.01,
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
	}

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [dispatch])

	// Gumowski-Mira Attractor helper function
	const w = (x: number, a: number) => {
		return a * x + (1 - a) * 2 * x ** 2 / (1 + x ** 2)
	}

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

		let x = 0.1,
			y = 0.1
		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			// Debug: log parameter values on first iteration
			if (i === 0) {
				console.log('Gumowski-Mira params:', { a: safeA, b: safeB })
			}
			
			// Correct Gumowski-Mira Attractor formula:
			// t = x
			// x_new = b * y + w
			// w = a * x + (1 - a) * 2 * x^2 / (1 + x^2)
			// y_new = w - t
			const t = x
			const w_val = w(x, safeA)
			const xn = safeB * y + w_val
			const yn = w_val - t
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
		<BlockMath math={'t = x_n'} />
		<BlockMath math={'x_{n+1} = b \\cdot y_n + w'} />
		<BlockMath math={'w = a \\cdot x_n + (1 - a) \\cdot \\frac{2x_n^2}{1 + x_n^2}'} />
		<BlockMath math={'y_{n+1} = w - t'} />
		Limits:
		<BlockMath math="a, b \\in [-1, 1]" />
	</>
)

export default GumowskiMiraAttractor
