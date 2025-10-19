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

		// Use fallback values if parameters are undefined
		const safeA = a !== undefined ? a : datData.options.a.initialValue
		const safeB = b !== undefined ? b : datData.options.b.initialValue
		const safeC = c !== undefined ? c : datData.options.c.initialValue
		const safeD = d !== undefined ? d : datData.options.d.initialValue

		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const nx = Math.sin(safeA * y) + safeC * Math.cos(safeA * x)
			const ny = Math.sin(safeB * x) + safeD * Math.cos(safeB * y)

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
		The Clifford Attractor is a fascinating example of a 2-dimensional strange (chaotic) attractor defined by a simple discrete iteration of two functions. It's both mathematically rich and visually compelling.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = \\sin(a \\cdot y_n) + c \\cdot \\cos(a \\cdot x_n)'} />
		<BlockMath math={'y_{n+1} = \\sin(b \\cdot x_n) + d \\cdot \\cos(b \\cdot y_n)'} />
		<br />
		Where <InlineMath math="a, b, c, d" /> are real constants, and <InlineMath math="(x_0, y_0)" /> is an initial seed point.
		<br />
		<br />
		<strong>Why it's interesting:</strong>
		<br />
		• <strong>Visual richness:</strong> Different parameter choices produce wildly different shapes — loops, ribbons, swirls, almost-cellular structures
		<br />
		• <strong>Simplicity + complexity:</strong> Simple sine/cosine formula yet complex chaotic behavior with sensitive dependence and fractal boundaries
		<br />
		• <strong>Fractal nature:</strong> Often has non-integer dimension with self-similarity when zoomed
		<br />
		• <strong>Parameter exploration:</strong> Slight variations can dramatically change the attractor shape
		<br />
		<br />
		<strong>Parameter limits:</strong>
		<BlockMath math="a, b, c, d \\in [-3, 3]" />
		<br />
		<br />
		The attractor is named after Clifford A. Pickover and is popular in generative art due to its visual richness and ease of parameter experimentation.
	</>
)

export default CliffordAttractor
