import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps, type TsetBodyJSX } from '../../@types/gui'
import Base from '../_base'
import type { ComponentProps } from 'react'
import { useEffect, useRef } from 'react'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import type { TRoutes } from '../../@types/routes'
import { useAnimationState } from '../../hooks/useAnimationState'

const { sin, cos } = Math

const datData: TDatData = {
	options: {
		a: {
			initialValue: 0.0,
			min: -2,
			max: 1,
			step: 0.01,
		},
		b: {
			initialValue: 0.5,
			min: -1,
			max: 1,
			step: 0.01,
		},
		mu: {
			initialValue: -0.75,
			min: -2,
			max: 1,
			step: 0.01,
		},
		x0: {
			initialValue: 0.0,
			min: -10,
			max: 10,
			step: 0.001,
		},
		y0: {
			initialValue: 0.5,
			min: -10,
			max: 10,
			step: 0.001,
		},
	},
	examples: [
		{
			a: 0.008,
			b: 0.05,
			mu: -0.9,
			x0: 0.0,
			y0: 0.5,
		},
		{
			a: 0.0,
			b: 0.5,
			mu: -0.75,
			x0: 0.0,
			y0: 0.5,
		},
		{
			a: 0.008,
			b: 0.05,
			mu: -0.6,
			x0: 0.0,
			y0: 0.5,
		},
	],
}

const GumowskiMiraAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const initialized = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		// Only set initial data if no data exists yet
		if (Object.keys(data).length === 0) {
			void dispatch(
				setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
			)
		}
	}, [dispatch, data])

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
		const { a, b, mu, x0, y0 } = data

		// Use fallback values if parameters are undefined
		const safeA = a !== undefined ? a : datData.options.a.initialValue
		const safeB = b !== undefined ? b : datData.options.b.initialValue
		const safeMu = mu !== undefined ? mu : datData.options.mu.initialValue
		const safeX0 = x0 !== undefined ? x0 : datData.options.x0.initialValue
		const safeY0 = y0 !== undefined ? y0 : datData.options.y0.initialValue

		const numParticles = positions.length / EDimensions.TWO_D
		const particlesToDraw = calculateParticlesToDraw(numParticles, delta)
		
		let x = safeX0,
			y = safeY0
		
		for (let i = 0; i < numParticles; i++) {
			if (i < particlesToDraw) {
				const xn = y + safeA * (1 - safeB * y ** 2) * y + G(x, safeMu)
				const yn = -x + G(xn, safeMu)
				x = xn
				y = yn

				positions.set([x * 5, y * 5], i * EDimensions.TWO_D)
				
				if (i >= particlesToDraw - 100) {
					colors.set([1.0, 1.0, 0.0], i * 3)
				} else {
					const normalizedIteration = i / (numParticles - 1)
					const color = new THREE.Color()
					color.setHSL(0.6 - normalizedIteration * 0.6, 1.0, 0.5)
					colors.set([color.r, color.g, color.b], i * 3)
				}
			} else {
				positions.set([9999, 9999], i * EDimensions.TWO_D)
				colors.set([0, 0, 0], i * 3)
			}
		}

		updateProgressUI(particlesToDraw, numParticles)
		checkCompletion(particlesToDraw, numParticles)

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
