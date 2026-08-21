import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react'
import {
	parseEmbedControl,
	postEmbedProgress,
	setEmbedTransportPaused,
} from '../modules/embedBridge'
import { isEmbedMode } from '../modules/embedMode'

export type AnimationContextValue = {
	isPaused: boolean
	setPaused: (paused: boolean) => void
	animationSpeed: number
	setSpeed: (speed: number) => void
	manualProgress: number | null
	setManualProgress: (progress: number | null) => void
	isComplete: boolean
	particlesDrawn: number
	totalParticles: number
	currentProgressRef: { current: number }
	isPausedRef: { current: boolean }
	reportProgress: (drawn: number, total: number) => void
	replay: () => void
}

const AnimationContext = createContext<AnimationContextValue | null>(null)

const UI_UPDATE_MS = 50

export function AnimationProvider({ children }: { children: ReactNode }) {
	const [isPaused, setPausedState] = useState(false)
	const [animationSpeed, setSpeed] = useState(1)
	const [manualProgress, setManualProgress] = useState<number | null>(null)
	const [isComplete, setComplete] = useState(false)
	const [particlesDrawn, setParticlesDrawn] = useState(0)
	const [totalParticles, setTotalParticles] = useState(200_000)
	const currentProgressRef = useRef(100)
	const isPausedRef = useRef(false)
	const lastUiUpdateRef = useRef(0)
	const lastPostedAtRef = useRef(0)
	const lastPostedCompleteRef = useRef(false)
	const totalParticlesRef = useRef(totalParticles)
	totalParticlesRef.current = totalParticles

	const setPaused = (paused: boolean) => {
		isPausedRef.current = paused
		if (isEmbedMode()) {
			setEmbedTransportPaused(paused)
		}
		setPausedState(paused)
	}

	const reportProgress = (drawn: number, total: number) => {
		const complete = drawn >= total
		setComplete(complete)
		if (complete) {
			setPaused(true)
		}

		const now = performance.now()
		if (complete || now - lastUiUpdateRef.current >= UI_UPDATE_MS) {
			lastUiUpdateRef.current = now
			setParticlesDrawn(drawn)
			setTotalParticles(total)
		}

		if (isEmbedMode()) {
			const completeChanged = complete !== lastPostedCompleteRef.current
			if (completeChanged || complete || now - lastPostedAtRef.current >= UI_UPDATE_MS) {
				lastPostedAtRef.current = now
				lastPostedCompleteRef.current = complete
				postEmbedProgress(drawn, total, complete)
			}
		}
	}

	const replay = () => {
		currentProgressRef.current = 100
		setManualProgress(null)
		setComplete(false)
		setPaused(false)
		setParticlesDrawn(0)
		lastPostedCompleteRef.current = false
		if (isEmbedMode()) {
			postEmbedProgress(0, totalParticlesRef.current, false)
		}
	}

	useEffect(() => {
		if (!isEmbedMode()) {
			setEmbedTransportPaused(false)
			return
		}
		setEmbedTransportPaused(isPausedRef.current)
		const onMessage = (event: MessageEvent) => {
			const control = parseEmbedControl(event.data)
			if (!control) {
				return
			}
			if (control.kind === 'pause') {
				setPaused(true)
				return
			}
			if (control.kind === 'play') {
				setPaused(false)
				return
			}
			currentProgressRef.current = 100
			setManualProgress(null)
			setComplete(false)
			setPaused(false)
			setParticlesDrawn(0)
			lastPostedCompleteRef.current = false
			postEmbedProgress(0, totalParticlesRef.current, false)
		}
		window.addEventListener('message', onMessage)
		return () => window.removeEventListener('message', onMessage)
		// setPaused is stable enough for the iframe lifetime; mount once per provider.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const value: AnimationContextValue = {
		isPaused,
		setPaused,
		animationSpeed,
		setSpeed,
		manualProgress,
		setManualProgress,
		isComplete,
		particlesDrawn,
		totalParticles,
		currentProgressRef,
		isPausedRef,
		reportProgress,
		replay,
	}

	return (
		<AnimationContext.Provider value={value}>
			{children}
		</AnimationContext.Provider>
	)
}

export function useAnimation(): AnimationContextValue {
	const ctx = useContext(AnimationContext)
	if (!ctx) {
		throw new Error('useAnimation must be used within AnimationProvider')
	}
	return ctx
}
