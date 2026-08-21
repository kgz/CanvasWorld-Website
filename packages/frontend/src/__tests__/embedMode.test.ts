import { describe, expect, it } from 'vitest'
import { DEFAULT_EMBED_PARTICLES, resolveParticleCount } from '../modules/embedMode'

describe('resolveParticleCount', () => {
	const full = 200_000

	it('keeps full count outside embed mode', () => {
		window.history.pushState({}, '', '/chaos/hopalong_attractor')
		expect(resolveParticleCount(full)).toBe(full)
	})

	it('defaults to embed budget with ?iframe', () => {
		window.history.pushState({}, '', '/chaos/hopalong_attractor?iframe=1')
		expect(resolveParticleCount(full)).toBe(DEFAULT_EMBED_PARTICLES)
	})

	it('honours ?particles= and particles=full', () => {
		window.history.pushState({}, '', '/chaos/hopalong_attractor?iframe=1&particles=16000')
		expect(resolveParticleCount(full)).toBe(16000)
		window.history.pushState({}, '', '/chaos/hopalong_attractor?iframe=1&particles=full')
		expect(resolveParticleCount(full)).toBe(full)
	})
})
