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
import { bedheadAttractorTick, testBedheadAttractorTick } from '../../utils/bedheadAttractor'

const { sin, cos } = Math

const BedheadAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 0.65343,
						min: -2,
						max: 2,
						step: 0.001,
					},
					b: {
						initialValue: 0.7345345,
						min: 0.1,  // Prevent division by zero
						max: 2,
						step: 0.01,
					},
				},
				examples: [],
			}) as TDatData,
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDescription(
			"The Bedhead Attractor is a 2D strange attractor that produces beautiful, intricate fractal patterns. It belongs to the family of discrete maps that generate complex geometric structures.\n\nDefinitions:\nx_{n+1} = \\sin(x \\cdot y/b) \\cdot y + \\cos(a \\cdot x - y)\ny_{n+1} = x + \\sin(y)/b\n\nParameters a and b control the shape and behavior of the attractor. Small changes can yield dramatically different patterns!"
		))

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
		let x = 0.1,
			y = 0
		const { a, b } = data

		// Use fallback values if parameters are undefined
		const safeA = a !== undefined ? a : datData.options.a.initialValue
		const safeB = b !== undefined ? b : datData.options.b.initialValue

		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			try {
				const next = bedheadAttractorTick(x, y, safeA, safeB)
				x = next.x
				y = next.y

				// Clamp values to prevent explosion
				x = Math.max(-1000, Math.min(1000, x))
				y = Math.max(-1000, Math.min(1000, y))

				positions.set([x * 50, y * 50], i * 2)

				const color = new THREE.Color()
				color.setRGB(47, 161, 214)
				colors.set([color.r, color.g, color.b], i * 3)
			} catch (error) {
				console.error(`Bedhead Attractor: Error at iteration ${i}:`, error.message)
				break
			}
		}

		return { positions, colors }
	}

	// Test the function when parameters change
	useEffect(() => {
		const { a, b } = data
		const safeA = a !== undefined ? a : datData.options.a.initialValue
		const safeB = b !== undefined ? b : datData.options.b.initialValue
		
		console.log(`Testing Bedhead Attractor with a=${safeA}, b=${safeB}`)
		const testResults = testBedheadAttractorTick(safeA, safeB, 50)
		console.log(`Test completed: ${testResults.length} iterations, final values: x=${testResults[testResults.length-1]?.x}, y=${testResults[testResults.length-1]?.y}`)
	}, [data, datData])

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
