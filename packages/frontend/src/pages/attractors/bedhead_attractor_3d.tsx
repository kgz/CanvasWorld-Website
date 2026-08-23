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
import { bedheadAttractor3dTick } from '../../utils/bedheadAttractor3d'

/** Archive PointsMaterial 0xE27C2E — body vs tip. */
const BODY = { r: 0.89, g: 0.49, b: 0.18 }
const TIP = { r: 1, g: 0.82, b: 0.55 }
const SOLID = { r: 0.89, g: 0.49, b: 0.18 }

type CloudState = {
	x: number
	y: number
	z: number
	computed: number
	a: number
	b: number
}

const seedCloud = (): CloudState => ({
	x: 0,
	y: 0,
	z: 0,
	computed: 0,
	a: Number.NaN,
	b: Number.NaN,
})

const writeColor = (colors: Float32Array, i: number, t: number) => {
	if (isScreenshotMode()) {
		colors.set([SOLID.r, SOLID.g, SOLID.b], i * 3)
		return
	}
	const fade = t < 0.92 ? 0 : (t - 0.92) / 0.08
	colors.set(
		[
			BODY.r + (TIP.r - BODY.r) * fade,
			BODY.g + (TIP.g - BODY.g) * fade,
			BODY.b + (TIP.b - BODY.b) * fade,
		],
		i * 3,
	)
}

const BedheadAttractor3d = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 2400,
	})
	const cloudRef = useRef<CloudState>(seedCloud())

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 0.13, min: 0, max: 5, step: 0.001 },
				b: { initialValue: 0.37, min: 0.001, max: 1.5, step: 0.001 },
			},
			examples: [
				{ a: 0.13, b: 0.37 },
				{ a: 0.65, b: 0.73 },
				{ a: 0.4, b: 0.55 },
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

		const totalParticles = positions.length / EDimensions.THREE_D
		const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)
		const cloud = cloudRef.current

		const paramsChanged = cloud.a !== a || cloud.b !== b

		if (paramsChanged) {
			cloud.x = 0
			cloud.y = 0
			cloud.z = 0
			cloud.computed = 0
			cloud.a = a
			cloud.b = b
		}

		const denom = Math.max(particlesToDraw - 1, 1)

		if (particlesToDraw <= cloud.computed) {
			for (let i = 0; i < particlesToDraw; i++) {
				writeColor(colors, i, i / denom)
			}
			updateProgressUI(particlesToDraw, totalParticles)
			checkCompletion(particlesToDraw, totalParticles)
			return particlesToDraw
		}

		let { x, y, z, computed } = cloud
		const scale = 8

		while (computed < particlesToDraw) {
			const next = bedheadAttractor3dTick(x, y, z, a, b)
			x = Math.max(-1000, Math.min(1000, next.x))
			y = Math.max(-1000, Math.min(1000, next.y))
			z = Math.max(-1000, Math.min(1000, next.z))
			positions.set([x * scale, y * scale, z * scale], computed * EDimensions.THREE_D)
			computed += 1
		}

		for (let i = 0; i < particlesToDraw; i++) {
			writeColor(colors, i, i / denom)
		}

		cloud.x = x
		cloud.y = y
		cloud.z = z
		cloud.computed = computed

		updateProgressUI(particlesToDraw, totalParticles)
		checkCompletion(particlesToDraw, totalParticles)

		return particlesToDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={resolveParticleCount(80_000)}
			tick={tick}
			pointSize={isScreenshotMode() ? 1.4 : 0.8}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.3}
			cameraPosition={[0, 0, 280]}
		/>
	)
}

BedheadAttractor3d.getDescription = () => (
	<>
		The Bedhead attractor in 3D is the familiar discrete map with an extra{' '}
		<InlineMath math="z" /> update so the iterates fill a volume instead of a plane. The{' '}
		<InlineMath math="x" /> and <InlineMath math="y" /> steps match the 2D stage;{' '}
		<InlineMath math="z" /> was added in the archive workshop for depth.
		<br />
		<br />
		<strong>Definition:</strong>
		<BlockMath math={'x_{n+1} = \\sin(x y / b)\\, y + \\cos(a x - y)'} />
		<BlockMath math={'y_{n+1} = x + \\sin(y)/b'} />
		<BlockMath math={'z_{n+1} = y + \\cos(y x)/b'} />
		<br />
		Archive-style defaults: <InlineMath math="a=0.13,\ b=0.37" />, seed{' '}
		<InlineMath math="(0,0,0)" />. Warm amber point cloud; transport <code>n</code> scrubs how many
		iterates are drawn. The 2D Bedhead stage stays at <code>bedhead_attractor</code>.
	</>
)

export default BedheadAttractor3d
