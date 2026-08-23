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
import { polynomialAbsTick, type PolynomialAbsCoeffs } from '../../utils/polynomialMaps'

const COOL = { r: 0.4, g: 0.45, b: 0.9 }
const WARM = { r: 0.95, g: 0.55, b: 0.3 }
const SOLID = { r: 0.55, g: 0.6, b: 0.95 }

const DEFAULTS: PolynomialAbsCoeffs = {
	xa: 0.607407407407407,
	xb: 1.1322,
	xc: 0.4704,
	xd: -0.0148,
	xe: -0.3236,
	xf: -0.4119,
	xg: -0.1913,
	ya: -0.693,
	yb: -0.521,
	yc: 0.399,
	yd: -0.968,
	ye: 0.958,
	yf: 0.305,
	yg: -0.43,
	za: 0.133,
	zb: 0.416,
	zc: 1.144,
	zd: -0.651851851851852,
	ze: -0.844444444444444,
	zf: 0.754,
	zg: -0.414814814814815,
}

const ALT: PolynomialAbsCoeffs = {
	xa: 0.607407407407407,
	xb: 1.159,
	xc: 0.281481481481481,
	xd: -0.191,
	xe: -0.348,
	xf: -0.176,
	xg: -0.702,
	ya: -0.693,
	yb: -0.521,
	yc: 0.399,
	yd: -0.968,
	ye: 0.958,
	yf: 0.305,
	yg: -0.43,
	za: 0.133,
	zb: 0.416,
	zc: 1.144,
	zd: -0.651851851851852,
	ze: -0.844444444444444,
	zf: 0.754,
	zg: -0.414814814814815,
}

type TrailState = {
	x: number
	y: number
	z: number
	computed: number
} & PolynomialAbsCoeffs

const nanCoeffs = (): PolynomialAbsCoeffs => ({
	xa: Number.NaN,
	xb: Number.NaN,
	xc: Number.NaN,
	xd: Number.NaN,
	xe: Number.NaN,
	xf: Number.NaN,
	xg: Number.NaN,
	ya: Number.NaN,
	yb: Number.NaN,
	yc: Number.NaN,
	yd: Number.NaN,
	ye: Number.NaN,
	yf: Number.NaN,
	yg: Number.NaN,
	za: Number.NaN,
	zb: Number.NaN,
	zc: Number.NaN,
	zd: Number.NaN,
	ze: Number.NaN,
	zf: Number.NaN,
	zg: Number.NaN,
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

const PolynomialAbs = () => {
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
				xg: optionRange(DEFAULTS.xg),
				ya: optionRange(DEFAULTS.ya),
				yb: optionRange(DEFAULTS.yb),
				yc: optionRange(DEFAULTS.yc),
				yd: optionRange(DEFAULTS.yd),
				ye: optionRange(DEFAULTS.ye),
				yf: optionRange(DEFAULTS.yf),
				yg: optionRange(DEFAULTS.yg),
				za: optionRange(DEFAULTS.za),
				zb: optionRange(DEFAULTS.zb),
				zc: optionRange(DEFAULTS.zc),
				zd: optionRange(DEFAULTS.zd),
				ze: optionRange(DEFAULTS.ze),
				zf: optionRange(DEFAULTS.zf),
				zg: optionRange(DEFAULTS.zg),
			},
			examples: [{ ...DEFAULTS }, { ...ALT }],
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
		const coeffs: PolynomialAbsCoeffs = {
			xa: data.xa ?? datData.options.xa.initialValue,
			xb: data.xb ?? datData.options.xb.initialValue,
			xc: data.xc ?? datData.options.xc.initialValue,
			xd: data.xd ?? datData.options.xd.initialValue,
			xe: data.xe ?? datData.options.xe.initialValue,
			xf: data.xf ?? datData.options.xf.initialValue,
			xg: data.xg ?? datData.options.xg.initialValue,
			ya: data.ya ?? datData.options.ya.initialValue,
			yb: data.yb ?? datData.options.yb.initialValue,
			yc: data.yc ?? datData.options.yc.initialValue,
			yd: data.yd ?? datData.options.yd.initialValue,
			ye: data.ye ?? datData.options.ye.initialValue,
			yf: data.yf ?? datData.options.yf.initialValue,
			yg: data.yg ?? datData.options.yg.initialValue,
			za: data.za ?? datData.options.za.initialValue,
			zb: data.zb ?? datData.options.zb.initialValue,
			zc: data.zc ?? datData.options.zc.initialValue,
			zd: data.zd ?? datData.options.zd.initialValue,
			ze: data.ze ?? datData.options.ze.initialValue,
			zf: data.zf ?? datData.options.zf.initialValue,
			zg: data.zg ?? datData.options.zg.initialValue,
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
			trail.xg !== coeffs.xg ||
			trail.ya !== coeffs.ya ||
			trail.yb !== coeffs.yb ||
			trail.yc !== coeffs.yc ||
			trail.yd !== coeffs.yd ||
			trail.ye !== coeffs.ye ||
			trail.yf !== coeffs.yf ||
			trail.yg !== coeffs.yg ||
			trail.za !== coeffs.za ||
			trail.zb !== coeffs.zb ||
			trail.zc !== coeffs.zc ||
			trail.zd !== coeffs.zd ||
			trail.ze !== coeffs.ze ||
			trail.zf !== coeffs.zf ||
			trail.zg !== coeffs.zg

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
			trail.xg = coeffs.xg
			trail.ya = coeffs.ya
			trail.yb = coeffs.yb
			trail.yc = coeffs.yc
			trail.yd = coeffs.yd
			trail.ye = coeffs.ye
			trail.yf = coeffs.yf
			trail.yg = coeffs.yg
			trail.za = coeffs.za
			trail.zb = coeffs.zb
			trail.zc = coeffs.zc
			trail.zd = coeffs.zd
			trail.ze = coeffs.ze
			trail.zf = coeffs.zf
			trail.zg = coeffs.zg
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
		const scale = 55

		while (computed < particlesToDraw) {
			const next = polynomialAbsTick(x, y, z, coeffs)
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
			cameraPosition={[0, 0, 200]}
		/>
	)
}

PolynomialAbs.getDescription = () => (
	<>
		Polynomial ABS is a 3D absolute-value affine map: each new coordinate is a linear combination of{' '}
		<InlineMath math="x,y,z" /> and <InlineMath math="|x|,|y|,|z|" />. Seven coeffs per axis (
		<code>xa</code>…<code>zg</code>).
		<br />
		<br />
		<strong>Definition</strong> (same shape on each axis):
		<BlockMath
			math={
				'x_{n+1} = a_x + b_x x + c_x y + d_x z + e_x |x| + f_x |y| + g_x |z|'
			}
		/>
		<BlockMath
			math={
				'y_{n+1} = a_y + b_y x + c_y y + d_y z + e_y |x| + f_y |y| + g_y |z|'
			}
		/>
		<BlockMath
			math={
				'z_{n+1} = a_z + b_z x + c_z y + d_z z + e_z |x| + f_z |y| + g_z |z|'
			}
		/>
		<br />
		Archive defaults on Classical Chaos; second preset from the alternate archive script. Seed{' '}
		<InlineMath math="(0,0,0)" />. Cool→warm trail; transport <code>n</code> scrubs length.
	</>
)

export default PolynomialAbs
