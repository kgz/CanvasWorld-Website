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
import { halvorsenTick } from '../../utils/halvorsen'

const COOL = { r: 0.22, g: 0.78, b: 0.72 }
const WARM = { r: 0.95, g: 0.62, b: 0.38 }
const SOLID = { r: 0.5, g: 0.88, b: 0.82 }

const SEED = { x: -5, y: 0, z: 0 }
const SCALE = 2.6

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
	a: number
	dt: number
}

const seedTrail = (): TrailState => ({
	x: SEED.x,
	y: SEED.y,
	z: SEED.z,
	computed: 0,
	a: Number.NaN,
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

const HalvorsenAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 320,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 1.4, min: 0.5, max: 2.5, step: 0.0001 },
				dt: { initialValue: 0.01, min: 0.001, max: 0.03, step: 0.0001 },
			},
			examples: [
				{ a: 1.4, dt: 0.01 },
				{ a: 1.3, dt: 0.01 },
				{ a: 1.6, dt: 0.01 },
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
		const dt = data.dt ?? datData.options.dt.initialValue

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		const paramsChanged = trail.a !== a || trail.dt !== dt

		if (paramsChanged) {
			trail.x = SEED.x
			trail.y = SEED.y
			trail.z = SEED.z
			trail.computed = 0
			trail.a = a
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

		while (computed < particlesToDraw) {
			const next = halvorsenTick(x, y, z, a, dt)
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
			numParticles={resolveParticleCount(18_000)}
			tick={tick}
			drawMode="line"
			lineOpacity={isScreenshotMode() ? 1 : 0.5}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.25}
			cameraPosition={[0, 0, 48]}
		/>
	)
}

HalvorsenAttractor.getDescription = () => (
	<>
		The Halvorsen attractor is a continuous-time chaotic system that is cyclically symmetric: each
		equation is a rotation of the last under <InlineMath math="(x,y,z)\mapsto(y,z,x)" />.
		<br />
		<br />
		Knob <InlineMath math="a" /> is the single free coefficient; <code>dt</code> is the Euler step.
		Linear coupling is fixed at 4 in the classic form.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'\\dot{x} = -a x - 4 y - 4 z - y^2'} />
		<BlockMath math={'\\dot{y} = -a y - 4 z - 4 x - z^2'} />
		<BlockMath math={'\\dot{z} = -a z - 4 x - 4 y - x^2'} />
		<br />
		Defaults: <InlineMath math="a=1.4" />, <InlineMath math="dt=0.01" />, seed{' '}
		<InlineMath math="(-5,0,0)" />. Proposed by Arne Dehli Halvorsen; documented by J. C. Sprott.
		Cool→warm GPU line trail; transport <code>n</code> scrubs length.
	</>
)

export default HalvorsenAttractor
