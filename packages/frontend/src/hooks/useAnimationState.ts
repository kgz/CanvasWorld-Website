import { useEffect, useRef, useState } from 'react'
import { isScreenshotMode } from '../modules/screenshotMode'

export const useAnimationState = () => {
	const [isPaused, setIsPaused] = useState(false)
	const [manualProgress, setManualProgress] = useState<number | null>(null)
	const [animationSpeed, setAnimationSpeed] = useState(1)
	const currentProgressRef = useRef<number>(100)

	useEffect(() => {
		const handleToggleAnimation = (event: CustomEvent) => {
			setIsPaused(event.detail.paused)
		}

		const handleSetProgress = (event: CustomEvent) => {
			setManualProgress(event.detail.progress)
		}

		const handleReleaseProgress = () => {
			setManualProgress(null)
		}

		const handleSetSpeed = (event: CustomEvent) => {
			setAnimationSpeed(event.detail.speed)
		}

		const handleReplay = () => {
			currentProgressRef.current = 100
			setIsPaused(false)
		}

		window.addEventListener('toggleAnimation', handleToggleAnimation as EventListener)
		window.addEventListener('setAnimationProgress', handleSetProgress as EventListener)
		window.addEventListener('releaseAnimationProgress', handleReleaseProgress)
		window.addEventListener('setAnimationSpeed', handleSetSpeed as EventListener)
		window.addEventListener('replayAnimation', handleReplay)

		return () => {
			window.removeEventListener('toggleAnimation', handleToggleAnimation as EventListener)
			window.removeEventListener('setAnimationProgress', handleSetProgress as EventListener)
			window.removeEventListener('releaseAnimationProgress', handleReleaseProgress)
			window.removeEventListener('setAnimationSpeed', handleSetSpeed as EventListener)
			window.removeEventListener('replayAnimation', handleReplay)
		}
	}, [])

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
				totalParticles
			)
			particlesToDraw = Math.floor(currentProgressRef.current)
		}

		return Math.max(particlesToDraw, 100)
	}

	const updateProgressUI = (particlesToDraw: number, totalParticles: number) => {
		const progressText = document.getElementById('progress-text')
		const progressSlider = document.getElementById('progress-slider') as HTMLInputElement
		
		if (progressText) {
			progressText.textContent = `${particlesToDraw.toLocaleString()} / ${totalParticles.toLocaleString()}`
		}
		if (progressSlider) {
			progressSlider.value = particlesToDraw.toString()
		}
	}

	const checkCompletion = (particlesToDraw: number, totalParticles: number) => {
		const isAnimationComplete = particlesToDraw >= totalParticles
		window.dispatchEvent(new CustomEvent('animationComplete', {
			detail: { complete: isAnimationComplete }
		}))
	}

	return {
		calculateParticlesToDraw,
		updateProgressUI,
		checkCompletion
	}
}

