import { isScreenshotMode } from '../modules/screenshotMode'
import { useAnimation } from '../context/AnimationContext'

export const useAnimationState = () => {
	const {
		isPaused,
		manualProgress,
		animationSpeed,
		currentProgressRef,
		reportProgress,
	} = useAnimation()

	const calculateParticlesToDraw = (totalParticles: number, delta: number) => {
		if (isScreenshotMode()) {
			return totalParticles
		}

		const baseSpeed = 2000

		let particlesToDraw: number
		if (manualProgress !== null) {
			particlesToDraw = Math.min(manualProgress, totalParticles)
			currentProgressRef.current = particlesToDraw
		} else if (isPaused) {
			particlesToDraw = currentProgressRef.current
		} else {
			const increment = delta * baseSpeed * animationSpeed
			currentProgressRef.current = Math.min(
				currentProgressRef.current + increment,
				totalParticles,
			)
			particlesToDraw = Math.floor(currentProgressRef.current)
		}

		return Math.max(particlesToDraw, 100)
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
