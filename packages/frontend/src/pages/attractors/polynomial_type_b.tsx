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
import { polynomialTypeBTick } from '../../utils/polynomialMaps'

const COOL = { r: 0.35, g: 0.55, b: 0.92 }
const WARM = { r: 0.92, g: 0.45, b: 0.55 }
const SOLID = { r: 0.5, g: 0.7, b: 0.95 }

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
	x: 0,
	y: 0,
	z: 0,
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

const PolynomialTypeB = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 400,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 1.6691, min: 0, max: 2, step: 0.0001 },
				b: { initialValue: 1.0405, min: 0, max: 2, step: 0.0001 },
				c: { initialValue: 0.2818, min: 0, max: 2, step: 0.0001 },
				d: { initialValue: 0.2818, min: 0, max: 2, step: 0.0001 },
				e: { initialValue: 0, min: 0, max: 2, step: 0.0001 },
				f: { initialValue: 1.1055, min: 0, max: 2, step: 0.0001 },
			},
			examples: [
				{ a: 1.6691, b: 1.0405, c: 0.2818, d: 0.2818, e: 0, f: 1.1055 },
				{ a: 1.5607, b: 1.0405, c: 0.5419, d: 0.2818, e: 1.539, f: 1.6257 },
				{ a: 1.5, b: 1.0, c: 0.4, d: 0.4, e: 0.2, f: 1.2 },
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
			trail.x = 0
			trail.y = 0
			trail.z = 0
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
		const scale = 70

		while (computed < particlesToDraw) {
			const next = polynomialTypeBTick(x, y, z, a, b, c, d, e, f)
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

PolynomialTypeB.getDescription = () => (
	<>
		Polynomial Type B extends Type A with three scale factors on the product terms — six knobs that
		reshape the same cyclic coupling.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = a + y_n - z_n (b y_n)'} />
		<BlockMath math={'y_{n+1} = c + z_n - x_n (d z_n)'} />
		<BlockMath math={'z_{n+1} = e + x_n - y_n (f x_n)'} />
		<br />
		Archive <code>index.js</code> defaults:{' '}
		<InlineMath math="a=1.6691,\ b=1.0405,\ c=0.2818,\ d=0.2818,\ e=0,\ f=1.1055" />, seed{' '}
		<InlineMath math="(0,0,0)" />. A second preset keeps the README decimals. Cool→warm trail;
		transport <code>n</code> scrubs length.
	</>
)

export default PolynomialTypeB
