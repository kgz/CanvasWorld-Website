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
import { useAnimationState } from '../../hooks/useAnimationState'

const { sin, sqrt } = Math

const HopalongAttractorAdditive = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

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
						initialValue: 0.0526, //-0.211,
						min: -1,
						max: 1,
						step: 0.0001,
					},
					mu: {
						initialValue: 0.0351,
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
		

		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch])

	const G = (x: number, b: number, mu: number) => {
		return sqrt(Math.abs(b * x - mu))
	}
	const tick: TPointsProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		state: RootState,
		delta: number,
		frame?: XRFrame | undefined,
	) => {
		const { a, b, mu } = data

		const totalParticles = positions.length / EDimensions.TWO_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)

		let x = 0.723135391715914,
			y = -0.327585775405169
		for (let i = 0; i < totalParticles; i++) {
			if (i < particlesToDraw) {
				const xn = y + a * (1 - b * y ** 2) * y + G(x, b, mu)
				const yn = -x + G(xn, b, mu)
				x = xn
				y = yn

				positions.set([x * 55, y * 55], i * EDimensions.TWO_D)
				
				if (i >= particlesToDraw - 100) {
					colors.set([1.0, 1.0, 0.0], i * 3)
				} else {
					const color = new THREE.Color()
					const colorI = Math.floor(i / 1000)
					color.setHSL(0.8 + colorI / (255 * 0.2), 1, 0.5)
					colors.set([color.r, color.g, color.b], i * 3)
				}
			} else {
				positions.set([9999, 9999], i * EDimensions.TWO_D)
				colors.set([0, 0, 0], i * 3)
			}
		}

		updateProgressUI(particlesToDraw, totalParticles)
		checkCompletion(particlesToDraw, totalParticles)

		return { positions, colors }
	}

	return (
		<Base<TData>
			dimension={EDimensions.TWO_D}
			numParticles={200_000}
			tick={tick}
			pointSize={0.5}
			cameraPosition={[0, 0, -275]}
		/>
	)
}


// Add static description function to the component
HopalongAttractorAdditive.getDescription = () => (
	<>
		This visualization shows the Additive Hopalong Attractor, a modern variation of the classic chaotic system discovered by Barry Martin.
		<br />
		<br />
		The original Hopalong attractor uses a sign function to flip direction each step, producing sharp, mirrored "butterfly" or "boomerang" shapes.
		This additive variation removes that sign change and introduces a smooth nonlinear feedback term, giving the motion a more fluid and continuous character.
		<br />
		<br />
		Instead of distinct symmetrical wings, this version forms swirling, asymmetric clouds of points — like an evolving nebula of chaos. The equations blend Hopalong-style chaos with logistic-style growth, resulting in a dynamic but balanced system.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = y_n + a(1 - by_n^2)y_n + G(x_n)'} />
		<BlockMath math={'y_{n+1} = -x_n + G(x_{n+1})'} />
		Where
		<BlockMath math={'G(x) = \\sqrt{|bx - \\mu|}'} />
		<br />
		<strong>Limits:</strong>
		<BlockMath math="a,b,\\mu \\in [-1, 1]" />
		<br />
		<strong>References:</strong>
		<br />
		<a target="_blank" href="https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf">
			www.jolinton.co.uk
		</a>
	</>
)

export default HopalongAttractorAdditive
