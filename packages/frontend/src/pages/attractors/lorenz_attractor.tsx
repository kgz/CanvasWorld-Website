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
import { GlossaryTerm } from '../../glossary'
import { lorenzTick } from '../../utils/lorenz'

/** Soft darker mint → pale tip (archive-like opacity on the stroke). */
const GREEN = { r: 0.08, g: 0.42, b: 0.36 }
const WHITE = { r: 0.72, g: 0.88, b: 0.82 }
/** Flat mint for gallery thumbs — translucent stacks read blotchy when downscaled. */
const SOLID = { r: 0.4, g: 1, b: 0.88 }

type TrailState = {
	x: number
	y: number
	z: number
	/** How many samples are valid in the position buffer. */
	computed: number
	sigma: number
	rho: number
	beta: number
	dt: number
}

const seedTrail = (): TrailState => ({
	x: 0.1,
	y: 0,
	z: 0,
	computed: 0,
	sigma: Number.NaN,
	rho: Number.NaN,
	beta: Number.NaN,
	dt: Number.NaN,
})

const writeColor = (colors: Float32Array, i: number, t: number) => {
	if (isScreenshotMode()) {
		colors.set([SOLID.r, SOLID.g, SOLID.b], i * 3)
		return
	}
	const fade = t < 0.72 ? 0 : (t - 0.72) / 0.28
	colors.set(
		[
			GREEN.r + (WHITE.r - GREEN.r) * fade,
			GREEN.g + (WHITE.g - GREEN.g) * fade,
			GREEN.b + (WHITE.b - GREEN.b) * fade,
		],
		i * 3,
	)
}

const LorenzAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 280,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 10, min: 0, max: 50, step: 0.0001 },
				b: { initialValue: 28, min: 0, max: 50, step: 0.0001 },
				c: { initialValue: 8 / 3, min: 0, max: 50, step: 0.0001 },
				dt: { initialValue: 0.005, min: 0.0005, max: 0.02, step: 0.0001 },
			},
			examples: [
				{ a: 10, b: 28, c: 8 / 3, dt: 0.005 },
				{ a: 10, b: 28, c: 2.667, dt: 0.004 },
				{ a: 16, b: 45.92, c: 4, dt: 0.004 },
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
		const sigma = data.a ?? datData.options.a.initialValue
		const rho = data.b ?? datData.options.b.initialValue
		const beta = data.c ?? datData.options.c.initialValue
		const dt = data.dt ?? datData.options.dt.initialValue

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current
		const zCenter = rho - 1

		const paramsChanged =
			trail.sigma !== sigma || trail.rho !== rho || trail.beta !== beta || trail.dt !== dt

		if (paramsChanged) {
			trail.x = 0.1
			trail.y = 0
			trail.z = 0
			trail.computed = 0
			trail.sigma = sigma
			trail.rho = rho
			trail.beta = beta
			trail.dt = dt
		}

		const denom = Math.max(particlesToDraw - 1, 1)

		// Already have enough samples — scrubbing or holding; don't re-integrate.
		if (particlesToDraw <= trail.computed) {
			for (let i = 0; i < particlesToDraw; i++) {
				writeColor(colors, i, i / denom)
			}
			updateProgressUI(particlesToDraw, totalParticles)
			checkCompletion(particlesToDraw, totalParticles)
			return particlesToDraw
		}

		// Extend trail from last integrated state only.
		let { x, y, z, computed } = trail

		while (computed < particlesToDraw) {
			const next = lorenzTick(x, y, z, sigma, rho, beta, dt)
			x = next.x
			y = next.y
			z = next.z
			// Front-on: lobes left/right, z up; squash depth so it reads flatter like the archive still
			const s = Math.SQRT1_2
			positions.set([(x + y) * s, z - zCenter, (x - y) * s * 0.22], computed * EDimensions.THREE_D)
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
			numParticles={resolveParticleCount(15_000)}
			tick={tick}
			drawMode="line"
			lineOpacity={isScreenshotMode() ? 1 : 0.55}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.2}
			cameraPosition={[0, 0, 48]}
		/>
	)
}

LorenzAttractor.getDescription = () => (
	<>
		The Lorenz <GlossaryTerm term="attractor" /> is a continuous-time chaotic system introduced by
		Edward Lorenz (1963) as a simplified model of atmospheric convection.{' '}
		<GlossaryTerm term="trajectory">Trajectories</GlossaryTerm> fold into the familiar butterfly of
		two lobes in 3D space — a <GlossaryTerm term="strange-attractor" /> in practice.
		<br />
		<br />
		UI params <InlineMath math="a,b,c" /> are the classic coefficients{' '}
		<InlineMath math="\sigma,\rho,\beta" />.
		<br />
		<br />
		<strong>Definition</strong> (an <GlossaryTerm term="ode" /> system):
		<BlockMath math={'\\dot{x} = \\sigma (y - x)'} />
		<BlockMath math={'\\dot{y} = x(\\rho - z) - y'} />
		<BlockMath math={'\\dot{z} = x y - \\beta z'} />
		<br />
		Defaults: <InlineMath math="\sigma=10,\ \rho=28,\ \beta=8/3" />. Soft translucent green→white GPU
		line trail with slow auto-rotate; transport <code>n</code> scrubs trail length.
	</>
)

export default LorenzAttractor
