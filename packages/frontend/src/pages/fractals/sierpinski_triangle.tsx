import { useCallback, useEffect, useRef, useState, type Dispatch, type MouseEvent, type SetStateAction } from 'react'
import { Vector2 } from 'three'
import { BlockMath } from 'react-katex'
import Base from '../_base'
import { ERenderMode } from '../../@types/gui'
import { useAnimation } from '../../context/AnimationContext'
import { isEmbedTransportPaused } from '../../modules/embedBridge'
import { isScreenshotMode } from '../../modules/screenshotMode'
import vertexShader from '../../shaders/sierpinski.vert.glsl?raw'
import fragmentShader from '../../shaders/sierpinski.frag.glsl?raw'
import styles from '../maps/mandelbrotHud.module.css'

const MAX_DEPTH = 10
const DEFAULT_ZOOM = 0.88

type OverlayProps = {
	center: number[]
	setCenter: Dispatch<SetStateAction<number[]>>
	zoom: number
	setZoom: Dispatch<SetStateAction<number>>
}

function findVizCanvas(): HTMLCanvasElement | null {
	const el = document.querySelector('#cw-viz-canvas')
	return el instanceof HTMLCanvasElement ? el : null
}

const SierpinskiOverlay = ({ center, setCenter, zoom, setZoom }: OverlayProps) => {
	const screenshot = isScreenshotMode()
	const isIframe = new URLSearchParams(window.location.search).get('iframe') !== null
	const bare = screenshot || isIframe

	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState([0, 0])
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const overlayRef = useRef<HTMLDivElement | null>(null)

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
		setDragStart([e.clientX, e.clientY])
	}, [])

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return
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

	const handleReset = () => {
		setCenter([0, 0])
		setZoom(DEFAULT_ZOOM)
	}

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
			const newZoom = Math.min(1e7, Math.max(0.05, zoom * (1 + zoomDelta)))

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
						Center: ({center[0].toFixed(5)}, {center[1].toFixed(5)})
					</div>
					<div>Zoom: {zoom.toExponential(2)}×</div>
				</div>

				<div className={styles.actions}>
					<button type="button" className={styles.btn} onClick={handleReset}>
						Reset
					</button>
				</div>

				<p className={styles.hint}>Scroll to zoom · drag to pan</p>
			</div>
		</>
	)
}

const SierpinskiTriangle = () => {
	const [center, setCenter] = useState([0, 0])
	const [zoom, setZoom] = useState(DEFAULT_ZOOM)
	const {
		isPaused,
		isPausedRef,
		animationSpeed,
		manualProgress,
		reportProgress,
		currentProgressRef,
		particlesDrawn,
	} = useAnimation()
	const depthProgressRef = useRef(0)
	const wasReplayingRef = useRef(false)

	const [uniforms] = useState({
		u_center: { value: new Vector2(center[0], center[1]) },
		u_zoom: { value: zoom },
		u_maxDepth: { value: 0 },
		u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
	})

	useEffect(() => {
		uniforms.u_center.value.set(center[0], center[1])
	}, [center, uniforms])

	useEffect(() => {
		uniforms.u_zoom.value = zoom
	}, [zoom, uniforms])

	useEffect(() => {
		if (isScreenshotMode()) {
			uniforms.u_maxDepth.value = MAX_DEPTH
			reportProgress(MAX_DEPTH, MAX_DEPTH)
			return
		}

		const total = MAX_DEPTH
		depthProgressRef.current = Math.min(depthProgressRef.current, total)

		let frame = 0
		let last = performance.now()

		const loop = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000)
			last = now
			const paused = isPausedRef.current || isEmbedTransportPaused()

			if (particlesDrawn === 0 && !paused) {
				if (!wasReplayingRef.current) {
					depthProgressRef.current = 0
					wasReplayingRef.current = true
				}
			} else if (particlesDrawn > 0) {
				wasReplayingRef.current = false
			}

			if (manualProgress !== null) {
				depthProgressRef.current = Math.min(Math.max(manualProgress, 0), total)
			} else if (!paused) {
				depthProgressRef.current = Math.min(total, depthProgressRef.current + dt * 1.6 * animationSpeed)
			}

			currentProgressRef.current = depthProgressRef.current
			const drawn = Math.floor(depthProgressRef.current)
			uniforms.u_maxDepth.value = drawn
			reportProgress(drawn, total)

			frame = requestAnimationFrame(loop)
		}

		frame = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(frame)
	}, [
		animationSpeed,
		manualProgress,
		particlesDrawn,
		reportProgress,
		currentProgressRef,
		isPausedRef,
		uniforms,
	])

	return (
		<div className={styles.root}>
			<Base
				renderMode={ERenderMode.SHADER}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				cameraPosition={[0, 0, 1]}
			/>
			<SierpinskiOverlay center={center} setCenter={setCenter} zoom={zoom} setZoom={setZoom} />
		</div>
	)
}

SierpinskiTriangle.usesTransportBar = true
SierpinskiTriangle.progressLabel = 'depth'

SierpinskiTriangle.getDescription = () => (
	<>
		GPU Sierpiński gasket: each pixel’s barycentric coordinates are iteratively remapped into corner
		sub-triangles; if all weights stay below ½ the sample falls in a removed void.
		<br />
		<br />
		<strong>Transport bar:</strong> scrubs construction depth 0→{MAX_DEPTH} (solid triangle → successive
		removals).
		<br />
		<br />
		<strong>Zoom:</strong> scroll to magnify under the cursor; drag to pan.
		<br />
		<br />
		Corner remap (weight <code>α ≥ ½</code>):
		<BlockMath math="(\alpha,\beta,\gamma) \mapsto (2\alpha-1,\,2\beta,\,2\gamma)" />
	</>
)

export default SierpinskiTriangle
