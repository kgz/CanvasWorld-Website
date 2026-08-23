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
import { modifiedChuaTick } from '../../utils/modified_chua'

const COOL = { r: 0.35, g: 0.55, b: 0.95 }
const WARM = { r: 0.95, g: 0.45, b: 0.65 }
const SOLID = { r: 0.55, g: 0.7, b: 1 }

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
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
	alpha: Number.NaN,
	beta: Number.NaN,
	a: Number.NaN,
	b: Number.NaN,
	d: Number.NaN,
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

const ModifiedChuaAttractor = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 560,
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
				// Archive GUI used 0.1 (point cloud); denser Euler for GPU line trail
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

		let { x, y, z, computed } = trail
		// Extent ~±80; scale into a Lorenz-like stage (~±30)
		const scale = 1.85

		while (computed < particlesToDraw) {
			const next = modifiedChuaTick(x, y, z, alpha, beta, a, b, d, dt)
			x = next.x
			y = next.y
			z = next.z
			// Scrolls along X, Z up; squash thin Y so multi-scroll reads face-on
			positions.set([x * scale, z * scale, y * scale * 0.55], computed * EDimensions.THREE_D)
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
			numParticles={resolveParticleCount(28_000)}
			tick={tick}
			drawMode="line"
			lineOpacity={isScreenshotMode() ? 1 : 0.5}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.25}
			cameraPosition={[0, 6, 95]}
		/>
	)
}

ModifiedChuaAttractor.getDescription = () => (
	<>
		The Modified Chua attractor is a continuous-time multi-scroll chaotic system: a sine-shaped
		nonlinearity folds trajectories into several lobes instead of a single double-scroll.
		<br />
		<br />
		UI knobs <InlineMath math="\alpha,\beta,a,b,d" /> match the archive coefficients;{' '}
		<code>dt</code> is the Euler step.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'h = -b\\sin\\!\\left(\\frac{\\pi x}{2a} + d\\right)'} />
		<BlockMath math={'\\dot{x} = \\alpha(y - h)'} />
		<BlockMath math={'\\dot{y} = x - y + z'} />
		<BlockMath math={'\\dot{z} = -\\beta y'} />
		<br />
		Archive coefficients (preset):{' '}
		<InlineMath math="\alpha=10.82,\ \beta=14.286,\ a=1.3,\ b=0.11,\ d=2.981" />, seed{' '}
		<InlineMath math="(1,1,0)" />. Default <InlineMath math="dt=0.02" /> for a dense GPU line trail
		(archive point cloud used <InlineMath math="dt=0.1" />, also a preset). Cool→warm trail; transport{' '}
		<code>n</code> scrubs length.
	</>
)

export default ModifiedChuaAttractor
