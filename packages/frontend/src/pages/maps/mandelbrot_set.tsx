import { useEffect, useState, useCallback, useRef } from 'react'
import { Vector2 } from 'three'
import { Save } from 'lucide-react'
import Base from '../_base'
import { ERenderMode } from '../../@types/gui'
import { BlockMath } from 'react-katex'
import vertexShader from '../../shaders/mandelbrot.vert.glsl?raw'
import fragmentShader from '../../shaders/mandelbrot.frag.glsl?raw'

type MandelbrotContentProps = {
	center: number[]
	setCenter: React.Dispatch<React.SetStateAction<number[]>>
	zoom: number
	setZoom: React.Dispatch<React.SetStateAction<number>>
	iterations: number
	setIterations: React.Dispatch<React.SetStateAction<number>>
	juliaMode: boolean
	setJuliaMode: React.Dispatch<React.SetStateAction<boolean>>
	juliaC: number[]
	setJuliaC: React.Dispatch<React.SetStateAction<number[]>>
	colorScheme: number
	setColorScheme: React.Dispatch<React.SetStateAction<number>>
}

const MandelbrotContent = ({
	center, setCenter, zoom, setZoom, iterations, setIterations,
	juliaMode, setJuliaMode, juliaC, setJuliaC, colorScheme, setColorScheme
}: MandelbrotContentProps) => {
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState([0, 0])
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const overlayRef = useRef<HTMLDivElement | null>(null)

	// Get canvas element from DOM (retry if not found initially)
	useEffect(() => {
		const findCanvas = () => {
			const canvas = document.querySelector('canvas')
			if (canvas) {
				canvasRef.current = canvas
			} else {
				// Retry after a short delay if canvas not found
				setTimeout(findCanvas, 100)
			}
		}
		findCanvas()
	}, [])

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		setIsDragging(true)
		setDragStart([e.clientX, e.clientY])
	}, [])

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDragging) return
		const dx = (e.clientX - dragStart[0]) / (zoom * window.innerHeight)
		const dy = (dragStart[1] - e.clientY) / (zoom * window.innerHeight)
		setCenter(prev => [prev[0] - dx, prev[1] - dy])
		setDragStart([e.clientX, e.clientY])
	}, [isDragging, dragStart, zoom, setCenter])

	const handleMouseUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	const handleExport = useCallback(() => {
		const canvas = canvasRef.current || document.querySelector('canvas')
		if (!canvas) return
		const dataURL = canvas.toDataURL('image/png')
		const link = document.createElement('a')
		link.download = `${juliaMode ? 'julia' : 'mandelbrot'}_${Date.now()}.png`
		link.href = dataURL
		link.click()
	}, [juliaMode])

	const handleCanvasClick = useCallback((e: React.MouseEvent) => {
		if (juliaMode) return
		const canvas = canvasRef.current || document.querySelector('canvas')
		if (!canvas) return
		const rect = canvas.getBoundingClientRect()
		const x = ((e.clientX - rect.left) - rect.width / 2) / (zoom * rect.height) + center[0]
		const y = (rect.height / 2 - (e.clientY - rect.top)) / (zoom * rect.height) + center[1]
		setJuliaC([x, y])
	}, [juliaMode, zoom, center, setJuliaC])

	const handleReset = () => {
		setCenter([-0.5, 0.0])
		setZoom(1.0)
		setIterations(256)
	}

	const handleWheelDiv = useCallback((e: WheelEvent) => {
		e.preventDefault()
		const canvas = canvasRef.current || document.querySelector('canvas')
		if (!canvas) return
		
		const rect = canvas.getBoundingClientRect()
		const mouseX = e.clientX - rect.left
		const mouseY = e.clientY - rect.top
		
		// Calculate the complex coordinate at mouse position before zoom
		const worldX = ((mouseX - rect.width / 2) / (zoom * rect.height)) + center[0]
		const worldY = ((rect.height / 2 - mouseY) / (zoom * rect.height)) + center[1]
		
		// Apply zoom (smooth multiplier based on scroll delta)
		const zoomSpeed = 0.0003
		const zoomDelta = -e.deltaY * zoomSpeed
		const newZoom = Math.max(0.01, zoom * (1 + zoomDelta))
		
		// Adjust center so the point under mouse stays fixed
		const zoomRatio = newZoom / zoom
		const newCenterX = worldX - ((mouseX - rect.width / 2) / (newZoom * rect.height))
		const newCenterY = worldY - ((rect.height / 2 - mouseY) / (newZoom * rect.height))
		
		setZoom(newZoom)
		setCenter([newCenterX, newCenterY])
	}, [zoom, center])

	// Attach wheel event listener with passive: false
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
				onClick={handleCanvasClick}
				style={{ position: 'fixed', inset: 0, cursor: isDragging ? 'grabbing' : 'grab', pointerEvents: 'auto' }}
			/>

			<div className="fixed top-20 right-4 bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg text-white space-y-4 z-50 w-64">
				<div>
					<button
						onClick={() => setJuliaMode(!juliaMode)}
						className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
					>
						{juliaMode ? 'Mandelbrot Mode' : 'Julia Set Mode'}
					</button>
				</div>

				<div>
					<label className="text-sm block mb-1">Iterations: {iterations}</label>
					<input
						type="range"
						min="50"
						max="1000"
						step="10"
						value={iterations}
						onChange={(e) => setIterations(parseInt(e.target.value))}
						className="w-full"
					/>
				</div>

				<div>
					<label className="text-sm block mb-1">Color Scheme</label>
					<select
						value={colorScheme}
						onChange={(e) => setColorScheme(parseInt(e.target.value))}
						className="w-full bg-gray-700 px-2 py-1 rounded"
					>
						<option value={0}>Classic Blue</option>
						<option value={1}>Rainbow</option>
						<option value={2}>Fire</option>
						<option value={3}>Grayscale</option>
						<option value={4}>Purple/Cyan</option>
					</select>
				</div>

				<div className="text-xs space-y-1 font-mono">
					<div>Center: ({center[0].toFixed(6)}, {center[1].toFixed(6)})</div>
					<div>Zoom: {zoom.toExponential(2)}x</div>
					{juliaMode && <div>Julia C: ({juliaC[0].toFixed(3)}, {juliaC[1].toFixed(3)})</div>}
				</div>

				<div className="space-y-2">
					<button
						onClick={handleReset}
						className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
					>
						Reset View
					</button>
					<button
						onClick={handleExport}
						className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center gap-2 transition-colors"
					>
						<Save size={16} />
						Export PNG
					</button>
				</div>

				{!juliaMode && (
					<div className="text-xs text-gray-400 italic">
						Click on the fractal to set Julia constant
					</div>
				)}
			</div>
		</>
	)
}

