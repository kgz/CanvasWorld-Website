import type { PostMeta, PostModule } from './types'

const modules = import.meta.glob('./posts/*.mdx', { eager: true }) as Record<string, PostModule>

/** Old OD / notebook URLs → current meta.slug */
export const POST_SLUG_REDIRECTS: Record<string, string> = {
	'render-loop': 'clifford',
	'clifford-60fps': 'clifford',
	'l-systems': 'sierpinski-gasket',
}

function slugFromPath(path: string): string {
	const file = path.split('/').pop() ?? path
	return file.replace(/\.mdx$/, '')
}

export type RegisteredPost = {
	slug: string
	meta: PostMeta
	Component: PostModule['default']
}

export const posts: RegisteredPost[] = Object.entries(modules)
	.map(([path, mod]) => {
		const slug = mod.meta?.slug ?? slugFromPath(path)
		return {
			slug,
			meta: { ...mod.meta, slug },
			Component: mod.default,
		}
	})
	.sort((a, b) => a.meta.order - b.meta.order)

export function resolvePostSlug(slug: string): string {
	return POST_SLUG_REDIRECTS[slug] ?? slug
}

export function getPost(slug: string): RegisteredPost | undefined {
	return posts.find((p) => p.slug === resolvePostSlug(slug))
}

export function getAdjacent(slug: string): {
	prev: RegisteredPost | undefined
	next: RegisteredPost | undefined
} {
	const resolved = resolvePostSlug(slug)
	const i = posts.findIndex((p) => p.slug === resolved)
	if (i < 0) {
		return { prev: undefined, next: undefined }
	}
	return {
		prev: i > 0 ? posts[i - 1] : undefined,
		next: i < posts.length - 1 ? posts[i + 1] : undefined,
	}
}
