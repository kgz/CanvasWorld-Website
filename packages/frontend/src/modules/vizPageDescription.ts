import type { ReactNode } from 'react'
import { loadVizPage } from './vizPageLoaders'

export async function loadVizPageDescription(slug: string): Promise<ReactNode | null> {
	const mod = await loadVizPage(slug)
	const getDescription = Reflect.get(mod.default, 'getDescription')
	if (typeof getDescription === 'function') {
		return getDescription.call(mod.default)
	}
	return null
}
