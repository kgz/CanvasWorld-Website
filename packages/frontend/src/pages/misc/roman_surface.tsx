import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimationState } from '../../hooks/useAnimationState'
import { isScreenshotMode } from '../../modules/screenshotMode'
import { clampSquash, sampleRomanIsolines } from '../../utils/romanSurface'

const NU = 48
const NV = 48
const DETAIL = 240
const NUM_PARTICLES = (NU + NV) * DETAIL

const RomanSurface = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const seeded = useRef(false)
	const { calculateParticlesToDraw, updateProgressUI, checkCompletion } = useAnimationState({
		baseSpeed: 32000,
	})

	const datData = useMemo(
		(): TDatData => ({
			options: {
				squash: { initialValue: 1, min: 0.25, max: 2.5, step: 0.01 },
			},
			examples: [
				{ squash: 0.45 },
				{ squash: 1 },
				{ squash: 1.6 },
				{ squash: 2.2 },
			],
		}),
		[],
	)

	type TData = TDataFromObject<(typeof datData)['options']>

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

	const squash = clampSquash(data.squash ?? datData.options.squash.initialValue)
	const cloud = useMemo(() => sampleRomanIsolines(NU, NV, DETAIL, squash), [squash])

	useEffect(() => {
		seeded.current = false
	}, [cloud])

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (!seeded.current) {
			positions.set(cloud.positions)
			colors.set(cloud.colors)
			seeded.current = true
		}
		const toDraw = Math.min(cloud.count, calculateParticlesToDraw(cloud.count, delta))
		updateProgressUI(toDraw, cloud.count)
		checkCompletion(toDraw, cloud.count)
		return toDraw
	}

	return (
		<Base<TData>
			dimension={EDimensions.THREE_D}
			numParticles={NUM_PARTICLES}
			pointSize={1.2}
			tick={tick}
			cameraPosition={[0, 0, 3.7]}
			autoRotate={!isScreenshotMode()}
			autoRotateSpeed={0.32}
		/>
	)
}

RomanSurface.getDescription = () => (
	<>
		Steiner’s Roman surface is a self-intersecting immersion of the real projective plane{' '}
		<InlineMath math="\mathbb{RP}^2" />. UV isoline particle wire — no lit mesh.
		<br />
		<br />
		<strong>Parametrization</strong> for <InlineMath math="u,v\in[0,\pi]" />:
		<BlockMath
			math={
				'x = a^2\\cos u\\sin u\\sin v,\\quad y = a^2\\cos u\\sin u\\cos v,\\quad z = a^2\\cos^2 u\\cos v\\sin v'
			}
		/>
		<br />
		<code>squash</code>: stretch <InlineMath math="z" /> before normalize — flatten or elongate the
		classic tetrahedral silhouette (<InlineMath math="1" /> = Steiner proportions).
		<br />
		Transport <code>n</code> reveals points.
	</>
)

export default RomanSurface
