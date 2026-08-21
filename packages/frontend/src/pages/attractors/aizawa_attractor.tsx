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
import { aizawaTick } from '../../utils/aizawa'

const COOL = { r: 0.25, g: 0.72, b: 0.78 }
const WARM = { r: 0.92, g: 0.55, b: 0.42 }
const SOLID = { r: 0.55, g: 0.85, b: 0.9 }

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
	a: number
	b: number
	c: number
	d: number
	e: number
	f: number
	dt: number
}

const seedTrail = (): TrailState => ({
	x: 0.1,
	y: 0,
	z: 0,
	computed: 0,
	a: Number.NaN,
	b: Number.NaN,
	c: Number.NaN,
	d: Number.NaN,
	e: Number.NaN,
	f: Number.NaN,
	dt: Number.NaN,
})

const writeColor = (colors: Float32Array, i: number, t: number) => {
	if (isScreenshotMode()) {
		colors.set([SOLID.r, SOLID.g, SOLID.b], i * 3)
		return
	}
	const fade = t < 0.65 ? 0 : (t - 0.65) / 0.35
	colors.set(
		[
			COOL.r + (WARM.r - COOL.r) * fade,
			COOL.g + (WARM.g - COOL.g) * fade,
			COOL.b + (WARM.b - COOL.b) * fade,
		],
		i * 3,
	)
}

const AizawaAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 320,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 0.95, min: 0, max: 2, step: 0.0001 },
				b: { initialValue: 0.7, min: 0, max: 2, step: 0.0001 },
				c: { initialValue: 0.6, min: 0, max: 2, step: 0.0001 },
				d: { initialValue: 3.5, min: 0, max: 5, step: 0.0001 },
				e: { initialValue: 0.25, min: 0, max: 2, step: 0.0001 },
				f: { initialValue: 0.1, min: 0, max: 2, step: 0.0001 },
				dt: { initialValue: 0.01, min: 0.001, max: 0.03, step: 0.0001 },
			},
			examples: [
				{ a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1, dt: 0.01 },
				{ a: 0.92125, b: 0.715, c: 0.531, d: 4.11, e: 0.281, f: 0.119, dt: 0.01 },
				{ a: 0.85, b: 0.75, c: 0.55, d: 3.8, e: 0.3, f: 0.15, dt: 0.01 },
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
		const c = data.c ?? datData.options.c.initialValue
		const d = data.d ?? datData.options.d.initialValue
		const e = data.e ?? datData.options.e.initialValue
		const f = data.f ?? datData.options.f.initialValue
		const dt = data.dt ?? datData.options.dt.initialValue

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		const paramsChanged =
			trail.a !== a ||
			trail.b !== b ||
			trail.c !== c ||
			trail.d !== d ||
			trail.e !== e ||
			trail.f !== f ||
			trail.dt !== dt

		if (paramsChanged) {
			trail.x = 0.1
			trail.y = 0
			trail.z = 0
			trail.computed = 0
			trail.a = a
			trail.b = b
			trail.c = c
			trail.d = d
			trail.e = e
			trail.f = f
			trail.dt = dt
		}

		const denom = Math.max(particlesToDraw - 1, 1)

		if (particlesToDraw <= trail.computed) {
			for (let i = 0; i < particlesToDraw; i++) {
				writeColor(colors, i, i / denom)
			}
			updateProgressUI(particlesToDraw, totalParticles)
			checkCompletion(particlesToDraw, totalParticles)
			return particlesToDraw
		}

		let { x, y, z, computed } = trail
		const scale = 18

		while (computed < particlesToDraw) {
			const next = aizawaTick(x, y, z, a, b, c, d, e, f, dt)
			x = next.x
			y = next.y
			z = next.z
			// Archive used scene.rotation.x = -π/2; map (x,y,z) → (x, z, y) for upright funnel
			positions.set([x * scale, (z - 1.1) * scale, y * scale], computed * EDimensions.THREE_D)
			computed += 1
		}

		for (let i = 0; i < particlesToDraw; i++) {
			writeColor(colors, i, i / denom)
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
			numParticles={resolveParticleCount(18_000)}
			tick={tick}
			drawMode="line"
			lineOpacity={isScreenshotMode() ? 1 : 0.5}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.25}
			cameraPosition={[0, 0, 55]}
		/>
	)
}

AizawaAttractor.getDescription = () => (
	<>
		The Aizawa attractor is a continuous-time chaotic system whose trajectories fill a round shell
		with a funnel-like hole through the middle — a frequent demo next to Lorenz in 3D chaos galleries.
		<br />
		<br />
		UI knobs <InlineMath math="a,\ldots,f" /> match the six coefficients in the ODEs below;{' '}
		<code>dt</code> is the Euler step.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'\\dot{x} = (z - b)x - d y'} />
		<BlockMath math={'\\dot{y} = d x + (z - b)y'} />
		<BlockMath
			math={
				'\\dot{z} = c + a z - \\frac{z^3}{3} - (x^2 + y^2)(1 + e z) + f z x^3'
			}
		/>
		<br />
		Archive-style defaults (preset): <InlineMath math="a=0.95,\ b=0.7,\ c=0.6,\ d=3.5,\ e=0.25,\ f=0.1" />
		, <InlineMath math="dt=0.01" />, seed <InlineMath math="(0.1,0,0)" />. Cool→warm GPU line trail;
		transport <code>n</code> scrubs length.
	</>
)

export default AizawaAttractor
