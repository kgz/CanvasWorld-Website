import { InlineMath } from 'react-katex'
import { useEffect, useMemo } from 'react'
import { type TDatData, type TDataFromObject } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { buildBryantBoyMesh } from '../../utils/boySurface'

const BoyJuryBryant = () => {
	const dispatch = useAppDispatch()
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 14000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {},
			examples: [],
		}),
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

	useEffect(() => {
		void dispatch(setDatData(datData))
		void dispatch(setData({}))
	}, [datData, dispatch])

	const mesh = useMemo(() => buildBryantBoyMesh(), [])

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
			autoRotateSpeed={0.32}
			cameraPosition={[0, 0, 4.2]}
		/>
	)
}

BoyJuryBryant.getDescription = () => (
	<>
		Jury page: Bryant–Kusner lit mesh of Boy’s surface (immersion of{' '}
		<InlineMath math="\mathbb{RP}^2" /> in <InlineMath math="\mathbb{R}^3" />
		). Same mesh chrome as the main Boy page; alternate math from Morin–Apéry on{' '}
		<code>/boy_surface</code>. Temporary — for render-mode comparison only.
		<br />
		<br />
		Transport <code>n</code> reveals triangles.
	</>
)

export default BoyJuryBryant
