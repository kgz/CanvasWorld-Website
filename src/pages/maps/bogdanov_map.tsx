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

const { sin, cos } = Math

const BogdanovMap = ({ setDescription }: ComponentProps<TRoutes[0]['element']>) => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.webSiteState)

	const datData = useMemo(
		() =>
			({
				options: {
					a: {
						initialValue: 0.0025,
						min: 0,
						max: 0.01,
						step: 0.0001,
					},
					b: {
						initialValue: 1.44,
						min: 0.5,
						max: 2.5,
						step: 0.01,
					},
				},
				examples: [],
			}) as TDatData,
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		setDescription(
			<>
				The Bogdanov map is a mathematical model that describes a discrete dynamical system. It is named after its
				discoverer, Boris Bogdanov. The map is often used to study chaotic behavior in nonlinear systems.
				<br />
				<br />
				Definitions:
				<BlockMath math={'x(n+1) = y(n) + 1 - a * x(n)^2'} />
				<BlockMath math={'y(n+1) = b * x(n)'} />
				Limits:
				<BlockMath math="a \in [0, 0.01]" />
				<BlockMath math="b \in [0.5, 2.5]" />
				<br />
				<br />
				Here, x(n) and y(n) represent the state variables at time step n. The parameters a and b are constants that
				determine the behavior of the system. The map exhibits interesting dynamics depending on the values of a and b.
				<br />
				<br />
				It can display periodic behavior, stable fixed points, or chaotic trajectories. The chaotic behavior arises when
				the system is sensitive to initial conditions, meaning small changes in the initial state can lead to
				significantly different outcomes.
				<br />
				<br />
				The Bogdanov map has applications in various fields, including physics, biology, and economics. It provides
				insights into complex systems and helps researchers understand the behavior of nonlinear dynamical systems.
			</>,
		)

		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch, setDescription])

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

		for (let i = 0; i < positions.length / EDimensions.TWO_D; i++) {
			const nx = x + y + a * y + b * x * (x - 1) - 0.1 * x * y
			const ny = y + a * y + b * x * (x - 1) - 0.1 * x * y

			x = nx
			y = ny

			positions.set([x * 150, y * 150], i * 2)

			const color = new THREE.Color()
			color.setHSL((Math.round(i) % 360) / 360, 1, 0.5)
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
			cameraPosition={[0, 0, -100]}
		/>
	)
}

export default BogdanovMap
