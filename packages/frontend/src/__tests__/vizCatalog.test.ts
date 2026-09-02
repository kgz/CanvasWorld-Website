import { describe, expect, it } from 'vitest'
import {
	isShaderRenderMode,
	routeProgressLabel,
	routeShowsTransportBar,
	type VizRouteChrome,
} from '../modules/vizCatalog'

describe('vizCatalog', () => {
	it('identifies shader render mode', () => {
		expect(isShaderRenderMode('shader')).toBe(true)
		expect(isShaderRenderMode('webgl')).toBe(false)
	})

	it('hides transport for shader routes unless catalog opts in', () => {
		const shader: VizRouteChrome = { renderMode: 'shader' }
		const shaderWithTransport: VizRouteChrome = { renderMode: 'shader', usesTransportBar: true }
		const webgl: VizRouteChrome = { renderMode: 'webgl' }

		expect(routeShowsTransportBar(shader)).toBe(false)
		expect(routeShowsTransportBar(shaderWithTransport)).toBe(true)
		expect(routeShowsTransportBar(webgl)).toBe(true)
	})

	it('defaults progress label to n', () => {
		expect(routeProgressLabel({})).toBe('n')
		expect(routeProgressLabel({ progressLabel: 'depth' })).toBe('depth')
	})
})
