import {
	createContext,
	useContext,
	useRef,
	useState,
	type ReactNode,
} from 'react'

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
	reportProgress: (drawn: number, total: number) => void
	replay: () => void
}

const AnimationContext = createContext<AnimationContextValue | null>(null)

const UI_UPDATE_MS = 50

export function AnimationProvider({ children }: { children: ReactNode }) {
	const [isPaused, setPaused] = useState(false)
	const [animationSpeed, setSpeed] = useState(1)
	const [manualProgress, setManualProgress] = useState<number | null>(null)
	const [isComplete, setComplete] = useState(false)
	const [particlesDrawn, setParticlesDrawn] = useState(0)
	const [totalParticles, setTotalParticles] = useState(200_000)
	const currentProgressRef = useRef(100)
	const lastUiUpdateRef = useRef(0)

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
	}

	const replay = () => {
		currentProgressRef.current = 100
		setManualProgress(null)
		setComplete(false)
		setPaused(false)
		setParticlesDrawn(0)
	}

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
