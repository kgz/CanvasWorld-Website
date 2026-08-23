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
import { polynomialTypeCTick, type PolynomialTypeCCoeffs } from '../../utils/polynomialMaps'

const COOL = { r: 0.22, g: 0.7, b: 0.72 }
const WARM = { r: 0.9, g: 0.5, b: 0.4 }
const SOLID = { r: 0.4, g: 0.85, b: 0.8 }

const DEFAULTS: PolynomialTypeCCoeffs = {
	xa: -0.653165,
	xb: -0.972152,
	xc: -0.713924,
	xd: -0.481,
	xe: 0.516456,
	xf: -0.592405,
	ya: -0.268,
	yb: 0.827,
	yc: 0.379747,
	yd: -0.943,
	ye: -0.072,
	yf: 1.2,
	za: -0.47,
	zb: 0.041,
	zc: 0,
	zd: 0.914,
	ze: -0.531646,
	zf: 0.364557,
}

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
} & PolynomialTypeCCoeffs

const nanCoeffs = (): PolynomialTypeCCoeffs => ({
	xa: Number.NaN,
	xb: Number.NaN,
	xc: Number.NaN,
	xd: Number.NaN,
	xe: Number.NaN,
	xf: Number.NaN,
	ya: Number.NaN,
	yb: Number.NaN,
	yc: Number.NaN,
	yd: Number.NaN,
	ye: Number.NaN,
	yf: Number.NaN,
	za: Number.NaN,
	zb: Number.NaN,
	zc: Number.NaN,
	zd: Number.NaN,
	ze: Number.NaN,
	zf: Number.NaN,
})

const seedTrail = (): TrailState => ({
	x: 0,
	y: 0,
	z: 0,
	computed: 0,
	...nanCoeffs(),
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

const optionRange = (initialValue: number) => ({
	initialValue,
	min: -2,
	max: 2,
	step: 0.0001,
})

const PolynomialTypeC = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 400,
	})
	const trailRef = useRef<TrailState>(seedTrail())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				xa: optionRange(DEFAULTS.xa),
				xb: optionRange(DEFAULTS.xb),
				xc: optionRange(DEFAULTS.xc),
				xd: optionRange(DEFAULTS.xd),
				xe: optionRange(DEFAULTS.xe),
				xf: optionRange(DEFAULTS.xf),
				ya: optionRange(DEFAULTS.ya),
				yb: optionRange(DEFAULTS.yb),
				yc: optionRange(DEFAULTS.yc),
				yd: optionRange(DEFAULTS.yd),
				ye: optionRange(DEFAULTS.ye),
				yf: optionRange(DEFAULTS.yf),
				za: optionRange(DEFAULTS.za),
				zb: optionRange(DEFAULTS.zb),
				zc: optionRange(DEFAULTS.zc),
				zd: optionRange(DEFAULTS.zd),
				ze: optionRange(DEFAULTS.ze),
				zf: optionRange(DEFAULTS.zf),
			},
			examples: [{ ...DEFAULTS }],
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
		const coeffs: PolynomialTypeCCoeffs = {
			xa: data.xa ?? datData.options.xa.initialValue,
			xb: data.xb ?? datData.options.xb.initialValue,
			xc: data.xc ?? datData.options.xc.initialValue,
			xd: data.xd ?? datData.options.xd.initialValue,
			xe: data.xe ?? datData.options.xe.initialValue,
			xf: data.xf ?? datData.options.xf.initialValue,
			ya: data.ya ?? datData.options.ya.initialValue,
			yb: data.yb ?? datData.options.yb.initialValue,
			yc: data.yc ?? datData.options.yc.initialValue,
			yd: data.yd ?? datData.options.yd.initialValue,
			ye: data.ye ?? datData.options.ye.initialValue,
			yf: data.yf ?? datData.options.yf.initialValue,
			za: data.za ?? datData.options.za.initialValue,
			zb: data.zb ?? datData.options.zb.initialValue,
			zc: data.zc ?? datData.options.zc.initialValue,
			zd: data.zd ?? datData.options.zd.initialValue,
			ze: data.ze ?? datData.options.ze.initialValue,
			zf: data.zf ?? datData.options.zf.initialValue,
		}

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const trail = trailRef.current

		const paramsChanged =
			trail.xa !== coeffs.xa ||
			trail.xb !== coeffs.xb ||
			trail.xc !== coeffs.xc ||
			trail.xd !== coeffs.xd ||
			trail.xe !== coeffs.xe ||
			trail.xf !== coeffs.xf ||
			trail.ya !== coeffs.ya ||
			trail.yb !== coeffs.yb ||
			trail.yc !== coeffs.yc ||
			trail.yd !== coeffs.yd ||
			trail.ye !== coeffs.ye ||
			trail.yf !== coeffs.yf ||
			trail.za !== coeffs.za ||
			trail.zb !== coeffs.zb ||
			trail.zc !== coeffs.zc ||
			trail.zd !== coeffs.zd ||
			trail.ze !== coeffs.ze ||
			trail.zf !== coeffs.zf

		if (paramsChanged) {
			trail.x = 0
			trail.y = 0
			trail.z = 0
			trail.computed = 0
			trail.xa = coeffs.xa
			trail.xb = coeffs.xb
			trail.xc = coeffs.xc
			trail.xd = coeffs.xd
			trail.xe = coeffs.xe
			trail.xf = coeffs.xf
			trail.ya = coeffs.ya
			trail.yb = coeffs.yb
			trail.yc = coeffs.yc
			trail.yd = coeffs.yd
			trail.ye = coeffs.ye
			trail.yf = coeffs.yf
			trail.za = coeffs.za
			trail.zb = coeffs.zb
			trail.zc = coeffs.zc
			trail.zd = coeffs.zd
			trail.ze = coeffs.ze
			trail.zf = coeffs.zf
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
		const scale = 90

		while (computed < particlesToDraw) {
			const next = polynomialTypeCTick(x, y, z, coeffs)
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
			autoRotateSpeed={0.28}
			cameraPosition={[0, 0, 140]}
		/>
	)
}

PolynomialTypeC.getDescription = () => (
	<>
		Polynomial Type C is a per-axis quadratic map: each coordinate has six coefficients (
		<InlineMath math="a\ldots f" /> for that axis), exposed as knobs <code>xa</code>…<code>zf</code>.
		<br />
		<br />
		<strong>Definition</strong> (same shape on each axis):
		<BlockMath math={'x_{n+1} = a_x + x(b_x + c_x x + d_x y) + y(e_x + f_x y)'} />
		<BlockMath math={'y_{n+1} = a_y + y(b_y + c_y y + d_y z) + z(e_y + f_y z)'} />
		<BlockMath math={'z_{n+1} = a_z + z(b_z + c_z z + d_z x) + x(e_z + f_z x)'} />
		<br />
		Archive defaults on Classical Chaos; seed <InlineMath math="(0,0,0)" />. Cool→warm trail;
		transport <code>n</code> scrubs length.
	</>
)

export default PolynomialTypeC
