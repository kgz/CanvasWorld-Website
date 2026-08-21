import { BlockMath, InlineMath } from 'react-katex'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { GYROID_MAX_POINTS, clampIso, clampTiles, sampleGyroidCloud } from '../../utils/gyroid'

const Gyroid = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
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
	const dIso = useDeferredValue(iso)
	const dTiles = useDeferredValue(tiles)
	const cloud = useMemo(() => sampleGyroidCloud(dIso, dTiles), [dIso, dTiles])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = calculateParticlesToDraw(GYROID_MAX_POINTS, delta)
		updateProgressUI(toDraw, GYROID_MAX_POINTS)
		checkCompletion(toDraw, GYROID_MAX_POINTS)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={GYROID_MAX_POINTS}
			pointSize={1.15}
			tick={tick}
			cameraPosition={[0, 0, 3.7]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
		/>
	)
}

Gyroid.getDescription = () => (
	<>
		Schoen’s gyroid (1970) is a triply periodic minimal surface: a two-sided labyrinth that repeats
		on a cubic lattice. Particle wire of the trigonometric implicit (a close approximation to the
		true minimal surface) — no lit mesh.
		<br />
		<br />
		<strong>Level set</strong> on <InlineMath math="[0, 2\pi\cdot\mathrm{tiles}]^3" />:
		<BlockMath math={'\\sin x\\,\\cos y + \\sin y\\,\\cos z + \\sin z\\,\\cos x = t'} />
		<br />
		UI <InlineMath math="t" /> is the iso-level (0 = balanced gyroid), <InlineMath math="tiles" />{' '}
		repeats the cell. Transport <code>n</code> reveals points.
	</>
)

export default Gyroid
