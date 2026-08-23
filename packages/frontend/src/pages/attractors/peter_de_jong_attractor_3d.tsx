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
import { peterDeJong3dTick } from '../../utils/peterDeJong3d'

const SEED = { x: 0, y: 0, z: 0 }
/** Default-orbit centroid so the volume sits in frame (not bottom-left). */
const CENTER = { x: -0.32, y: -1.19, z: -0.18 }
const SCALE = 68
const _hsl = new THREE.Color()

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
}

const seedTrail = (): TrailState => ({
	x: SEED.x,
	y: SEED.y,
	z: SEED.z,
	computed: 0,
	a: Number.NaN,
	b: Number.NaN,
	c: Number.NaN,
	d: Number.NaN,
	e: Number.NaN,
	f: Number.NaN,
})

/** Smooth hue along age — magenta → cyan. */
const writeColor = (colors: Float32Array, i: number, t: number) => {
	_hsl.setHSL(0.92 - 0.55 * t, 0.95, 0.55)
	colors.set([_hsl.r, _hsl.g, _hsl.b], i * 3)
}

const PeterDeJongAttractor3d = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 520,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 2.695, min: -5, max: 5, step: 0.001 },
				b: { initialValue: 1.72, min: -5, max: 5, step: 0.001 },
				c: { initialValue: 1.178, min: -5, max: 5, step: 0.001 },
				d: { initialValue: 0.311, min: -5, max: 5, step: 0.001 },
				e: { initialValue: -1, min: -5, max: 5, step: 0.001 },
				f: { initialValue: -1, min: -5, max: 5, step: 0.001 },
			},
			examples: [
				{ a: 2.695, b: 1.72, c: 1.178, d: 0.311, e: -1, f: -1 },
				{ a: -2.24, b: 0.43, c: -0.65, d: -2.43, e: -1.5, f: 1.2 },
				{ a: 1.4, b: -2.3, c: 2.4, d: -2.1, e: -1.8, f: 1.6 },
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

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		const paramsChanged =
			trail.a !== a ||
			trail.b !== b ||
			trail.c !== c ||
			trail.d !== d ||
			trail.e !== e ||
			trail.f !== f

		if (paramsChanged) {
			trail.x = SEED.x
			trail.y = SEED.y
			trail.z = SEED.z
			trail.computed = 0
			trail.a = a
			trail.b = b
			trail.c = c
			trail.d = d
			trail.e = e
			trail.f = f
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

		while (computed < particlesToDraw) {
			const next = peterDeJong3dTick(x, y, z, a, b, c, d, e, f)
			x = next.x
			y = next.y
			z = next.z
			positions.set(
				[(x - CENTER.x) * SCALE, (y - CENTER.y) * SCALE, (z - CENTER.z) * SCALE],
				computed * EDimensions.THREE_D,
			)
			writeColor(colors, computed, computed / denom)
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
			numParticles={resolveParticleCount(160_000)}
			tick={tick}
			drawMode="points"
			pointSize={isScreenshotMode() ? 1.35 : 1.05}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
			cameraPosition={[0, 0, 210]}
		/>
	)
}

PeterDeJongAttractor3d.getDescription = () => (
	<>
		The 3D Peter de Jong attractor extends the sine–cosine map into three coordinates: six real knobs
		and a discrete step that updates <InlineMath math="x,y,z" /> together. Distinct from the planar
		four-parameter de Jong cloud.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = \\sin(a z_n) - \\cos(b x_n)'} />
		<BlockMath math={'y_{n+1} = \\sin(c x_n) - \\cos(d y_n)'} />
		<BlockMath math={'z_{n+1} = \\sin(e y_n) - \\cos(f z_n)'} />
		<br />
		Defaults: <InlineMath math="a=2.695,\ b=1.72,\ c=1.178,\ d=0.311,\ e=-1,\ f=-1" />, seed{' '}
		<InlineMath math="(0,0,0)" />. Drawn as a coloured point volume; scrub how many points are lit on
		the full stage.
	</>
)

export default PeterDeJongAttractor3d
