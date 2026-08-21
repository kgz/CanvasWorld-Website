#!/usr/bin/env node
/**
 * Extract export const meta = {…} from MDX posts → packages/shared/blog-posts.json
 * Run from packages/frontend: pnpm run export-blog-posts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.resolve(__dirname, '../src/blog/posts')
const outPath = path.resolve(__dirname, '../../shared/blog-posts.json')

/** Keep in sync with packages/frontend/src/blog/registry.ts */
const redirects = {
	'render-loop': 'clifford',
	'clifford-60fps': 'clifford',
	'l-systems': 'sierpinski-gasket',
}

function extractMetaObject(src) {
	const marker = 'export const meta ='
	const start = src.indexOf(marker)
	if (start < 0) {
		return null
	}
	const brace = src.indexOf('{', start)
	if (brace < 0) {
		return null
	}
	let depth = 0
	for (let i = brace; i < src.length; i++) {
		const ch = src[i]
		if (ch === '{') depth++
		else if (ch === '}') {
			depth--
			if (depth === 0) {
				const literal = src.slice(brace, i + 1)
				return new Function(`return (${literal})`)()
			}
		}
	}
	return null
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx')).sort()
const posts = []
for (const file of files) {
	const src = fs.readFileSync(path.join(postsDir, file), 'utf8')
	const meta = extractMetaObject(src)
	if (!meta || typeof meta.slug !== 'string' || typeof meta.title !== 'string') {
		console.error(`skip ${file}: missing meta.slug/title`)
		continue
	}
	posts.push({
		slug: meta.slug,
		title: meta.title,
		excerpt: typeof meta.excerpt === 'string' ? meta.excerpt : '',
		tag: typeof meta.tag === 'string' ? meta.tag : '',
		thumbSlug: typeof meta.thumbSlug === 'string' ? meta.thumbSlug : '',
		order: typeof meta.order === 'number' ? meta.order : 0,
		featured: Boolean(meta.featured),
	})
}

posts.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))

const payload = {
	redirects,
	posts,
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, '\t')}\n`)
console.log(`wrote ${posts.length} posts → ${outPath}`)
