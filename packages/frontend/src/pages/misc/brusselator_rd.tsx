import { BlockMath, InlineMath } from 'react-katex'
import { useEffect, useMemo, useRef } from 'react'
import { EDimensions, type TDatData, type TDataFromObject, type TParticleProps } from '../../@types/gui'
import Base from '../_base'
import { setDatData, setData } from '../../@store/WebSlice'
import { useAppDispatch, useAppSelector } from '../../@store/store'
import { useAnimation } from '../../context/AnimationContext'
import { isEmbedTransportPaused } from '../../modules/embedBridge'
import { isEmbedFullReveal } from '../../modules/embedMode'
import { isScreenshotMode } from '../../modules/screenshotMode'
import {
	BRUSSELATOR_RD_DEFAULT_SIZE,
	BRUSSELATOR_RD_TARGET_STEPS,
	clampGridSize,
	fillColorsFromU,
	fillGridPositions,
	runBrusselatorRdSteps,
	seedBrusselatorRd,
	stepBrusselatorRd,
	type BrusselatorRdField,
	type BrusselatorRdParams,
} from '../../utils/brusselatorRd'

const STEPS_PER_SECOND = 48

const BrusselatorRd = () => {
	const dispatch = useAppDispatch()
	const { data } = useAppSelector((state) => state.WebSlice)
	const {
		isPaused,
		isPausedRef,
		manualProgress,
		animationSpeed,
		reportProgress,
		currentProgressRef,
		isComplete,
	} = useAnimation()

	const fieldRef = useRef<BrusselatorRdField | null>(null)
	const stepsRef = useRef(0)
	const lastManualRef = useRef<number | null>(null)
	const simKeyRef = useRef('')
	const gridKeyRef = useRef(0)
	const laidOutRef = useRef(false)
	const wasCompleteRef = useRef(false)

	const datData = useMemo(
		(): TDatData => ({
			options: {
				a: { initialValue: 1, min: 0.5, max: 3, step: 0.01 },
				b: { initialValue: 3, min: 1, max: 5, step: 0.01 },
				du: { initialValue: 1, min: 0.1, max: 4, step: 0.05 },
				dv: { initialValue: 8, min: 1, max: 16, step: 0.1 },
				dt: { initialValue: 0.01, min: 0.001, max: 0.04, step: 0.001 },
				grid: { initialValue: BRUSSELATOR_RD_DEFAULT_SIZE, min: 32, max: 192, step: 16 },
			},
			examples: [
				{ a: 1, b: 3, du: 1, dv: 8, dt: 0.01, grid: 96 },
				{ a: 1, b: 2.6, du: 1, dv: 10, dt: 0.01, grid: 96 },
				{ a: 1.2, b: 3.5, du: 0.8, dv: 12, dt: 0.008, grid: 128 },
				{ a: 0.8, b: 2.2, du: 1.2, dv: 6, dt: 0.012, grid: 64 },
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

	const a = data.a ?? datData.options.a.initialValue
	const b = data.b ?? datData.options.b.initialValue
	const du = data.du ?? datData.options.du.initialValue
	const dv = data.dv ?? datData.options.dv.initialValue
	const dt = data.dt ?? datData.options.dt.initialValue
	const grid = clampGridSize(data.grid ?? datData.options.grid.initialValue)
	const numParticles = grid * grid

	const params: BrusselatorRdParams = useMemo(
		() => ({ a, b, du, dv, dt }),
		[a, b, du, dv, dt],
	)

	/** Reseed only on grid change / force — tweaking a/b/Du/Dv/dt keeps n and the field. */
	const ensureField = (force = false): BrusselatorRdField => {
		if (force || !fieldRef.current || gridKeyRef.current !== grid) {
			fieldRef.current = seedBrusselatorRd(grid, a, b)
			gridKeyRef.current = grid
			stepsRef.current = 0
			laidOutRef.current = false
			lastManualRef.current = null
			currentProgressRef.current = 0
		}
		return fieldRef.current
	}

	const tick: TParticleProps<TData>['tick'] = (positions, colors, _state, delta) => {
		if (wasCompleteRef.current && !isComplete) {
			ensureField(true)
		}
		wasCompleteRef.current = isComplete

		const field = ensureField()
		const target = BRUSSELATOR_RD_TARGET_STEPS
		const paused = isPaused || isPausedRef.current || isEmbedTransportPaused()

		if (!laidOutRef.current || field.size * field.size !== numParticles) {
			fillGridPositions(positions, field.size, 1)
			laidOutRef.current = true
		}

		if (isScreenshotMode() || isEmbedFullReveal()) {
			if (stepsRef.current < target) {
				runBrusselatorRdSteps(field, params, target - stepsRef.current)
				stepsRef.current = target
			}
			fillColorsFromU(colors, field, a)
			reportProgress(target, target)
			return numParticles
		}

		if (manualProgress !== null) {
			const want = Math.max(0, Math.min(target, Math.floor(manualProgress)))
			const simKey = `${a}|${b}|${du}|${dv}|${dt}`
			if (lastManualRef.current !== want || simKeyRef.current !== simKey) {
				fieldRef.current = seedBrusselatorRd(grid, a, b)
				const fresh = fieldRef.current
				runBrusselatorRdSteps(fresh, params, want)
				stepsRef.current = want
				lastManualRef.current = want
				simKeyRef.current = simKey
				laidOutRef.current = false
				fillGridPositions(positions, fresh.size, 1)
				laidOutRef.current = true
				fillColorsFromU(colors, fresh, a)
			} else if (fieldRef.current) {
				fillColorsFromU(colors, fieldRef.current, a)
			}
			reportProgress(want, target)
			currentProgressRef.current = want
			return numParticles
		}

		lastManualRef.current = null

		if (!paused) {
			const budget = Math.max(1, Math.round(delta * STEPS_PER_SECOND * animationSpeed))
			for (let i = 0; i < budget; i++) {
				stepBrusselatorRd(field, params)
			}
			stepsRef.current += budget
		}

		fillColorsFromU(colors, field, a)

		if (stepsRef.current <= target) {
			reportProgress(Math.min(stepsRef.current, target), target)
			currentProgressRef.current = Math.min(stepsRef.current, target)
		}

		return numParticles
	}

	// World-space points sized to cell pitch (slight overlap) so the field reads solid, not a dotted grid.
	const cellPitch = 2 / Math.max(grid - 1, 1)
	const pointSize = cellPitch * 1.55

	return (
		<Base<TData>
			dimension={EDimensions.TWO_D}
			numParticles={numParticles}
			pointSize={pointSize}
			tick={tick}
			cameraPosition={[0, 0, 2.35]}
		/>
	)
}

BrusselatorRd.getDescription = () => (
	<>
		Spatial Brusselator reaction–diffusion on a grid — concentrations <InlineMath math="u" /> and{' '}
		<InlineMath math="v" /> evolve with diffusion and the classic autocatalytic kinetics. Spots,
		stripes, or waves form when <InlineMath math="v" /> diffuses faster than <InlineMath math="u" />.
		This is not the well-mixed ODE phase-orbit page (<code>/brusselator</code>).
		<br />
		<br />
		<strong>PDEs</strong> (reflective / Neumann borders):
		<BlockMath math={'\\partial_t u = D_u\\nabla^2 u + a - (b+1)u + u^2 v'} />
		<BlockMath math={'\\partial_t v = D_v\\nabla^2 v + b u - u^2 v'} />
		<br />
		Defaults: <code>a = 1</code>, <code>b = 3</code>, <code>Du = 1</code>, <code>Dv = 8</code>,{' '}
		<code>dt = 0.01</code>, grid <code>96</code>. Seed is the steady state{' '}
		<InlineMath math="(a,\,b/a)" /> plus noise. Transport <code>n</code> scrubs step count from a
		fresh seed; play keeps the field evolving. Changing kinetics knobs keeps the current field and{' '}
		<code>n</code>; changing <code>grid</code> reseeds.
	</>
)

export default BrusselatorRd
