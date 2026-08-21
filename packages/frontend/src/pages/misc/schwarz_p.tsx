import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { SCHWARZ_MAX_POINTS, clampIso, clampTiles, sampleSchwarzPCloud } from '../../utils/schwarzP'

const SchwarzP = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const cloudRef = useRef<ReturnType<typeof sampleSchwarzPCloud> | null>(null)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 28000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				t: { initialValue: 0, min: -1.2, max: 1.2, step: 0.01 },
				tiles: { initialValue: 2, min: 1, max: 4, step: 1 },
			},
			examples: [
				{ t: 0, tiles: 2 },
				{ t: 0.45, tiles: 2 },
				{ t: -0.35, tiles: 2 },
				{ t: 0, tiles: 3 },
				{ t: 0, tiles: 4 },
				{ t: 0, tiles: 1 },
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

	const iso = clampIso(data.t ?? datData.options.t.initialValue)
	const tiles = clampTiles(data.tiles ?? datData.options.tiles.initialValue)
	const cloud = useMemo(() => sampleSchwarzPCloud(iso, tiles), [iso, tiles])
	if (cloudRef.current !== cloud) {
		cloudRef.current = cloud
		seeded.current = false
	}

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		const next = cloudRef.current
		if (next && !seeded.current) {
			positions.set(next.positions)
			colors.set(next.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(SCHWARZ_MAX_POINTS, delta)
		updateProgressUI(toDraw, SCHWARZ_MAX_POINTS)
		checkCompletion(toDraw, SCHWARZ_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={SCHWARZ_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.2]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
		/>
	)
}

SchwarzP.getDescription = () => (
	<>
		Schwarz’s primitive (P) surface is a triply periodic minimal surface: a two-sided labyrinth that
		repeats on a cubic lattice. Particle wire of the trigonometric implicit (a close approximation to
		the true minimal surface) — no lit mesh.
		<br />
		<br />
		<strong>Level set</strong> on <InlineMath math="[0, 2\pi\cdot\mathrm{tiles}]^3" />:
		<BlockMath math={'\\cos x + \\cos y + \\cos z = t'} />
		<br />
		UI <InlineMath math="t" /> is the iso-level (0 = balanced P), <InlineMath math="tiles" /> repeats
		the cell. Transport <code>n</code> reveals points.
	</>
)

export default SchwarzP
