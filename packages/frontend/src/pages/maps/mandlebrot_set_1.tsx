import type { RootState } from '@react-three/fiber'

import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps } from '../../@types/gui'
import Base from '../_base'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { setDatData, setData, setDescription } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import * as math from 'mathjs'
import { Color } from 'three'
import style from '../../@scss/template.module.scss'
import $ from 'jquery'
class Complex {
	public real: number
	public imaginary: number

	constructor(real, imaginary) {
		this.real = real
		this.imaginary = imaginary
	}

	add(complex) {
		return new Complex(this.real + complex.real, this.imaginary + complex.imaginary)
	}

	subtract(complex) {
		return new Complex(this.real - complex.real, this.imaginary - complex.imaginary)
	}

	multiply(complex) {
		const real = this.real * complex.real - this.imaginary * complex.imaginary
		const imaginary = this.real * complex.imaginary + this.imaginary * complex.real
		return new Complex(real, imaginary)
	}

	divide(complex) {
		const denominator = complex.real ** 2 + complex.imaginary ** 2
		const real = (this.real * complex.real + this.imaginary * complex.imaginary) / denominator
		const imaginary = (this.imaginary * complex.real - this.real * complex.imaginary) / denominator
		return new Complex(real, imaginary)
	}

	magnitude() {
		return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary)
	}
	argument() {
		return Math.atan2(this.imaginary, this.real)
	}

	conjugate() {
		return new Complex(this.real, -this.imaginary)
	}
}

const MandlebrotSet = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const [loading, setLoading] = useState(false)
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
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

	const [w, h] = useMemo(() => {
		const params = new URLSearchParams(window.location.search)
		return [window.innerWidth - (params.get('iframe') !== null ? 0 : 300), window.innerHeight]
	}, [])

	// if (!w || !h) {
	// 	return <></>
	// }

	const [x, y] = [-0.7, -0]

	const zoom = 240

	const areal = useMemo(
		() =>
			Array.from(new Array(w)).map((v, i) => {
				return [i, (i - w / 2) / zoom + x]
			}),
		[w, x, zoom],
	)

	const bing = useMemo(
		() =>
			Array.from(new Array(w)).map((v, i) => {
				return [i, (i - h / 2) / zoom + y]
			}),
		[h, w, y, zoom],
	)
	const [new_positions, new_colors] = useMemo(() => {
		console.warn('running memo')
		setLoading(true)
		const positions = new Float32Array(areal.length * bing.length * EDimensions.TWO_D)
		const colors = new Float32Array(areal.length * bing.length * EDimensions.THREE_D)
		const radius = 2 ** 3
		const maxIterations = 20

		// x
		areal.forEach(real_element => {
			const [b, real] = real_element
			// y
			bing.forEach(img_element => {
				const [a, img] = img_element
				// const imgi = mat`${real}+${img}*1i`h.complex(img, 1)

				const iii = new Complex(real, img)

				let z = iii
				const cz = z
				let i = 0
				// debugger
				while (i < maxIterations && math.abs(z.magnitude()) < radius) {
					i++
					z = z.multiply(z).add(cz)

					if (i < maxIterations) {
						const pix = b * w + a
						const c = new Color()
						c.setHex(0xf87b3 * math.sin(i - math.log(Math.abs(z.magnitude()), radius)))
						try {
							colors.set([c.r, c.g, c.b], pix * 3)
							positions.set([b - w / 2, a - h / 2], pix * EDimensions.TWO_D)
						} catch {}
					} else {
						const pix = b * w + a
						const c = new Color()
						c.setHex(0x000)

						try {
							colors.set([c.r, c.g, c.b], pix * 3)
							positions.set([b * 2, a * 2], pix * EDimensions.TWO_D)
						} catch {}
					}
				}
			})
		})
		setLoading(false)
		return [positions, colors]
	}, [areal, bing, h, w])

	const tick: TPointsProps<TData>['tick'] = useCallback(
		(positions: Float32Array, colors: Float32Array, state: RootState, delta: number, frame?: XRFrame | undefined) => {
			positions.set(new_positions)
			colors.set(new_colors)
			return { positions: new_positions, colors: new_colors }
		},

		[new_colors, new_positions],
	)

	return (
		<>
			<div
				style={{
					position: 'fixed',
					background: 'white',
					width: 200,
					height: 50,
					left: '50%',
					zIndex: 9999,
					opacity: 1,
					color: 'black',
					display: loading ? 'block' : 'none',
				}}
			>
				Loading...
			</div>
			<Base<TData>
				dimension={EDimensions.TWO_D}
				numParticles={areal.length * bing.length}
				tick={tick}
				pointSize={0.5}
				cameraPosition={[0, 0, -500]}
				colorAlpha={false}
				setCanvasRef={ref => {
					if (ref.current) {
						setCanvas(ref.current)
					}
				}}
			/>
		</>
	)
}

export default MandlebrotSet
