import type { ComponentType } from 'react'

export type PostMeta = {
	slug: string
	title: string
	tag: string
	excerpt: string
	dateLabel: string
	readMinutes: number
	featured?: boolean
	thumbSlug?: string
	order: number
}

export type PostModule = {
	meta: PostMeta
	default: ComponentType
}

export function formatPostMeta(meta: PostMeta): string {
	return `${meta.dateLabel} · ${meta.readMinutes} min read`
}
