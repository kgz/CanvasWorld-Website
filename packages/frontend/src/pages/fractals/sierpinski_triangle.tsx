import { useCallback, useEffect, useRef, useState, type Dispatch, type MouseEvent, type SetStateAction } from 'react'
import { Vector2 } from 'three'
import { BlockMath } from 'react-katex'
import Base from '../_base'
import { ERenderMode } from '../../@types/gui'
import { useAnimation } from '../../context/AnimationContext'
import { isScreenshotMode } from '../../modules/screenshotMode'
import vertexShader from '../../shaders/sierpinski.vert.glsl?raw'
import fragmentShader from '../../shaders/sierpinski.frag.glsl?raw'

const MAX_DEPTH = 10

type OverlayProps = {
	center: number[]
	setCenter: Dispatch<SetStateAction<number[]>>
	zoom: number
	setZoom: Dispatch<SetStateAction<number>>
}

const SierpinskiOverlay = ({ center, setCenter, zoom, setZoom }: OverlayProps) => {
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState([0, 0])
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const overlayRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const findCanvas = () => {
			const canvas = document.querySelector('#cw-viz-canvas')
			if (canvas instanceof HTMLCanvasElement) {
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
			const dx = (e.clientX - dragStart[0]) / (zoom * window.innerHeight)
			const dy = (dragStart[1] - e.clientY) / (zoom * window.innerHeight)
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
		setZoom(0.65)
	}

	const handleWheelDiv = useCallback(
		(e: WheelEvent) => {
			e.preventDefault()
			const canvas = canvasRef.current || document.querySelector('#cw-viz-canvas')
			if (!(canvas instanceof HTMLCanvasElement)) return

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

	return (
		<>
			<div
				ref={overlayRef}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: '4.5rem',
					cursor: isDragging ? 'grabbing' : 'grab',
					pointerEvents: 'auto',
				}}
			/>

			<div className="fixed top-20 right-4 z-50 w-64 space-y-4 rounded-lg bg-gray-800/90 p-4 text-white backdrop-blur-sm">
				<div className="space-y-1 font-mono text-xs">
					<div>
						Center: ({center[0].toFixed(5)}, {center[1].toFixed(5)})
					</div>
					<div>Zoom: {zoom.toExponential(2)}×</div>
				</div>

				<button
					type="button"
					onClick={handleReset}
					className="w-full rounded bg-gray-700 px-4 py-2 transition-colors hover:bg-gray-600"
				>
					Reset View
				</button>

				<p className="text-xs text-gray-400 italic">Scroll to zoom · drag to pan</p>
			</div>
		</>
	)
}

const SierpinskiTriangle = () => {
	const [center, setCenter] = useState([0, 0])
	const [zoom, setZoom] = useState(0.65)
	const {
		isPaused,
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

			if (particlesDrawn === 0 && !isPaused) {
				if (!wasReplayingRef.current) {
					depthProgressRef.current = 0
					wasReplayingRef.current = true
				}
			} else if (particlesDrawn > 0) {
				wasReplayingRef.current = false
			}

			if (manualProgress !== null) {
				depthProgressRef.current = Math.min(Math.max(manualProgress, 0), total)
			} else if (!isPaused) {
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
		isPaused,
		animationSpeed,
		manualProgress,
		particlesDrawn,
		reportProgress,
		currentProgressRef,
		uniforms,
	])

	return (
		<>
			<Base
				renderMode={ERenderMode.SHADER}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				cameraPosition={[0, 0, 1]}
			/>
			<SierpinskiOverlay center={center} setCenter={setCenter} zoom={zoom} setZoom={setZoom} />
		</>
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
