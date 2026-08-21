import { isScreenshotMode } from './screenshotMode'

/** Default particle budget for notebook iframes (`?iframe`). */
export const DEFAULT_EMBED_PARTICLES = 24_000

function searchParams(): URLSearchParams {
	if (typeof window === 'undefined') {
		return new URLSearchParams()
	}
	return new URLSearchParams(window.location.search)
}

/** Bare stage embed (`?iframe`), used by notebook VizEmbed. */
export function isEmbedMode(): boolean {
	return searchParams().has('iframe')
}

/**
 * Jump transport `n` to full (no reveal ramp).
 * Default on for embeds; opt out with `?n=animate`. Screenshots always full.
 */
export function isEmbedFullReveal(): boolean {
	if (isScreenshotMode()) {
		return true
	}
	if (!isEmbedMode()) {
		return false
	}
	return searchParams().get('n') !== 'animate'
}

/** Clamp catalog particle count for embed iframes; optional `?particles=N` or `full`. */
export function resolveParticleCount(fullPageCount: number): number {
	if (!isEmbedMode()) {
		return fullPageCount
	}
	const raw = searchParams().get('particles')
	if (raw === 'full') {
		return fullPageCount
	}
	if (raw !== null && raw !== '') {
		const n = Number.parseInt(raw, 10)
		if (Number.isFinite(n) && n > 0) {
			return Math.min(n, fullPageCount)
		}
	}
	return Math.min(DEFAULT_EMBED_PARTICLES, fullPageCount)
}
