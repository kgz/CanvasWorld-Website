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
import type { TPointsProps } from '../@types/gui'

/**
 * Renders points on a canvas.
 *
 * @template T - The type of data for each point, {[key: string]: number}
 * @param {TPointsProps<T>} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
const Points = <T,>({
	tick,
	numParticles = 200_000,
	dimension,
	pointSize,
	singleColor,
}: TPointsProps<T>): JSX.Element => {
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
		if (points?.current?.geometry?.attributes?.color?.needsUpdate) {
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
					<bufferAttribute attach="attributes-color" count={ColorBuffer.length / 3} array={ColorBuffer} itemSize={3} />
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

const Base = <T,>({
	tick,
	numParticles = 200_000,
	dimension,
	pointSize,
	description,
	singleColor,
	cameraPosition,
}: TPointsProps<T>) => {
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

	const parentElementName = useMemo(() => {
		//current last opart oif the path
		const path = window.location.pathname.split('/')
		return path[path.length - 1]
	}, [])

	const SplitNameByCapital = useMemo(() => {
		return parentElementName.split(/(?=[A-Z])/).join(' ')
	}, [parentElementName])

	const descriptionToString = useMemo(() => {
		return renderToString(description ?? <></>)
	}, [description])

	const decocdeEntities = useMemo(() => {
		// convert html entities like &nsbp; to unicode
		const st = descriptionToString.replace(/&#(\d+);/g, '')
		return st
	}, [descriptionToString])

	const descriptionWithoutHTML = useMemo(() => {
		let st = decocdeEntities.replace(/(<([^>]+)>)/gi, '')
		// convert things like &nsbp; to spaces
		st = st.replace(/&[a-z]+;/g, ' ')
		st = st.replace(/\u200B/g, '')
		return st
	}, [decocdeEntities])

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
					zIndex: 999,
				}}
				ref={stats}
			>
				<Stats parent={stats} className="stats" />
			</div>
			<Canvas
				ref={canvas}
				className={style.canvas}
				camera={{
					position: cameraPosition ?? [0, 0, -95],
					fov: 75,
					near: 0.1,
					far: 1000,
					
				}}
			>
				<OrbitControls makeDefault />
				<Points
					tick={tick}
					numParticles={numParticles}
					dimension={dimension}
					pointSize={pointSize}
					singleColor={singleColor}
				/>
			</Canvas>
		</>
	)
}

Base.whyDidYouRender = true

export default Base
