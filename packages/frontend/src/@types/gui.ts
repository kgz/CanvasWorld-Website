//https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf

import type { RootState, Vector3 } from "@react-three/fiber"
import type { _XRFrame } from "@react-three/fiber/dist/declarations/src/core/utils"
import type { RefObject } from 'react'

/**
 * Enumeration for dimensions.
 */
export enum EDimensions {
	TWO_D = 2,
	THREE_D = 3,
}

/**
 * Enumeration for render modes.
 */
export enum ERenderMode {
	PARTICLES = 'particles',
	SHADER = 'shader',
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
 * Represents shader-specific props
 */
export type TShaderProps = {
	renderMode: ERenderMode.SHADER
	vertexShader: string
	fragmentShader: string
	uniforms: Record<string, { value: unknown }>
	cameraPosition?: Vector3
	children?: React.ReactNode
}

/**
 * Represents particle-specific props
 * @template T The type of data for the TPoints component.
 */
export type TParticleProps<T> = {
	renderMode?: ERenderMode.PARTICLES
	tick: (
		positions: Float32Array,
		colors: Float32Array,
		state: RootState,
		delta: number,
		frame?: _XRFrame,
	) => void | number
	numParticles: number
	dimension: EDimensions
	pointSize?: number
	singleColor?: THREE.Color
	cameraPosition?: Vector3
	colorAlpha?: boolean
	/** GPU line strip instead of points (drawRange follows tick return count). */
	drawMode?: 'points' | 'line'
	lineOpacity?: number
	autoRotate?: boolean
	autoRotateSpeed?: number
	setCanvasRef?: (ref: RefObject<HTMLCanvasElement>) => void
}

export type TMeshProps = {
	drawMode: 'mesh'
	positions: Float32Array
	indices: Uint32Array
	colors: Float32Array
	cameraPosition?: Vector3
	autoRotate?: boolean
	autoRotateSpeed?: number
	progressTick?: (delta: number) => number
}

/**
 * Represents the props for Base component - particles, shader, or indexed mesh.
 * @template T The type of data for the TPoints component.
 */
export type TPointsProps<T> = TParticleProps<T> | TShaderProps | TMeshProps

export function isMeshProps<T>(props: TPointsProps<T>): props is TMeshProps {
	return 'drawMode' in props && props.drawMode === 'mesh'
}

/**
 * Type guard to check if props are for particle rendering
 */
export function isParticleProps<T>(props: TPointsProps<T>): props is TParticleProps<T> {
	if (isMeshProps(props)) {
		return false
	}
	return !('renderMode' in props) || props.renderMode === ERenderMode.PARTICLES
}

/**
 * Type guard to check if props are for shader rendering
 */
export function isShaderProps<T>(props: TPointsProps<T>): props is TShaderProps {
	return 'renderMode' in props && props.renderMode === ERenderMode.SHADER
}