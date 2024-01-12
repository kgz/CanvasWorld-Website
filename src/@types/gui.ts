//https://www.jolinton.co.uk/Mathematics/Hopalong_Fractals/Text.pdf

import type { RootState, Vector3 } from "@react-three/fiber"
import type { _XRFrame } from "@react-three/fiber/dist/declarations/src/core/utils"

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
	tick: (
		positions: Float32Array,
		colors: Float32Array,
		state: RootState,
		delta: number,
		frame?: _XRFrame,
	) => void
	numParticles: number
	dimension: EDimensions
	pointSize?: number
	description?: JSX.Element
	singleColor?: THREE.Color,
    cameraPosition?: Vector3
}