export type CatalogRenderMode = 'webgl' | 'shader'

export type VizRouteChrome = {
	renderMode: CatalogRenderMode
	usesTransportBar?: boolean
	progressLabel?: string
}

export function isShaderRenderMode(renderMode: CatalogRenderMode): boolean {
	return renderMode === 'shader'
}

export function routeShowsTransportBar(route: VizRouteChrome): boolean {
	if (route.usesTransportBar === true) {
		return true
	}
	return !isShaderRenderMode(route.renderMode)
}

export function routeProgressLabel(route: Pick<VizRouteChrome, 'progressLabel'>): string {
	return route.progressLabel ?? 'n'
}
