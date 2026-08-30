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
import { modifiedChuaTick } from '../../utils/modified_chua'

/** Default-orbit centroid (α…d presets). */
const CENTER = { x: 10.8, y: 0.15, z: -10.8 }
/**
 * Filament runs ≈(1,0,−1). Rotate onto +Y (archive sample is a vertical scroll stack),
 * then stretch the thin transverse axes so the face fills the frame.
 */
const AXIS = Math.PI / 4
const COS = Math.cos(AXIS)
const SIN = Math.sin(AXIS)
const SCALE_U = 2.85
const SCALE_V = 58
const SCALE_Y = 72
const BURN_IN = 2500
const _hsl = new THREE.Color()

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
	burnLeft: number
	alpha: number
	beta: number
	a: number
	b: number
	d: number
	dt: number
}

const seedTrail = (): TrailState => ({
	x: 1,
	y: 1,
	z: 0,
	computed: 0,
	burnLeft: BURN_IN,
	alpha: Number.NaN,
	beta: Number.NaN,
	a: Number.NaN,
	b: Number.NaN,
	d: Number.NaN,
	dt: Number.NaN,
})

/** Archive-style hue walk along the trail. */
const writeColor = (colors: Float32Array, i: number, t: number) => {
	_hsl.setHSL((0.05 + 0.85 * t) % 1, 0.85, 0.55)
	colors.set([_hsl.r, _hsl.g, _hsl.b], i * 3)
}

const ModifiedChuaAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 720,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				alpha: { initialValue: 10.82, min: 0, max: 20, step: 0.001 },
				beta: { initialValue: 14.286, min: 10, max: 20, step: 0.001 },
				a: { initialValue: 1.3, min: 0.1, max: 3, step: 0.001 },
				b: { initialValue: 0.11, min: 0, max: 3, step: 0.001 },
				d: { initialValue: 2.981, min: 0, max: 5, step: 0.001 },
				dt: { initialValue: 0.02, min: 0.005, max: 0.2, step: 0.001 },
			},
			examples: [
				{ alpha: 10.82, beta: 14.286, a: 1.3, b: 0.11, d: 2.981, dt: 0.02 },
				{ alpha: 10.82, beta: 14.286, a: 1.3, b: 0.11, d: 2.981, dt: 0.1 },
				{ alpha: 10.82, beta: 14.286, a: 1.3, b: 0.11, d: 0, dt: 0.02 },
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
		const alpha = data.alpha ?? datData.options.alpha.initialValue
		const beta = data.beta ?? datData.options.beta.initialValue
		const a = data.a ?? datData.options.a.initialValue
		const b = data.b ?? datData.options.b.initialValue
		const d = data.d ?? datData.options.d.initialValue
		const dt = data.dt ?? datData.options.dt.initialValue

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		const paramsChanged =
			trail.alpha !== alpha ||
			trail.beta !== beta ||
			trail.a !== a ||
			trail.b !== b ||
			trail.d !== d ||
			trail.dt !== dt

		if (paramsChanged) {
			trail.x = 1
			trail.y = 1
			trail.z = 0
			trail.computed = 0
			trail.burnLeft = BURN_IN
			trail.alpha = alpha
			trail.beta = beta
			trail.a = a
			trail.b = b
			trail.d = d
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

		let { x, y, z, computed, burnLeft } = trail

		while (burnLeft > 0) {
			const next = modifiedChuaTick(x, y, z, alpha, beta, a, b, d, dt)
			x = next.x
			y = next.y
			z = next.z
			burnLeft -= 1
		}

		while (computed < particlesToDraw) {
			const next = modifiedChuaTick(x, y, z, alpha, beta, a, b, d, dt)
			x = next.x
			y = next.y
			z = next.z
			const dx = x - CENTER.x
			const dy = y - CENTER.y
			const dz = z - CENTER.z
			const u = dx * COS - dz * SIN
			const v = dx * SIN + dz * COS
			// Vertical scroll stack (archive sample); slight depth from ODE y
			positions.set([v * SCALE_V, u * SCALE_U + 22, dy * SCALE_Y], computed * EDimensions.THREE_D)
			computed += 1
		}

		for (let i = 0; i < particlesToDraw; i++) {
			writeColor(colors, i, i / denom)
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
			numParticles={resolveParticleCount(40_000)}
			tick={tick}
			drawMode="points"
			pointSize={isScreenshotMode() ? 1.7 : 1.35}
			autoRotate={false}
			cameraPosition={[16, 0, 102]}
		/>
	)
}

ModifiedChuaAttractor.getDescription = () => (
	<>
		The Modified Chua attractor is a continuous-time multi-scroll chaotic system: a sine-shaped
		nonlinearity folds trajectories into several lobes instead of a single double-scroll.
		<br />
		<br />
		UI knobs <InlineMath math="\alpha,\beta,a,b,d" /> and <code>dt</code> (Euler step).
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'h = -b\\sin\\!\\left(\\frac{\\pi x}{2a} + d\\right)'} />
		<BlockMath math={'\\dot{x} = \\alpha(y - h)'} />
		<BlockMath math={'\\dot{y} = x - y + z'} />
		<BlockMath math={'\\dot{z} = -\\beta y'} />
		<br />
		Defaults:{' '}
		<InlineMath math="\alpha=10.82,\ \beta=14.286,\ a=1.3,\ b=0.11,\ d=2.981" />, seed{' '}
		<InlineMath math="(1,1,0)" />, <InlineMath math="dt=0.02" /> (denser cloud;{' '}
		<InlineMath math="dt=0.1" /> is also a preset). Hue walks along the orbit; scrub how many
		points are lit with <code>n</code> on the full stage.
	</>
)

export default ModifiedChuaAttractor
