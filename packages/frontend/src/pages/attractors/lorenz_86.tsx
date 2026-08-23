import type { RootState } from '@react-three/fiber'
import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { resolveParticleCount } from '../../modules/embedMode'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { lorenz86Tick } from '../../utils/lorenz86'

/** Archive: HSL hue from sin(x·y) in ~200–360°, sat/light 50%. */
const writeArchiveColor = (colors: Float32Array, i: number, x: number, y: number) => {
	const t = (Math.sin(x * y) + 1) * 0.5
	const h = (200 + t * 160) / 360
	const s = 0.5
	const l = isScreenshotMode() ? 0.55 : 0.5
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s
	const p = 2 * l - q
	const hue2rgb = (tt: number) => {
		let u = tt
		if (u < 0) u += 1
		if (u > 1) u -= 1
		if (u < 1 / 6) return p + (q - p) * 6 * u
		if (u < 1 / 2) return q
		if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6
		return p
	}
	colors.set([hue2rgb(h + 1 / 3), hue2rgb(h), hue2rgb(h - 1 / 3)], i * 3)
}

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
	a: number
	b: number
	f: number
	g: number
	d: number
}

const seedTrail = (): TrailState => ({
	x: 0,
	y: 0,
	z: 0,
	computed: 0,
	a: Number.NaN,
	b: Number.NaN,
	f: Number.NaN,
	g: Number.NaN,
	d: Number.NaN,
})

const Lorenz86Attractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 360,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 1.111, min: 0.5, max: 1.5, step: 0.0001 },
				b: { initialValue: 4.494, min: 4, max: 5, step: 0.0001 },
				f: { initialValue: 1.479, min: 0, max: 1.5, step: 0.0001 },
				g: { initialValue: 0.44, min: 0, max: 2, step: 0.0001 },
				d: { initialValue: 0.13, min: 0.05, max: 0.15, step: 0.00001 },
			},
			examples: [
				{ a: 1.111, b: 4.494, f: 1.479, g: 0.44, d: 0.13 },
				{ a: 1.1873, b: 4.6753, f: 1.2878, g: 0.5618, d: 0.12311 },
				{ a: 1.1873, b: 4.6753, f: 1.2699, g: 0.4741, d: 0.13227 },
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

	const tick: TPointsProps<TData>['tick'] = (
		positions: Float32Array,
		colors: Float32Array,
		_state: RootState,
		delta: number,
	) => {
		const a = data.a ?? datData.options.a.initialValue
		const b = data.b ?? datData.options.b.initialValue
		const f = data.f ?? datData.options.f.initialValue
		const g = data.g ?? datData.options.g.initialValue
		const d = data.d ?? datData.options.d.initialValue

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		const paramsChanged =
			trail.a !== a || trail.b !== b || trail.f !== f || trail.g !== g || trail.d !== d

		if (paramsChanged) {
			trail.x = 0
			trail.y = 0
			trail.z = 0
			trail.computed = 0
			trail.a = a
			trail.b = b
			trail.f = f
			trail.g = g
			trail.d = d
		}

		if (particlesToDraw <= trail.computed) {
			updateProgressUI(particlesToDraw, totalParticles)
			checkCompletion(particlesToDraw, totalParticles)
			return particlesToDraw
		}

		let { x, y, z, computed } = trail
		// Archive scale was 50; ~16 + center fills the frame without sitting inside the cloud.
		const scale = 16
		const ox = -3.0
		const oy = 12.5
		const oz = 6.3

		while (computed < particlesToDraw) {
			const next = lorenz86Tick(x, y, z, a, b, f, g, d)
			x = next.x
			y = next.y
			z = next.z
			// Archive: starField.rotation.z = π/2 → map (x,y,z) → (-y, x, z)
			positions.set(
				[-y * scale - ox, x * scale - oy, z * scale - oz],
				computed * EDimensions.THREE_D,
			)
			writeArchiveColor(colors, computed, x, y)
			computed += 1
		}

		trail.x = x
		trail.y = y
		trail.z = z
		trail.computed = computed

		updateProgressUI(particlesToDraw, totalParticles)
		checkCompletion(particlesToDraw, totalParticles)

		return particlesToDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={resolveParticleCount(30_000)}
			tick={tick}
			pointSize={1.75}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.25}
			cameraPosition={[0, 0, 95]}
		/>
	)
}

Lorenz86Attractor.getDescription = () => (
	<>
		Lorenz 86 is a continuous-time chaotic system from Edward Lorenz’s mid-1980s low-order
		atmosphere models, a different ODE set from the classic 1963 butterfly. Trajectories fold into
		a compact 3D cloud rather than twin lobes.
		<br />
		<br />
		UI knobs <InlineMath math="a,b,f,g" /> match the archive coefficients; <code>d</code> is the Euler
		step.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'\\dot{x} = -a x - y^2 - z^2 + a b'} />
		<BlockMath math={'\\dot{y} = -y + x y - f x z + g'} />
		<BlockMath math={'\\dot{z} = -z + f x y + x z'} />
		<br />
		Archive defaults: <InlineMath math="a=1.111,\ b=4.494,\ f=1.479,\ g=0.44" />,{' '}
		<InlineMath math="d=0.13" />, seed <InlineMath math="(0,0,0)" />. Drawn as a point cloud with
		archive-style HSL from <InlineMath math="\\sin(xy)" />. Transport <code>n</code> scrubs count.
		Classic Lorenz stays at <code>/lorenz_attractor</code>.
	</>
)

export default Lorenz86Attractor
