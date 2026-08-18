import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildGyroidMesh, clampIso, clampRes, clampTiles } from '../../utils/gyroid'

const Gyroid = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 12000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				t: { initialValue: 0, min: -1.2, max: 1.2, step: 0.01 },
				res: { initialValue: 36, min: 16, max: 56, step: 1 },
				tiles: { initialValue: 1, min: 1, max: 2, step: 1 },
			},
			examples: [
				{ t: 0, res: 36, tiles: 1 },
				{ t: 0.45, res: 40, tiles: 1 },
				{ t: -0.35, res: 36, tiles: 1 },
				{ t: 0, res: 28, tiles: 2 },
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
	const res = clampRes(data.res ?? datData.options.res.initialValue)
	const tiles = clampTiles(data.tiles ?? datData.options.tiles.initialValue)

	const mesh = useMemo(() => buildGyroidMesh(iso, res, tiles), [iso, res, tiles])

	const tick = (delta: number) => {
		const total = mesh.indices.length
		const toDraw = calculateParticlesToDraw(total, delta)
		updateProgressUI(toDraw, total)
		checkCompletion(toDraw, total)
		return toDraw
	}

	return (
		<Base<TData>
			drawMode="mesh"
			positions={mesh.positions}
			indices={mesh.indices}
			colors={mesh.colors}
			progressTick={tick}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.28}
			cameraPosition={[0, 0, 3.7]}
		/>
	)
}

Gyroid.getDescription = () => (
	<>
		Schoen’s gyroid (1970) is a triply periodic minimal surface: a two-sided labyrinth that repeats
		on a cubic lattice. This page meshes the trigonometric implicit (a close approximation to the
		true minimal surface), not the Weierstrass parametrization.
		<br />
		<br />
		<strong>Level set</strong> on <InlineMath math="[0, 2\pi\cdot\mathrm{tiles}]^3" />:
		<BlockMath math={'\\sin x\\,\\cos y + \\sin y\\,\\cos z + \\sin z\\,\\cos x = t'} />
		<br />
		UI <InlineMath math="t" /> is the iso-level (0 = balanced gyroid), <InlineMath math="res" /> is
		samples per period, <InlineMath math="tiles" /> repeats the cell. Transport <code>n</code>{' '}
		reveals triangles.
	</>
)

export default Gyroid
