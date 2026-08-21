import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type MouseEvent, type ReactNode, type SetStateAction } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Vector2 } from 'three'
import { Save } from 'lucide-react'
import { BlockMath } from 'react-katex'
import Base from '../_base'
import { ERenderMode, type TDatData } from '../../@types/gui'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { isScreenshotMode } from '../../modules/screenshotMode'
import vertexShader from '../../shaders/mandelbrot.vert.glsl?raw'
import fragmentShader from '../../shaders/mandelbrot.frag.glsl?raw'
import styles from './mandelbrotHud.module.css'

export type ComplexSetKind = 'mandelbrot' | 'julia'

const DEFAULT_ZOOM = 0.425
const DEFAULT_JULIA_C: [number, number] = [-0.4, 0.6]

type OverlayProps = {
	kind: ComplexSetKind
	center: number[]
	setCenter: Dispatch<SetStateAction<number[]>>
	zoom: number
	setZoom: Dispatch<SetStateAction<number>>
	iterations: number
	juliaC: number[]
	onReset: () => void
	onPickJuliaC?: (c: [number, number]) => void
	exportName: string
}

function findVizCanvas(): HTMLCanvasElement | null {
	const el = document.querySelector('#cw-viz-canvas')
	return el instanceof HTMLCanvasElement ? el : null
}

