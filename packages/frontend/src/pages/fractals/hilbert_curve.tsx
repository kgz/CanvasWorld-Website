import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { BlockMath } from 'react-katex'
import { EDimensions, type TDatData, type TParticleProps } from '../../@types/gui'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { resolveParticleCount } from '../../modules/embedMode'
import { isScreenshotMode, markScreenshotReady } from '../../modules/screenshotMode'
import {
	hilbertGridSize,
	hilbertPointCount,
	hilbertWorldPoint,
	hindex2xy,
} from '../../utils/hilbert'
import Base from '../_base'

const MIN_ORDER = 3
const MAX_ORDER = 9
const DEFAULT_ORDER = 7
const THUMB_ORDER = 5
const FRAME_SPAN = 190
const TRAIL_TIP = 80
const CAM_Z = 280
const FOV_DEG = 75
const VIEW_HEIGHT_PX = 960
const PATH_LINE = 1
const PATH_CELLS = 0

const _hsl = new THREE.Color()

function squarePointMap(): THREE.Texture {
	const canvas = document.createElement('canvas')
	canvas.width = 4
	canvas.height = 4
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = '#ffffff'
		ctx.fillRect(0, 0, 4, 4)
	}
	const tex = new THREE.CanvasTexture(canvas)
	tex.needsUpdate = true
	return tex
}

const HILBERT_POINT_MAP = squarePointMap()

function cellPointSizeForGrid(cellSize: number, camZ = CAM_Z): number {
	const viewHeightWorld = 2 * camZ * Math.tan((FOV_DEG * Math.PI) / 360)
	const pxPerCell = (cellSize / viewHeightWorld) * VIEW_HEIGHT_PX
	if (pxPerCell >= 1) {
		return pxPerCell * 1.02
	}
	return cellSize * 1.35
}

function clampOrder(raw: number | undefined): number {
	if (raw === undefined) {
		return DEFAULT_ORDER
	}
	return Math.min(MAX_ORDER, Math.max(MIN_ORDER, Math.round(raw)))
}

function clampPath(raw: number | undefined): number {
	if (raw === undefined) {
		return PATH_LINE
	}
	return Math.round(raw) >= 1 ? PATH_LINE : PATH_CELLS
}

function pathColor(i: number, total: number, screenshot: boolean): void {
	if (screenshot) {
		const bands = 12
		const band = Math.min(bands - 1, Math.floor((i / Math.max(total - 1, 1)) * bands))
		_hsl.setHSL((0.78 - (band / bands) * 0.78 + 1) % 1, 1, 0.72)
		return
	}
	_hsl.setHSL(0.75 * (1 - i / Math.max(total - 1, 1)), 1, 0.5)
}

function rgbCss(): string {
	return `rgb(${Math.round(_hsl.r * 255)}, ${Math.round(_hsl.g * 255)}, ${Math.round(_hsl.b * 255)})`
}

function fillSegment(
	ctx: CanvasRenderingContext2D,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	width: number,
	color: string,
): void {
	const w = Math.max(2, Math.round(width))
	const hw = w / 2
	ctx.fillStyle = color

	if (x0 === x1) {
		const yMin = Math.min(y0, y1)
		const h = Math.abs(y1 - y0) + w
		ctx.fillRect(Math.round(x0 - hw), Math.round(yMin - hw), w, Math.round(h))
		return
	}

	const xMin = Math.min(x0, x1)
	const segW = Math.abs(x1 - x0) + w
	ctx.fillRect(Math.round(xMin - hw), Math.round(y0 - hw), Math.round(segW), w)
}

type HilbertScreenshotCanvasProps = {
	order: number
}

function HilbertScreenshotCanvas({ order }: HilbertScreenshotCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useLayoutEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) {
			return
		}

		const dpr = window.devicePixelRatio || 1
		const cssW = canvas.clientWidth || window.innerWidth
		const cssH = canvas.clientHeight || window.innerHeight
		canvas.width = Math.max(1, Math.floor(cssW * dpr))
		canvas.height = Math.max(1, Math.floor(cssH * dpr))

		const ctx = canvas.getContext('2d')
		if (!ctx) {
			return
		}

		const n = hilbertGridSize(order)
		const curveLen = hilbertPointCount(order)
		const pad = Math.floor(Math.min(canvas.width, canvas.height) * 0.06)
		const cell = (Math.min(canvas.width, canvas.height) - pad * 2) / Math.max(n - 1, 1)
		const ox = (canvas.width - cell * (n - 1)) / 2
		const oy = (canvas.height - cell * (n - 1)) / 2

		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.fillStyle = '#000'
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		ctx.imageSmoothingEnabled = false

		const strokeW = Math.max(6 * dpr, cell * 0.28)

		for (let i = 1; i < curveLen; i++) {
			const a = hindex2xy(i - 1, n)
			const b = hindex2xy(i, n)
			const x0 = ox + a.x * cell
			const y0 = oy + (n - 1 - a.y) * cell
			const x1 = ox + b.x * cell
			const y1 = oy + (n - 1 - b.y) * cell

			pathColor(i, curveLen, true)
			fillSegment(ctx, x0, y0, x1, y1, strokeW, rgbCss())
		}

		markScreenshotReady()
	}, [order])

	return (
		<canvas
			id="cw-viz-canvas"
			ref={canvasRef}
			style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}
		/>
	)
}

