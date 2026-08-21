import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { EDimensions, type TDatData, type TParticleProps } from '../@types/gui'
import { setDatData, setData } from '../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../@store/store'
import { useAnimationState } from '../hooks/useAnimationState'
import { resolveParticleCount } from '../modules/embedMode'
import Base from './_base'

export type ParamDef = {
	initialValue: number
	min: number
	max: number
	step?: number
}

export type AttractorColorMode =
	| 'purple'
	| 'hsl-chunk'
	| 'hsl-sin'
	| ((i: number, particlesToDraw: number) => [number, number, number])

export type AttractorPageConfig = {
	params: Record<string, ParamDef>
	examples?: Record<string, number>[]
	seed?: { x: number; y: number }
	iterate: (x: number, y: number, p: Record<string, number>) => { x: number; y: number }
	scale?: number | ((x: number, y: number) => [number, number])
	color?: AttractorColorMode
	trailLength?: number
	numParticles?: number
	pointSize?: number
	cameraPosition?: [number, number, number]
	description: () => ReactNode
}

export type AttractorPageComponent = (() => JSX.Element) & {
	getDescription: () => ReactNode
}

function resolveColor(
	mode: AttractorColorMode,
	i: number,
	particlesToDraw: number,
	trailLength: number,
): [number, number, number] {
	if (i >= particlesToDraw - trailLength) {
		return [1.0, 1.0, 0.0]
	}
	if (typeof mode === 'function') {
		return mode(i, particlesToDraw)
	}
	if (mode === 'purple') {
		return [0.8, 0.2, 0.8]
	}
	if (mode === 'hsl-sin') {
		const color = new THREE.Color()
		color.setHSL(Math.sin(i), 1, 0.5)
		return [color.r, color.g, color.b]
	}
	const color = new THREE.Color()
	const colorI = Math.floor(i / 1000)
	color.setHSL(0.8 + colorI / (255 * 0.2), 1, 0.5)
	return [color.r, color.g, color.b]
}

export function createAttractorPage(config: AttractorPageConfig): AttractorPageComponent {
	const {
		params,
		examples = [],
		seed = { x: 0, y: 0 },
		iterate,
		scale = 1,
		color = 'hsl-chunk',
		trailLength = 100,
		numParticles = 200_000,
		pointSize = 0.5,
		cameraPosition = [0, 0, 220],
		description,
	} = config

	const camZ = Math.abs(cameraPosition[2] ?? 220)

	const AttractorPage = () => {
		const dispatch = useAppDispatch()
		const { data } = useAppSelector(state => state.WebSlice)
		const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState()

		const datData = useMemo(
			(): TDatData => ({
				options: params,
				examples,
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

		const tick: TParticleProps<Record<string, number>>['tick'] = (
			positions,
			colors,
			_state,
			delta,
		) => {
			const resolved: Record<string, number> = {}
			for (const [key, def] of Object.entries(params)) {
				const raw = data[key]
				resolved[key] = raw !== undefined ? raw : def.initialValue
			}

			const totalParticles = positions.length / EDimensions.TWO_D
			const particlesToDraw = calculateParticlesToDraw(totalParticles, delta)

			let x = seed.x
			let y = seed.y

			for (let i = 0; i < totalParticles; i++) {
				if (i < particlesToDraw) {
					const next = iterate(x, y, resolved)
					x = next.x
					y = next.y

					const px =
						typeof scale === 'function' ? scale(x, y)[0] : x * scale
					const py =
						typeof scale === 'function' ? scale(x, y)[1] : y * scale
					positions.set([px, py], i * EDimensions.TWO_D)
					colors.set(resolveColor(color, i, particlesToDraw, trailLength), i * 3)
				} else {
					positions.set([9999, 9999], i * EDimensions.TWO_D)
					colors.set([0, 0, 0], i * 3)
				}
			}

			updateProgressUI(particlesToDraw, totalParticles)
			checkCompletion(particlesToDraw, totalParticles)

			return particlesToDraw
		}

		return (
			<Base
				dimension={EDimensions.TWO_D}
				numParticles={resolveParticleCount(numParticles)}
				tick={tick}
				pointSize={pointSize}
				cameraPosition={[0, 0, camZ]}
			/>
		)
	}

	AttractorPage.getDescription = description
	return AttractorPage
}