function ComplexSetOverlay({
	kind,
	center,
	setCenter,
	zoom,
	setZoom,
	iterations,
	juliaC,
	onReset,
	onPickJuliaC,
	exportName,
}: OverlayProps) {
	const screenshot = isScreenshotMode()
	const isIframe = new URLSearchParams(window.location.search).get('iframe') !== null
	const bare = screenshot || isIframe

	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState([0, 0])
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const overlayRef = useRef<HTMLDivElement | null>(null)
	const movedRef = useRef(false)

	useEffect(() => {
		const findCanvas = () => {
			const canvas = findVizCanvas()
			if (canvas) {
				canvasRef.current = canvas
			} else {
				window.setTimeout(findCanvas, 100)
			}
		}
		findCanvas()
	}, [])

	const handleMouseDown = useCallback((e: MouseEvent) => {
		setIsDragging(true)
		movedRef.current = false
		setDragStart([e.clientX, e.clientY])
	}, [])

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return
			const dist = Math.hypot(e.clientX - dragStart[0], e.clientY - dragStart[1])
			if (dist > 4) movedRef.current = true
			const canvas = canvasRef.current || findVizCanvas()
			const height = canvas?.clientHeight || window.innerHeight
			const dx = (e.clientX - dragStart[0]) / (zoom * height)
			const dy = (dragStart[1] - e.clientY) / (zoom * height)
			setCenter((prev) => [prev[0] - dx, prev[1] - dy])
			setDragStart([e.clientX, e.clientY])
		},
		[isDragging, dragStart, zoom, setCenter],
	)

	const handleMouseUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	const handleExport = useCallback(() => {
		const canvas = canvasRef.current || findVizCanvas()
		if (!canvas) return
		const dataURL = canvas.toDataURL('image/png')
		const link = document.createElement('a')
		link.download = `${exportName}_${Date.now()}.png`
		link.href = dataURL
		link.click()
	}, [exportName])

	const handleCanvasClick = useCallback(
		(e: MouseEvent) => {
			if (kind !== 'mandelbrot' || !onPickJuliaC || movedRef.current) return
			const canvas = canvasRef.current || findVizCanvas()
			if (!canvas) return

			const rect = canvas.getBoundingClientRect()
			const canvasWidth = canvas.width || rect.width
			const canvasHeight = canvas.height || rect.height

			const mouseX = e.clientX - rect.left
			const mouseY = e.clientY - rect.top

			const scaleX = canvasWidth / rect.width
			const scaleY = canvasHeight / rect.height
			const shaderX = mouseX * scaleX
			const shaderY = (rect.height - mouseY) * scaleY

			const dx = (shaderX - canvasWidth / 2) / (zoom * canvasHeight)
			const dy = (shaderY - canvasHeight / 2) / (zoom * canvasHeight)
			onPickJuliaC([center[0] + dx, center[1] + dy])
		},
		[kind, zoom, center, onPickJuliaC],
	)

	const handleWheelDiv = useCallback(
		(e: WheelEvent) => {
			e.preventDefault()
			const canvas = canvasRef.current || findVizCanvas()
			if (!canvas) return

			const rect = canvas.getBoundingClientRect()
			const canvasWidth = canvas.width || rect.width
			const canvasHeight = canvas.height || rect.height

			const mouseX = e.clientX - rect.left
			const mouseY = e.clientY - rect.top

			const scaleX = canvasWidth / rect.width
			const scaleY = canvasHeight / rect.height
			const shaderX = mouseX * scaleX
			const shaderY = (rect.height - mouseY) * scaleY

			const dx = (shaderX - canvasWidth / 2) / (zoom * canvasHeight)
			const dy = (shaderY - canvasHeight / 2) / (zoom * canvasHeight)
			const worldX = center[0] + dx
			const worldY = center[1] + dy

			const zoomDelta = -e.deltaY * 0.0003
			const newZoom = Math.min(1e12, Math.max(0.01, zoom * (1 + zoomDelta)))

			const newDx = (shaderX - canvasWidth / 2) / (newZoom * canvasHeight)
			const newDy = (shaderY - canvasHeight / 2) / (newZoom * canvasHeight)
			setZoom(newZoom)
			setCenter([worldX - newDx, worldY - newDy])
		},
		[zoom, center, setZoom, setCenter],
	)

	useEffect(() => {
		const overlay = overlayRef.current
		if (!overlay) return
		overlay.addEventListener('wheel', handleWheelDiv, { passive: false })
		return () => overlay.removeEventListener('wheel', handleWheelDiv)
	}, [handleWheelDiv])

	const hit = (
		<div
			ref={overlayRef}
			className={styles.hitLayer}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			onClick={handleCanvasClick}
			style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
		/>
	)

	if (bare) {
		return hit
	}

	return (
		<>
			{hit}

			<div className={styles.hud}>
				<div className={styles.meta} aria-hidden="true">
					<div>
						Center: ({center[0].toFixed(6)}, {center[1].toFixed(6)})
					</div>
					<div>Zoom: {zoom.toExponential(2)}×</div>
					{kind === 'julia' && (
						<div>
							c: ({juliaC[0].toFixed(4)}, {juliaC[1].toFixed(4)})
						</div>
					)}
					<div>Iterations: {iterations}</div>
				</div>

				<div className={styles.actions}>
					{kind === 'mandelbrot' ? (
						<Link className={styles.btn} to="/julia_set">
							Open Julia
						</Link>
					) : (
						<Link className={styles.btn} to="/mandelbrot_set">
							Open Mandelbrot
						</Link>
					)}
					<button type="button" className={styles.btn} onClick={onReset}>
						Reset
					</button>
					<button type="button" className={styles.btn} onClick={handleExport}>
						<Save size={14} aria-hidden="true" />
						Export
					</button>
				</div>

				{kind === 'mandelbrot' && (
					<p className={styles.hint}>Click the set to open Julia at that c · scroll zoom · drag pan</p>
				)}
				{kind === 'julia' && <p className={styles.hint}>Scroll zoom · drag pan · tune c in Params</p>}
			</div>
		</>
	)
}

type PageConfig = {
	kind: ComplexSetKind
	defaultCenter: [number, number]
	description: () => ReactNode
}

function parseJuliaC(params: URLSearchParams): [number, number] | null {
	const cxRaw = params.get('cx')
	const cyRaw = params.get('cy')
	if (cxRaw === null || cyRaw === null) return null
	const cx = Number(cxRaw)
	const cy = Number(cyRaw)
	if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null
	return [cx, cy]
}