const MandelbrotSet = () => {
	const [center, setCenter] = useState([-0.5, 0.0])
	const [zoom, setZoom] = useState(1.0)
	const [iterations, setIterations] = useState(256)
	const [juliaMode, setJuliaMode] = useState(false)
	const [juliaC, setJuliaC] = useState([-0.4, 0.6])
	const [colorScheme, setColorScheme] = useState(0)

	// Create uniforms with initial values
	const [uniforms] = useState({
		u_center: { value: new Vector2(center[0], center[1]) },
		u_zoom: { value: zoom },
		u_maxIterations: { value: iterations },
		u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
		u_juliaMode: { value: juliaMode },
		u_juliaC: { value: new Vector2(juliaC[0], juliaC[1]) },
		u_colorScheme: { value: colorScheme }
	})

	// Update uniforms when state changes
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
		uniforms.u_juliaMode.value = juliaMode
	}, [juliaMode, uniforms])

	useEffect(() => {
		uniforms.u_juliaC.value.set(juliaC[0], juliaC[1])
	}, [juliaC, uniforms])

	useEffect(() => {
		uniforms.u_colorScheme.value = colorScheme
	}, [colorScheme, uniforms])

	return (
		<>
			<Base
				renderMode={ERenderMode.SHADER}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				cameraPosition={[0, 0, 1]}
			/>
			<MandelbrotContent
				center={center}
				setCenter={setCenter}
				zoom={zoom}
				setZoom={setZoom}
				iterations={iterations}
				setIterations={setIterations}
				juliaMode={juliaMode}
				setJuliaMode={setJuliaMode}
				juliaC={juliaC}
				setJuliaC={setJuliaC}
				colorScheme={colorScheme}
				setColorScheme={setColorScheme}
			/>
		</>
	)
}

MandelbrotSet.getDescription = () => (
	<>
		The Mandelbrot set is one of the most famous fractals in mathematics, discovered by Benoit Mandelbrot in 1980.
		For each point c in the complex plane, we iterate:
		<BlockMath math={'z_{n+1} = z_n^2 + c'} />
		starting with z₀ = 0. Points where |z| remains bounded belong to the set (shown in black).
		<br /><br />
		<strong>Julia Sets:</strong> Toggle to Julia mode to explore related fractals. Instead of varying c and fixing z₀ = 0,
		Julia sets fix c and vary the starting point z₀. Click on the Mandelbrot set to choose the Julia constant.
		<br /><br />
		<strong>GPU-Accelerated:</strong> This visualization uses WebGL fragment shaders for real-time rendering at 60fps,
		supporting smooth zooming up to 10¹⁰x magnification with continuous coloring.
		<br /><br />
		<strong>Controls:</strong>
		<br />
		- Scroll to zoom in/out
		<br />
		- Click and drag to pan
		<br />
		- Adjust iterations for detail at high zoom
		<br />
		- Toggle between Mandelbrot and Julia modes
		<br />
		- Export current view as PNG
		<br /><br />
		Reference: <a href="https://en.wikipedia.org/wiki/Mandelbrot_set" target="_blank">Mandelbrot Set – Wikipedia</a>
	</>
)

export default MandelbrotSet

