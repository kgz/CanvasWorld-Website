import { OrbitControls, PointMaterial, Stats } from '@react-three/drei'
import type { RenderCallback, RootState } from '@react-three/fiber'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import DatGui, { DatButton, DatFolder, DatNumber } from 'react-dat-gui'
import * as THREE from 'three'
import style from '../@scss/template.module.scss'
import { Helmet } from 'react-helmet'
import type { _XRFrame } from '@react-three/fiber/dist/declarations/src/core/utils'
import { renderToString } from 'react-dom/server'
import { EDimensions, ERenderMode, type TPointsProps, type TParticleProps, type TShaderProps } from '../@types/gui'

/**
 * Renders points on a canvas.
 *
 * @template T - The type of data for each point, {[key: string]: number}
 * @param {TParticleProps<T>} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
const Points = <T,>({
	tick,
	numParticles = 200_000 / 1000,
	dimension,
	pointSize,
	singleColor,
	colorAlpha = false,
}: TParticleProps<T>): JSX.Element => {
	const points = useRef<typeof points>()

	const pointsBuffer = new Float32Array(numParticles * dimension)
	const ColorBuffer = new Float32Array(numParticles * 3)

	// on every frame recalculates the position of every particle
	// and updates the attribute with the new values
	const loop: RenderCallback = (...args) => {
		// passthrough point and color buffers
		tick(pointsBuffer, ColorBuffer, ...args)

		if (points?.current?.geometry?.attributes?.position) {
			points.current.geometry.attributes.position.needsUpdate = true
		}
		if (points?.current?.geometry?.attributes?.color) {
			points.current.geometry.attributes.color.needsUpdate = true
		}
	}

	useFrame(loop)
	return (
		<points ref={points}>
			<bufferGeometry attach="geometry">
				<bufferAttribute
					attach="attributes-position"
					count={pointsBuffer.length / dimension}
					array={pointsBuffer}
					itemSize={dimension}
				/>
				{!singleColor && (
					<bufferAttribute
						attach="attributes-color"
						count={ColorBuffer.length / (colorAlpha ? 4 : 3)}
						array={ColorBuffer}
						itemSize={colorAlpha ? 4 : 3}
					/>
				)}
			</bufferGeometry>

			<PointMaterial
				size={pointSize ?? 0.015}
				color={singleColor ?? new THREE.Color(0xffffff)}
				vertexColors={!singleColor}
			/>
		</points>
	)
}

/**
 * Renders a shader-based visualization on a fullscreen plane.
 */
const ShaderPlane = ({ vertexShader, fragmentShader, uniforms }: TShaderProps): JSX.Element => {
	const meshRef = useRef<THREE.Mesh>(null)
	const [resolution, setResolution] = useState([window.innerWidth, window.innerHeight])

	useEffect(() => {
		const updateResolution = () => {
			const canvas = document.querySelector('canvas')
			if (canvas) {
				setResolution([canvas.width, canvas.height])
			} else {
				setResolution([window.innerWidth, window.innerHeight])
			}
		}
		
		updateResolution()
		const handleResize = () => {
			updateResolution()
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useFrame(() => {
		if (meshRef.current?.material && 'uniforms' in meshRef.current.material) {
			const material = meshRef.current.material as THREE.ShaderMaterial
			if (material.uniforms.u_resolution) {
				material.uniforms.u_resolution.value.set(resolution[0], resolution[1])
			}
		}
	})

	return (
		<mesh ref={meshRef}>
			<planeGeometry args={[2, 2]} />
			<shaderMaterial
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
			/>
		</mesh>
	)
}

const Base = <T,>(props: TPointsProps<T>) => {
	const isShaderMode = 'renderMode' in props && props.renderMode === ERenderMode.SHADER
	const canvas = useRef<HTMLCanvasElement>(null)
	const stats = useRef<any>(null)

	// const [dD, setdD] = useState<T>(
	// 	Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue])) as T,
	// )

	// const _data = useMemo(() => {
	// 	return {
	// 		...dD,
	// 		package: 'react-dat-gui',
	// 	}
	// }, [dD])

	useEffect(() => {
		if (!isShaderMode && 'setCanvasRef' in props && props.setCanvasRef) {
			props.setCanvasRef(canvas)
		}
	}, [canvas, isShaderMode, props])

	const isIframe = useMemo(() => {
		const params = new URLSearchParams(window.location.search)
		return params.get('iframe') !== null
	}, [])

	const parentElementName = useMemo(() => {
		//current last opart oif the path
		const path = window.location.pathname.split('/')
		return path[path.length - 1]
	}, [])

	const SplitNameByCapital = useMemo(() => {
		return parentElementName.split(/(?=[A-Z])/).join(' ')
	}, [parentElementName])

	const descriptionToString = useMemo(() => {
		const desc = 'description' in props ? props.description : undefined
		return renderToString(desc ?? <></>)
	}, [props])

	const decodeEntities = useMemo(() => {
		// convert html entities like &nsbp; to unicode
		const st = descriptionToString.replace(/&#(\d+);/g, '')
		return st
	}, [descriptionToString])

	const descriptionWithoutHTML = useMemo(() => {
		let st = decodeEntities.replace(/(<([^>]+)>)/gi, '')
		// convert things like &nsbp; to spaces
		st = st.replace(/&[a-z]+;/g, ' ')
		st = st.replace(/\u200B/g, '')
		return st
	}, [decodeEntities])

	return (
		<>
			<Helmet>
				<title>{SplitNameByCapital}</title>
				<meta name="description" content={descriptionWithoutHTML} />
				<meta name="keywords" content={[SplitNameByCapital, 'fractal', 'attractor', 'react', 'threejs'].join(', ')} />
			</Helmet>
			<div
				style={{
					position: 'fixed',
					top: '4rem', // Position under the header (4rem = 64px)
					left: '1rem',
					zIndex: 999,
				}}
				ref={stats}
			>
				{!isIframe && <Stats parent={stats} className="stats" />}
			</div>
			<Canvas
				ref={canvas}
				className={style.canvas}
				camera={{
					position: props.cameraPosition ?? [0, 0, -95],
					fov: 75,
					near: 0.1,
					far: 1000,
				}}
			>
				{isShaderMode ? (
					<ShaderPlane
						renderMode={ERenderMode.SHADER}
						vertexShader={(props as TShaderProps).vertexShader}
						fragmentShader={(props as TShaderProps).fragmentShader}
						uniforms={(props as TShaderProps).uniforms}
					/>
				) : (
					<>
						<OrbitControls makeDefault enableRotate={'dimension' in props && (props as TParticleProps<T>).dimension !== EDimensions.TWO_D} enablePan enableZoom />
						<Points<T>
							renderMode={ERenderMode.PARTICLES}
							tick={(props as TParticleProps<T>).tick}
							numParticles={(props as TParticleProps<T>).numParticles}
							dimension={(props as TParticleProps<T>).dimension}
							pointSize={(props as TParticleProps<T>).pointSize}
							singleColor={(props as TParticleProps<T>).singleColor}
							colorAlpha={(props as TParticleProps<T>).colorAlpha}
							setCanvasRef={(props as TParticleProps<T>).setCanvasRef}
						/>
					</>
				)}
			</Canvas>
		</>
	)
}

Base.whyDidYouRender = true

export default Base
