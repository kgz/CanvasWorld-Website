import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import catalog from '@cw/routes'
import { vizPageLoaders } from '../modules/vizPageLoaders'
import type { CatalogRenderMode } from '../modules/vizCatalog'

export type CatalogEntry = {
	slug: string
	title: string
	category: string
	description: string
	thumbnail: string
	renderMode: CatalogRenderMode
	usesTransportBar?: boolean
	progressLabel?: string
	active: boolean
}

export type TRoute = {
	name: string
	slug: string
	category: string
	description: string
	thumbnail: string
	renderMode: CatalogRenderMode
	usesTransportBar?: boolean
	progressLabel?: string
	element: LazyExoticComponent<ComponentType>
}

export type TRoutes = TRoute[]

function lazyVizPage(slug: string): LazyExoticComponent<ComponentType> {
	const load = vizPageLoaders[slug]
	if (!load) {
		throw new Error(`active catalog entry "${slug}" has no FE page loader`)
	}
	return lazy(load)
}

const catalogEntries: CatalogEntry[] = catalog

const routes: TRoutes = catalogEntries
	.filter((entry) => entry.active)
	.map((entry) => ({
		name: entry.title,
		slug: entry.slug,
		category: entry.category,
		description: entry.description,
		thumbnail: entry.thumbnail,
		renderMode: entry.renderMode,
		usesTransportBar: entry.usesTransportBar,
		progressLabel: entry.progressLabel,
		element: lazyVizPage(entry.slug),
	}))

export default routes
