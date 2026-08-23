import type { RootState } from '@react-three/fiber'
import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { EDimensions, type TDatData, type TDataFromObject, type TPointsProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { resolveParticleCount } from '../../modules/embedMode'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { thomasTick } from '../../utils/thomas'

const SEED = { x: 0.1, y: 0, z: 0 }
/** Orbit |coord| ≲ 4.5; scale so the axial star fills the frame. */
const SCALE = 12
const BURN_IN = 4000
const _hsl = new THREE.Color()

/**
 * Orthonormal frame with n ∥ (1,1,1): camera on +Z sees the three-fold “star”.
 * u = (1,-1,0)/√2, v = (1,1,-2)/√6, n = (1,1,1)/√3
 */
const INV_SQRT2 = 1 / Math.SQRT2
const INV_SQRT6 = 1 / Math.sqrt(6)
const INV_SQRT3 = 1 / Math.sqrt(3)

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
	burnLeft: number
	b: number
	dt: number
}

const seedTrail = (): TrailState => ({
	x: SEED.x,
	y: SEED.y,
	z: SEED.z,
	computed: 0,
	burnLeft: BURN_IN,
	b: Number.NaN,
	dt: Number.NaN,
})

/** Axial radius → yellow core → orange → purple tips (classic star plates). */
const writeRadiusColor = (colors: Float32Array, i: number, radial: number) => {
	const t = Math.min(1, Math.max(0, radial / 4.2))
	_hsl.setHSL(0.14 - 0.42 * t, 0.92, 0.52 - 0.12 * t)
	colors.set([_hsl.r, _hsl.g, _hsl.b], i * 3)
}

const toAxial = (x: number, y: number, z: number): [number, number, number, number] => {
	const px = (x - y) * INV_SQRT2
	const py = (x + y - 2 * z) * INV_SQRT6
	// Keep a little depth so orbit still feels 3D, but the plate stays readable.
	const pz = (x + y + z) * INV_SQRT3 * 0.18
	return [px * SCALE, py * SCALE, pz * SCALE, Math.hypot(px, py)]
}

const ThomasAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 480,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				b: { initialValue: 0.208, min: 0.05, max: 0.3, step: 0.0001 },
				dt: { initialValue: 0.008, min: 0.001, max: 0.03, step: 0.0001 },
			},
			examples: [
				{ b: 0.208, dt: 0.008 },
				{ b: 0.19, dt: 0.01 },
				{ b: 0.1528, dt: 0.01 },
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
		const b = data.b ?? datData.options.b.initialValue
		const dt = data.dt ?? datData.options.dt.initialValue

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		if (trail.b !== b || trail.dt !== dt) {
			trail.x = SEED.x
			trail.y = SEED.y
			trail.z = SEED.z
			trail.computed = 0
			trail.burnLeft = BURN_IN
			trail.b = b
			trail.dt = dt
		}

		if (particlesToDraw <= trail.computed) {
			updateProgressUI(particlesToDraw, totalParticles)
			checkCompletion(particlesToDraw, totalParticles)
			return particlesToDraw
		}

		let { x, y, z, computed, burnLeft } = trail

		while (burnLeft > 0) {
			const next = thomasTick(x, y, z, b, dt)
			x = next.x
			y = next.y
			z = next.z
			burnLeft -= 1
		}

		while (computed < particlesToDraw) {
			const next = thomasTick(x, y, z, b, dt)
			x = next.x
			y = next.y
			z = next.z
			const [px, py, pz, radial] = toAxial(x, y, z)
			positions.set([px, py, pz], computed * EDimensions.THREE_D)
			writeRadiusColor(colors, computed, radial)
			computed += 1
		}

		trail.x = x
		trail.y = y
		trail.z = z
		trail.computed = computed
		trail.burnLeft = burnLeft

		updateProgressUI(particlesToDraw, totalParticles)
		checkCompletion(particlesToDraw, totalParticles)

		return particlesToDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={resolveParticleCount(220_000)}
			tick={tick}
			drawMode="line"
			lineOpacity={isScreenshotMode() ? 0.92 : 0.42}
			autoRotate={false}
			cameraPosition={[0, 0, 62]}
		/>
	)
}

ThomasAttractor.getDescription = () => (
	<>
		Thomas’s attractor is a continuous-time chaotic system that is cyclically symmetric under{' '}
		<InlineMath math="(x,y,z)\mapsto(y,z,x)" />. Each equation is a sine of the next variable minus
		damping <InlineMath math="b" /> times the current one — sometimes called labyrinth chaos. The stage
		looks down the body diagonal so the three-fold star reads clearly.
		<br />
		<br />
		Knob <InlineMath math="b" /> is the dissipation; <code>dt</code> is the Euler step. Chaos usually
		holds for <InlineMath math="b" /> ≲ about <InlineMath math="0.208" />.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'\\dot{x} = \\sin(y) - b x'} />
		<BlockMath math={'\\dot{y} = \\sin(z) - b y'} />
		<BlockMath math={'\\dot{z} = \\sin(x) - b z'} />
		<br />
		Defaults: <InlineMath math="b=0.208" />, <InlineMath math="dt=0.008" />, seed{' '}
		<InlineMath math="(0.1,0,0)" />. René Thomas (1999). Colour follows axial radius; scrub trail length
		on the full stage.
	</>
)

export default ThomasAttractor
