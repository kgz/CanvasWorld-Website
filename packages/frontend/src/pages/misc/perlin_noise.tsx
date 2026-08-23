import { BlockMath } from 'react-katex'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Vector2 } from 'three'
import { ERenderMode, type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimation } from '../../context/AnimationContext'
import { isEmbedTransportPaused } from '../../modules/embedBridge'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	PERLIN_DEFAULTS,
	clampOctaves,
	clampScale,
	clampSpeed,
} from '../../utils/perlin'
import vertexShader from '../../shaders/perlin.vert.glsl?raw'
import fragmentShader from '../../shaders/perlin.frag.glsl?raw'

const SCREENSHOT_TIME = 1.85

const PerlinNoise = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { isPausedRef, animationSpeed } = useAnimation()
	const timeRef = useRef(isScreenshotMode() ? SCREENSHOT_TIME : 0)

	const datData = useMemo(
		(): TDatData => ({
			options: {
				scale: {
					initialValue: PERLIN_DEFAULTS.scale,
					min: 0.5,
					max: 20,
					step: 0.1,
				},
				octaves: {
					initialValue: PERLIN_DEFAULTS.octaves,
					min: 1,
					max: 6,
					step: 1,
				},
				speed: {
					initialValue: PERLIN_DEFAULTS.speed,
					min: 0,
					max: 2,
					step: 0.01,
				},
			},
			examples: [
				{ scale: 4, octaves: 4, speed: 0.25 },
				{ scale: 2, octaves: 1, speed: 0.1 },
				{ scale: 8, octaves: 6, speed: 0.4 },
				{ scale: 12, octaves: 3, speed: 0.6 },
			],
		}),
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(
			setData(
				Object.fromEntries(
					Object.entries(datData.options).map(([key, value]) => [key, value.initialValue]),
				),
			),
		)
	}, [datData, dispatch])

	const scale = clampScale(data.scale ?? datData.options.scale.initialValue)
	const octaves = clampOctaves(data.octaves ?? datData.options.octaves.initialValue)
	const speed = clampSpeed(data.speed ?? datData.options.speed.initialValue)

	const [uniforms] = useState({
		u_resolution: { value: new Vector2(1, 1) },
		u_scale: { value: scale },
		u_octaves: { value: octaves },
		u_time: { value: timeRef.current },
	})

	useEffect(() => {
		uniforms.u_scale.value = scale
	}, [scale, uniforms])

	useEffect(() => {
		uniforms.u_octaves.value = octaves
	}, [octaves, uniforms])

	useEffect(() => {
		if (isScreenshotMode()) {
			timeRef.current = SCREENSHOT_TIME
			uniforms.u_time.value = SCREENSHOT_TIME
			return
		}

		let frame = 0
		let last = performance.now()

		const loop = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000)
			last = now
			const paused = isPausedRef.current || isEmbedTransportPaused()
			if (!paused) {
				timeRef.current += dt * speed * animationSpeed
				uniforms.u_time.value = timeRef.current
			}
			frame = requestAnimationFrame(loop)
		}

		frame = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(frame)
	}, [speed, animationSpeed, isPausedRef, uniforms])

	return (
		<Base<TData>
			renderMode={ERenderMode.SHADER}
			vertexShader={vertexShader}
			fragmentShader={fragmentShader}
			uniforms={uniforms}
			cameraPosition={[0, 0, 1]}
		/>
	)
}

PerlinNoise.isShaderViz = true

PerlinNoise.getDescription = () => (
	<>
		Ken Perlin’s <em>improved</em> gradient noise (2002 fade curve) as a continuous 2D field on the GPU.
		Classical Chaos stacks a few octaves (fBm) and maps the value into a cyan→magenta hue band — the same
		visual idea as the archive particle grid, without sampling a million points.
		<br />
		<br />
		<strong>Params:</strong> <code>scale</code> (spatial frequency), <code>octaves</code> (1–6 detail layers),{' '}
		<code>speed</code> (drift of the sampling window).
		<br />
		<br />
		Fade polynomial:
		<BlockMath math={'t^{3}(t(6t-15)+10)'} />
	</>
)

export default PerlinNoise
