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

const GingerbreadMan = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

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

		const totalParticles = positions.length / EDimensions.TWO_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)

		let x = 0.723135391715914,
			y = -0.327585775405169
		for (let i = 0; i < totalParticles; i++) {
			if (i < particlesToDraw) {
				const xn = y + Math.abs(b * x)
				const yn = a - x
				x = xn
				y = yn

				positions.set([x * 20, y * 20], i * EDimensions.TWO_D)
				
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
			cameraPosition={[0, 0, -775]}
		/>
	)
}

// Add static description function to the component
GingerbreadMan.getDescription = () => (
	<>
		The Gingerbread Man Attractor is a classic example of a chaotic map — a simple, two-dimensional system that produces surprisingly intricate and unpredictable behavior. Despite its playful name, this attractor's shape often resembles a gingerbread man when plotted, earning it its distinctive title.
		<br />
		<br />
		Defined by only two equations, the system evolves as follows:
		<br />
		<br />
		<strong>Classic Definition:</strong>
		<BlockMath math={'x_{n+1} = 1 - y_n + |x_n|'} />
		<BlockMath math={'y_{n+1} = a - x_n'} />
		<br />
		In this variation, the equations are parameterized using constants a and b, which influence the attractor's spread and symmetry:
		<br />
		<br />
		<strong>Parameterized Definition:</strong>
		<BlockMath math={'x_{n+1} = y_n + |b \\cdot x_n|'} />
		<BlockMath math={'y_{n+1} = a - x_n'} />
		<br />
		Each iteration takes the current point and transforms it through absolute value and subtraction, creating a chaotic dance that never repeats yet remains bounded within a distinctive region.
		<br />
		<br />
		The simplicity of the rule hides its beauty — from random starting points, a consistent structure emerges: a chaotic, cookie-shaped figure made of millions of points.
	</>
)

export default GingerbreadMan
