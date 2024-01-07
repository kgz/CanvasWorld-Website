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

//https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf

/**
 * Enumeration for dimensions.
 */
export enum EDimensions {
	TWO_D = 2,
	THREE_D = 3,
}

export interface TDatData {
	options: {
		[key: string]: {
			initialValue: number
			min: number
			max: number
			step?: number
		}
	}
	examples: { [key in keyof this['options']]: number }[]
}

export type TsetBodyJSX = React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>

/**
 * Represents the type of data extracted from an object.
 * @template G - The type of options in the TDatData object.
 */
export type TDataFromObject<G extends TDatData['options']> = {
	[key in keyof G]: G[key]['initialValue']
}

/**
 * Represents the props for TPoints component.
 * @template T The type of data for the TPoints component.
 * @property {TDatData & { data?: T }} datData - The data for the dat gui.
 * @property {(positions: Float32Array, colors: Float32Array, datData: T, state: RootState, delta: number, frame?: _XRFrame) => void} tick - The function that is called on every frame.
 * @property {number} numParticles - The number of particles.
 * @property {EDimensions} dimension - The dimension of the points.
 * @property {number} [pointSize] - The size of the points.
 * @property {JSX.Element} [description] - The description of the attractor.
 * @property {THREE.Color} [singleColor] - If null, will use the color vector as the color source
 */
export type TPointsProps<T> = {
	datData: TDatData & { data?: T }
	tick: (
		positions: Float32Array,
		colors: Float32Array,
		datData: T,
		state: RootState,
		delta: number,
		frame?: _XRFrame,
	) => void
	numParticles: number
	dimension: EDimensions
	pointSize?: number
	description?: JSX.Element
	singleColor?: THREE.Color
}

/**
 * Renders points on a canvas.
 *
 * @template T - The type of data for each point, {[key: string]: number}
 * @param {TPointsProps<T>} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
const Points = <T,>({
	datData,
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
		if (!datData.data) {
			throw new Error('datData.data is undefined')
		}

		// passthrough point and color buffers
		tick(pointsBuffer, ColorBuffer, datData.data, ...args)

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
	datData,
	tick,
	numParticles = 200_000,
	dimension,
	pointSize,
	setBodyJSX,
	description,
	singleColor,
}: TPointsProps<T> & {
	setBodyJSX: React.Dispatch<React.SetStateAction<JSX.Element | JSX.Element[]>>
}) => {
	const canvas = useRef<HTMLCanvasElement>(null)
	const stats = useRef<any>(null)
	const [locked, setLocked] = useState(false)

	const [dD, setdD] = useState<T>({
		...(Object.fromEntries(Object.entries(datData.options).map(([key, value]) => [key, value.initialValue])) as T),
	})

	const descriptionJSX = useMemo(() => {
		return (
			<>
				<DatGui
					data={{ ...dD, package: 'react-dat-gui' }}
					onUpdate={(data: T) => {
						setdD(data)
					}}
				>
					{Object.entries(datData.options).map(([key, value]) => {
						return (
							<DatNumber key={key} path={key} label={key} min={value.min} max={value.max} step={value.step ?? 0.0001} />
						)
					})}
					<DatFolder closed={true} title="Examples">
						{datData.examples.map((example, i) => {
							return (
								<DatButton
									key={i}
									label={`Example ${i}`}
									onClick={() => {
										setdD(old => ({ ...old, ...example }))
									}}
								/>
							)
						})}
					</DatFolder>
				</DatGui>
				<div className={style.card}>
					<div className={style.desc}>{description && description}</div>
				</div>
			</>
		)
	}, [dD, datData.options, datData.examples, description])

	useEffect(() => {
		if (locked) {
			return
		}

		setLocked(true)
		setBodyJSX(descriptionJSX)
	}, [descriptionJSX, locked, setBodyJSX])

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
					position: [0, 0, -95],
					fov: 75,
					near: 0.1,
					far: 1000,
				}}
			>
				<OrbitControls makeDefault />
				<Points
					datData={{
						...datData,
						data: dD,
					}}
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