const HilbertCurve = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector(state => state.WebSlice)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 1000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				order: {
					initialValue: DEFAULT_ORDER,
					min: MIN_ORDER,
					max: MAX_ORDER,
					step: 1,
				},
				path: {
					initialValue: PATH_LINE,
					min: PATH_CELLS,
					max: PATH_LINE,
					step: 1,
				},
			},
			examples: [
				{ order: 5, path: PATH_LINE },
				{ order: 7, path: PATH_LINE },
				{ order: 7, path: PATH_CELLS },
			],
		}),
		[],
	)

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

	const order = clampOrder(data.order)
	const path = clampPath(data.path)
	const screenshot = isScreenshotMode()
	const linePath = path === PATH_LINE

	if (screenshot && linePath) {
		return <HilbertScreenshotCanvas order={THUMB_ORDER} />
	}

	const renderOrder = order
	const curveLen = hilbertPointCount(renderOrder)
	const n = hilbertGridSize(renderOrder)
	const camZ = CAM_Z
	const cellSize = FRAME_SPAN / Math.max(n - 1, 1)

	const tick: TParticleProps<Record<string, number>>['tick'] = (
		positions,
		colors,
		_state,
		delta,
	) => {
		const totalParticles = positions.length / EDimensions.TWO_D
		const drawn = Math.min(calculateParticlesToDraw(totalParticles, delta), totalParticles)

		for (let i = 0; i < totalParticles; i++) {
			if (i < drawn) {
				const { x, y } = hilbertWorldPoint(i, n, cellSize)
				positions.set([x, y], i * EDimensions.TWO_D)

				if (i >= drawn - TRAIL_TIP) {
					colors.set([1.0, 1.0, 0.0], i * 3)
				} else {
					pathColor(i, totalParticles, false)
					colors.set([_hsl.r, _hsl.g, _hsl.b], i * 3)
				}
			} else {
				positions.set([9999, 9999], i * EDimensions.TWO_D)
				colors.set([0, 0, 0], i * 3)
			}
		}

		updateProgressUI(drawn, totalParticles)
		checkCompletion(drawn, totalParticles)

		return drawn
	}

	return (
		<Base
			key={`${renderOrder}-${linePath ? PATH_LINE : PATH_CELLS}`}
			dimension={EDimensions.TWO_D}
			numParticles={resolveParticleCount(curveLen)}
			tick={tick}
			drawMode={linePath ? 'line' : 'points'}
			lineOpacity={1}
			pointSize={cellPointSizeForGrid(cellSize, camZ)}
			pointMap={linePath ? undefined : HILBERT_POINT_MAP}
			cameraPosition={[0, 0, camZ]}
		/>
	)
}

HilbertCurve.getDescription = () => (
	<>
		The Hilbert curve is a continuous space-filling curve: as order rises it snakes through every
		cell of a square grid while staying a single path. Classical Chaos maps Hilbert index{' '}
		<code>i</code> to a grid cell with the classic bit-twiddle (archive <code>hindex2xy</code>).
		<br />
		<br />
		<strong>Path</strong> <code>0</code> fills each cell as a square tile; <code>1</code> (default)
		connects consecutive indices as a coloured line strip — closer to the archive wire drawing.
		<br />
		<br />
		<strong>Order</strong> <code>k</code> uses an <code>N = 2^k</code> board and{' '}
		<code>N²</code> samples. Default <code>k = {DEFAULT_ORDER}</code> (
		<code>N = {hilbertGridSize(DEFAULT_ORDER)}</code>).
		<br />
		<br />
		Hue walks the path; the newest tip is yellow. Scrub <code>n</code> to grow or retract the
		curve.
		<br />
		<br />
		<strong>Limits:</strong>
		<BlockMath math={`k \\in [${MIN_ORDER}, ${MAX_ORDER}]`} />
	</>
)

export default HilbertCurve
