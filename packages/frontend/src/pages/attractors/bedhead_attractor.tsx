import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps } from '../../@types/gui'
import Base from '../_base'
import { useEffect, useMemo } from 'react'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { bedheadAttractorTick, testBedheadAttractorTick } from '../../utils/bedheadAttractor'
import { useAnimationState } from '../../hooks/useAnimationState'


const BedheadAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

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
				examples: [
					{
						a: 0.65343,
						b: 0.7345345,
					},
					{
						a: -0.81,
						b: -0.92,
					},
					{
						a: -0.64,
						b: 0.76,
					},
					{
						a: 0.06,
						b: 0.98,
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

		const totalParticles = positions.length / EDimensions.TWO_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)

		let x = 0.1,
			y = 0
		for (let i = 0; i < totalParticles; i++) {
			if (i < particlesToDraw) {
				try {
					const next = bedheadAttractorTick(x, y, safeA, safeB)
					x = next.x
					y = next.y

					// Clamp values to prevent explosion
					x = Math.max(-1000, Math.min(1000, x))
					y = Math.max(-1000, Math.min(1000, y))

					positions.set([x * 50, y * 50], i * 2)

					if (i >= particlesToDraw - 100) {
						colors.set([1.0, 1.0, 0.0], i * 3)
					} else {
						const color = new THREE.Color()
						color.setHex(0x22c55e)
						colors.set([color.r, color.g, color.b], i * 3)
					}
				} catch (error) {
					console.error(`Bedhead Attractor: Error at iteration ${i}:`, error)
					break
				}
			} else {
				positions.set([9999, 9999], i * 2)
				colors.set([0, 0, 0], i * 3)
			}
		}

		updateProgressUI(particlesToDraw, totalParticles)
		checkCompletion(particlesToDraw, totalParticles)

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

// Add static description function to the component
BedheadAttractor.getDescription = () => (
	<>
		The Bedhead Attractor is a 2D strange attractor that produces beautiful, intricate fractal patterns. It belongs to the family of discrete maps that generate complex geometric structures.
		<br />
		<br />
		Definitions:
		<BlockMath math={'x_{n+1} = \\sin(x \\cdot y/b) \\cdot y + \\cos(a \\cdot x - y)'} />
		<BlockMath math={'y_{n+1} = x + \\sin(y)/b'} />
		<br />
		<br />
		Parameters a and b control the shape and behavior of the attractor. Small changes can yield dramatically different patterns!
	</>
)

export default BedheadAttractor
