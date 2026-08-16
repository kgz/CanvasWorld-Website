declare global {
	interface Window {
		__CW_READY__?: boolean
	}
}

export function isScreenshotMode(): boolean {
	if (typeof window === 'undefined') {
		return false
	}
	return new URLSearchParams(window.location.search).get('screenshot') === 'true'
}

export function markScreenshotReady(): void {
	if (!isScreenshotMode()) {
		return
	}
	// Two RAFs so the WebGL frame is presented before capturers read the canvas.
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			window.__CW_READY__ = true
		})
	})
}

export function resetScreenshotReady(): void {
	window.__CW_READY__ = false
}
