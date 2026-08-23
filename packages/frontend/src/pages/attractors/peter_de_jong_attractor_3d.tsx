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
import { peterDeJong3dTick } from '../../utils/peterDeJong3d'

const COOL = { r: 0.78, g: 0.32, b: 0.48 }
const WARM = { r: 0.95, g: 0.78, b: 0.42 }
const SOLID = { r: 0.9, g: 0.55, b: 0.5 }

const SEED = { x: 0, y: 0, z: 0 }
const SCALE = 50

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

const writeColor = (colors: Float32Array, i: number, t: number) => {
	if (isScreenshotMode()) {
		colors.set([SOLID.r, SOLID.g, SOLID.b], i * 3)
		return
	}
	const fade = t < 0.62 ? 0 : (t - 0.62) / 0.38
	colors.set(
		[
			COOL.r + (WARM.r - COOL.r) * fade,
			COOL.g + (WARM.g - COOL.g) * fade,
			COOL.b + (WARM.b - COOL.b) * fade,
		],
		i * 3,
	)
}

const PeterDeJongAttractor3d = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 420,
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
			positions.set([x * SCALE, y * SCALE, z * SCALE], computed * EDimensions.THREE_D)
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
			numParticles={resolveParticleCount(40_000)}
			tick={tick}
			drawMode="line"
			lineOpacity={isScreenshotMode() ? 1 : 0.42}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
			cameraPosition={[0, 0, 220]}
		/>
	)
}

PeterDeJongAttractor3d.getDescription = () => (
	<>
		The 3D Peter de Jong attractor extends the familiar sine–cosine map into three coordinates: six
		real knobs and a discrete step that updates <InlineMath math="x,y,z" /> together. Distinct from
		the planar four-parameter de Jong map.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = \\sin(a z_n) - \\cos(b x_n)'} />
		<BlockMath math={'y_{n+1} = \\sin(c x_n) - \\cos(d y_n)'} />
		<BlockMath math={'z_{n+1} = \\sin(e y_n) - \\cos(f z_n)'} />
		<br />
		Archive defaults: <InlineMath math="a=2.695,\ b=1.72,\ c=1.178,\ d=0.311,\ e=-1,\ f=-1" />, seed{' '}
		<InlineMath math="(0,0,0)" />, positions ×50. Rose→gold GPU line trail; transport <code>n</code>{' '}
		scrubs length.
	</>
)

export default PeterDeJongAttractor3d
