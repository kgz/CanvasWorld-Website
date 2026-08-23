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
import { polynomialTypeATick } from '../../utils/polynomialMaps'

const COOL = { r: 0.28, g: 0.62, b: 0.88 }
const WARM = { r: 0.95, g: 0.58, b: 0.35 }
const SOLID = { r: 0.45, g: 0.75, b: 0.95 }

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
	a: number
	b: number
	c: number
}

const seedTrail = (): TrailState => ({
	x: 0,
	y: 0,
	z: 0,
	computed: 0,
	a: Number.NaN,
	b: Number.NaN,
	c: Number.NaN,
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

const PolynomialTypeA = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 400,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 1.586, min: 0, max: 2, step: 0.0001 },
				b: { initialValue: 1.124, min: 0, max: 2, step: 0.0001 },
				c: { initialValue: 0.281, min: 0, max: 2, step: 0.0001 },
			},
			examples: [
				{ a: 1.586, b: 1.124, c: 0.281 },
				{ a: 1.4, b: 1.0, c: 0.35 },
				{ a: 1.7, b: 1.2, c: 0.2 },
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

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		if (trail.a !== a || trail.b !== b || trail.c !== c) {
			trail.x = 0
			trail.y = 0
			trail.z = 0
			trail.computed = 0
			trail.a = a
			trail.b = b
			trail.c = c
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
		const scale = 70

		while (computed < particlesToDraw) {
			const next = polynomialTypeATick(x, y, z, a, b, c)
			x = next.x
			y = next.y
			z = next.z
			positions.set([x * scale, y * scale, z * scale], computed * EDimensions.THREE_D)
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
			lineOpacity={isScreenshotMode() ? 1 : 0.55}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.3}
			cameraPosition={[0, 0, 180]}
		/>
	)
}

PolynomialTypeA.getDescription = () => (
	<>
		Polynomial Type A is a compact 3D discrete map — three knobs, quadratic cross terms, and a dense
		orbit that fills a tangled shell.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = a + y_n - z_n y_n'} />
		<BlockMath math={'y_{n+1} = b + z_n - x_n z_n'} />
		<BlockMath math={'z_{n+1} = c + x_n - y_n x_n'} />
		<br />
		Archive defaults: <InlineMath math="a=1.586,\ b=1.124,\ c=0.281" />, seed{' '}
		<InlineMath math="(0,0,0)" />. Cool→warm GPU line trail; transport <code>n</code> scrubs length.
	</>
)

export default PolynomialTypeA
