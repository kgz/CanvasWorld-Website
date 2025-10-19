import type { RootState } from '@react-three/fiber'
import * as THREE from 'three'

import { BlockMath, InlineMath } from 'react-katex'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps, type TsetBodyJSX } from '../../@types/gui'
import Base from '../_base'
import type { ComponentProps } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { setDatData, setData, setDescription } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import type { TRoutes } from '../../@types/routes'
import { mapLinear } from 'three/src/math/MathUtils'

const { sin, sqrt } = Math

const MandlebrotSet = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)

	const [canvas, setCanvas] = useState<HTMLElement | null>(null)

	const height = 500
	const width = height
	const datData = useMemo(
		() =>
			({
				options: {
					// a: {
					// 	initialValue: 1, //0.87719,
					// 	min: 0,
					// 	max: 1,
					// 	step: 0.00001,
					// },
				},
				examples: [
					{
						a: 0.87719,
					},
				],
			}) as TDatData,
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDescription("This is in WIP"))

		void dispatch(setDatData(datData))
		void dispatch(
			setData(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]))),
		)
	}, [datData, dispatch])

	const distance = (x: number, y: number, x0: number, y0: number) => {
		return sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))
	}

	const winWidth = window.innerWidth
	const winHeight = window.innerHeight

	const xmin = -winWidth / 2
	const ymin = -winHeight / 3.5

	const maxiterations = 50
	const xmax = xmin + winWidth
	const ymax = ymin + winHeight
	const dx = (xmax - xmin) / width
	const dy = (ymax - ymin) / height

	const tick: TPointsProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		state: RootState,
		delta: number,
		frame?: XRFrame | undefined,
	) => {
		let y = ymin
		for (let j = 0; j < height; j++) {
			let x = xmin
			for (let i = 0; i < width; i++) {
				let a = x
				let b = y
				let n = 0
				while (n < maxiterations) {
					const aa = a * a
					const bb = b * b
					const twoab = 2.0 * a * b
					a = aa - bb + x
					b = twoab + y
					if (distance(aa, bb, 0, 0) > 4) {
						break
					}
					n++
				}
				const pix = j * width + i
				const norm = mapLinear(n, 0, maxiterations, 0, 1)
				let bright = mapLinear(sqrt(norm), 0, 1, 0, 255)
				if (n == maxiterations) {
					bright = 0
					colors.set([155, 155, 155], pix)
				} else {
					const color = new THREE.Color()
					colors.set([255, 255, 255], pix)

					// set position
					positions.set([x, y], pix)
				}
				x += dx
			}
			y += dy
		}

		return { positions, colors }
	}

	return (
		<Base<TData>
			dimension={EDimensions.TWO_D}
			numParticles={height * width * 4}
			tick={tick}
			pointSize={0.5}
			cameraPosition={[0, 0, -575]}
			colorAlpha={false}
			setCanvasRef={ref => {
				if (ref.current) {
					setCanvas(ref.current)
				}
			}}
		/>
	)
}

export default MandlebrotSet