export function createComplexQuadraticPage(config: PageConfig) {
	const { kind, defaultCenter, description } = config
	const isJulia = kind === 'julia'

	const Page = () => {
		const dispatch = useAppDispatch()
		const { data } = useAppSelector((state) => state.WebSlice)
		const navigate = useNavigate()
		const [searchParams] = useSearchParams()
		const embedBare =
			isScreenshotMode() || new URLSearchParams(window.location.search).has('iframe')

		const initialC = useMemo(() => {
			if (!isJulia) return DEFAULT_JULIA_C
			return parseJuliaC(searchParams) ?? DEFAULT_JULIA_C
		}, [searchParams])

		const [center, setCenter] = useState<[number, number]>(defaultCenter)
		const [zoom, setZoom] = useState(DEFAULT_ZOOM)
		const [iterations, setIterations] = useState(256)
		const [juliaC, setJuliaC] = useState<[number, number]>(initialC)

		const datData = useMemo((): TDatData => {
			if (isJulia) {
				return {
					options: {
						iterations: { initialValue: 256, min: 50, max: 1000, step: 10 },
						cReal: { initialValue: initialC[0], min: -2, max: 2, step: 0.001 },
						cImag: { initialValue: initialC[1], min: -2, max: 2, step: 0.001 },
					},
					examples: [
						{ iterations: 256, cReal: -0.4, cImag: 0.6 },
						{ iterations: 256, cReal: -0.8, cImag: 0.156 },
						{ iterations: 256, cReal: 0.285, cImag: 0.01 },
						{ iterations: 256, cReal: -0.70176, cImag: -0.3842 },
					],
				}
			}
			return {
				options: {
					iterations: { initialValue: 256, min: 50, max: 1000, step: 10 },
				},
				examples: [],
			}
		}, [initialC])

		useEffect(() => {
			void dispatch(setDatData(datData))
			if (isJulia) {
				void dispatch(
					setData({
						iterations: 256,
						cReal: initialC[0],
						cImag: initialC[1],
					}),
				)
			} else {
				void dispatch(
					setData({
						iterations: 256,
					}),
				)
			}
		}, [datData, dispatch, initialC])

		useEffect(() => {
			const nextIterations = data.iterations
			if (typeof nextIterations === 'number' && Number.isFinite(nextIterations)) {
				setIterations(Math.round(nextIterations))
			}
			if (isJulia) {
				const cr = data.cReal
				const ci = data.cImag
				if (typeof cr === 'number' && typeof ci === 'number' && Number.isFinite(cr) && Number.isFinite(ci)) {
					setJuliaC([cr, ci])
				}
			}
		}, [data.iterations, data.cReal, data.cImag])

		const [uniforms] = useState({
			u_center: { value: new Vector2(center[0], center[1]) },
			u_zoom: { value: zoom },
			u_maxIterations: { value: iterations },
			u_resolution: { value: new Vector2(1, 1) },
			u_juliaMode: { value: isJulia ? 1.0 : 0.0 },
			u_juliaC: { value: new Vector2(juliaC[0], juliaC[1]) },
		})

		useEffect(() => {
			uniforms.u_center.value.set(center[0], center[1])
		}, [center, uniforms])

		useEffect(() => {
			uniforms.u_zoom.value = zoom
		}, [zoom, uniforms])

		useEffect(() => {
			uniforms.u_maxIterations.value = iterations
		}, [iterations, uniforms])

		useEffect(() => {
			uniforms.u_juliaMode.value = isJulia ? 1.0 : 0.0
		}, [uniforms])

		useEffect(() => {
			uniforms.u_juliaC.value.set(juliaC[0], juliaC[1])
		}, [juliaC, uniforms])

		const handleResetAll = useCallback(() => {
			setCenter(defaultCenter)
			setZoom(DEFAULT_ZOOM)
		}, [])

		const handlePickJuliaC = useCallback(
			(c: [number, number]) => {
				navigate(`/julia_set?cx=${c[0]}&cy=${c[1]}`)
			},
			[navigate],
		)

		return (
			<div className={styles.root}>
				<Base
					renderMode={ERenderMode.SHADER}
					vertexShader={vertexShader}
					fragmentShader={fragmentShader}
					uniforms={uniforms}
					cameraPosition={[0, 0, 1]}
				/>
				<ComplexSetOverlay
					kind={kind}
					center={center}
					setCenter={setCenter}
					zoom={zoom}
					setZoom={setZoom}
					iterations={iterations}
					juliaC={juliaC}
					onReset={handleResetAll}
					onPickJuliaC={isJulia || embedBare ? undefined : handlePickJuliaC}
					exportName={kind}
				/>
			</div>
		)
	}

	Page.isShaderViz = true
	Page.getDescription = description
	return Page
}

export { DEFAULT_JULIA_C, DEFAULT_ZOOM }
