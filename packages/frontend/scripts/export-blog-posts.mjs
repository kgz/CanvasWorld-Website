#!/usr/bin/env node
/**
 * Extract export const meta = {…} + plain HTML body from MDX posts
 * → packages/shared/blog-posts.json (Go SSR / Google-visible HTML)
 *
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
				return { meta: new Function(`return (${literal})`)(), end: i + 1 }
			}
		}
	}
	return null
}

function escapeHtml(s) {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

/** Strip MDX/JSX chrome into simple semantic HTML for crawlers. */
function mdxBodyToHtml(raw) {
	let s = raw
	// fenced code → pre
	s = s.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) => `<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`)
	// self-closing / void-ish JSX components
	s = s.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '')
	// Callout / VizEmbedGrid blocks with children
	s = s.replace(/<Callout\b[^>]*>[\s\S]*?<\/Callout>/g, '')
	s = s.replace(/<VizEmbedGrid\b[^>]*>[\s\S]*?<\/VizEmbedGrid>/g, '')
	s = s.replace(/<[A-Z][A-Za-z0-9]*\b[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, '')
	// InlineMath / leftover JSX tags
	s = s.replace(/<\/?[A-Z][A-Za-z0-9]*\b[^>]*>/g, '')
	// markdown links [text](url)
	s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
		const safeHref = href.startsWith('http') || href.startsWith('/') ? href : '#'
		return `<a href="${escapeHtml(safeHref)}">${escapeHtml(text)}</a>`
	})
	// inline code
	s = s.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`)
	// bold/italic light
	s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
	s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')

	const lines = s.split(/\n/)
	const out = []
	let para = []
	const flushPara = () => {
		const t = para.join(' ').trim()
		para = []
		if (t) out.push(`<p>${t}</p>`)
	}
	for (const line of lines) {
		const trimmed = line.trim()
		if (!trimmed) {
			flushPara()
			continue
		}
		if (trimmed.startsWith('<pre>')) {
			flushPara()
			out.push(trimmed)
			continue
		}
		const h2 = trimmed.match(/^##\s+(.+)$/)
		if (h2) {
			flushPara()
			out.push(`<h2>${escapeHtml(h2[1])}</h2>`)
			continue
		}
		const h3 = trimmed.match(/^###\s+(.+)$/)
		if (h3) {
			flushPara()
			out.push(`<h3>${escapeHtml(h3[1])}</h3>`)
			continue
		}
		para.push(trimmed)
	}
	flushPara()
	return out.join('\n')
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx')).sort()
const posts = []
for (const file of files) {
	const src = fs.readFileSync(path.join(postsDir, file), 'utf8')
	const extracted = extractMetaObject(src)
	if (!extracted || typeof extracted.meta.slug !== 'string' || typeof extracted.meta.title !== 'string') {
		console.error(`skip ${file}: missing meta.slug/title`)
		continue
	}
	const meta = extracted.meta
	const bodySrc = src.slice(extracted.end)
	posts.push({
		slug: meta.slug,
		title: meta.title,
		excerpt: typeof meta.excerpt === 'string' ? meta.excerpt : '',
		tag: typeof meta.tag === 'string' ? meta.tag : '',
		thumbSlug: typeof meta.thumbSlug === 'string' ? meta.thumbSlug : '',
		order: typeof meta.order === 'number' ? meta.order : 0,
		featured: Boolean(meta.featured),
		bodyHtml: mdxBodyToHtml(bodySrc),
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
