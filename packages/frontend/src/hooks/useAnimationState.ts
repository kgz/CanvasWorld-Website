import { isEmbedFullReveal } from '../modules/embedMode'
import { isEmbedTransportPaused } from '../modules/embedBridge'
import { isScreenshotMode } from '../modules/screenshotMode'
import { useAnimation } from '../context/AnimationContext'

export const useAnimationState = (options?: { baseSpeed?: number }) => {
	const {
		isPaused,
		isPausedRef,
		manualProgress,
		animationSpeed,
		currentProgressRef,
		reportProgress,
	} = useAnimation()

	const baseSpeed = options?.baseSpeed ?? 2000

	const calculateParticlesToDraw = (totalParticles: number, delta: number) => {
		if (isScreenshotMode()) {
			return totalParticles
		}

		const paused = isPaused || isPausedRef.current || isEmbedTransportPaused()

		if (manualProgress !== null) {
			const particlesToDraw = Math.min(manualProgress, totalParticles)
			currentProgressRef.current = particlesToDraw
			return Math.max(particlesToDraw, 100)
		}

		if (paused) {
			if (isEmbedFullReveal() && currentProgressRef.current < totalParticles) {
				currentProgressRef.current = totalParticles
			}
			return Math.max(Math.floor(currentProgressRef.current), 100)
		}

		if (isEmbedFullReveal()) {
			currentProgressRef.current = totalParticles
			return totalParticles
		}

		const increment = delta * baseSpeed * animationSpeed
		currentProgressRef.current = Math.min(
			currentProgressRef.current + increment,
			totalParticles,
		)
		return Math.max(Math.floor(currentProgressRef.current), 100)
	}

	const updateProgressUI = (particlesToDraw: number, totalParticles: number) => {
		reportProgress(particlesToDraw, totalParticles)
	}

	const checkCompletion = (particlesToDraw: number, totalParticles: number) => {
		reportProgress(particlesToDraw, totalParticles)
	}

	return {
		calculateParticlesToDraw,
		updateProgressUI,
		checkCompletion,
	}
}
