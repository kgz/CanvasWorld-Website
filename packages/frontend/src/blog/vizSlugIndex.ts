const VIZ_EMBED_SLUG = /<VizEmbed\b[^>]*?\bslug=(["'])([^"']+)\1/g

export function vizSlugsFromMdx(source: string): string[] {
	const slugs: string[] = []
	const seen = new Set<string>()
	const re = new RegExp(VIZ_EMBED_SLUG.source, 'g')
	let match: RegExpExecArray | null = re.exec(source)
	while (match) {
		const slug = match[2]
		if (slug && !seen.has(slug)) {
			seen.add(slug)
			slugs.push(slug)
		}
		match = re.exec(source)
	}
	return slugs
}

export function relatedVizSlugs(source: string, thumbSlug: string | undefined): string[] {
	const slugs = vizSlugsFromMdx(source)
	if (thumbSlug && !slugs.includes(thumbSlug)) {
		slugs.push(thumbSlug)
	}
	return slugs
}

export function buildPostsByVizSlug<T extends { slug: string; meta: { thumbSlug?: string } }>(
	posts: T[],
	sourceByPostSlug: Record<string, string>,
): Map<string, T[]> {
	const map = new Map<string, T[]>()
	for (const post of posts) {
		const source = sourceByPostSlug[post.slug] ?? ''
		for (const vizSlug of relatedVizSlugs(source, post.meta.thumbSlug)) {
			const list = map.get(vizSlug)
			if (list) {
				if (!list.some((item) => item.slug === post.slug)) {
					list.push(post)
				}
			} else {
				map.set(vizSlug, [post])
			}
		}
	}
	return map
}

export const HOME_NOTE_LIMIT = 3

export function featuredHomePosts<T extends { meta: { featured?: boolean } }>(
	posts: T[],
	limit = HOME_NOTE_LIMIT,
): T[] {
	const featured = posts.filter((post) => post.meta.featured)
	const rest = posts.filter((post) => !post.meta.featured)
	return [...featured, ...rest].slice(0, limit)
}
