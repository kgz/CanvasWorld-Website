/**
 * Static check: every blog VizEmbed / Callout / thumbSlug resolves to an
 * active catalog slug that has a FE component map entry.
 *
 *   pnpm validate-blog-embeds
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const postsDir = path.join(root, 'frontend/src/blog/posts')
const catalogPath = path.join(root, 'shared/routes.json')
const routesTsxPath = path.join(root, 'frontend/src/@types/routes.tsx')

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const active = new Set(catalog.filter((e) => e.active).map((e) => e.slug))

const routesTsx = fs.readFileSync(routesTsxPath, 'utf8')
const block = routesTsx.match(/const components[^=]*=\s*\{([\s\S]*?)\n\}/)
if (!block) {
	console.error('could not parse components map in routes.tsx')
	process.exit(1)
}
const components = new Set()
for (const line of block[1].split('\n')) {
	const m = line.match(/^\t(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:/)
	if (m) {
		components.add(m[1] ?? m[2])
	}
}

/** @type {{ file: string, kind: string, slug: string }[]} */
const refs = []
for (const file of fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))) {
	const text = fs.readFileSync(path.join(postsDir, file), 'utf8')
	for (const m of text.matchAll(/VizEmbed\s+slug="([^"]+)"/g)) {
		refs.push({ file, kind: 'VizEmbed', slug: m[1] })
	}
	for (const m of text.matchAll(/Callout\s+to="\/([^"]+)"/g)) {
		refs.push({ file, kind: 'Callout', slug: m[1] })
	}
	const thumb = text.match(/thumbSlug:\s*'([^']+)'/)
	if (thumb) {
		refs.push({ file, kind: 'thumbSlug', slug: thumb[1] })
	}
}

const missingCatalog = []
const inactive = []
const missingComponent = []
for (const ref of refs) {
	if (!active.has(ref.slug) && !catalog.some((e) => e.slug === ref.slug)) {
		missingCatalog.push(ref)
	} else if (!active.has(ref.slug)) {
		inactive.push(ref)
	}
	if (!components.has(ref.slug)) {
		missingComponent.push(ref)
	}
}

const catalogMissingComponent = [...active].filter((s) => !components.has(s))

let failed = false
const report = (label, rows) => {
	if (rows.length === 0) {
		return
	}
	failed = true
	console.error(`\n${label} (${rows.length}):`)
	for (const r of rows) {
		if (typeof r === 'string') {
			console.error(`  ${r}`)
		} else {
			console.error(`  ${r.file}: ${r.kind} → ${r.slug}`)
		}
	}
}

report('Blog refs missing from catalog', missingCatalog)
report('Blog refs to inactive catalog slugs', inactive)
report('Blog refs with no FE component map entry', missingComponent)
report('Active catalog slugs with no FE component', catalogMissingComponent)

if (failed) {
	process.exit(1)
}

const unique = new Set(refs.map((r) => r.slug))
console.log(
	`ok: ${refs.length} blog refs → ${unique.size} unique slugs; catalog active ${active.size}; components ${components.size}`,
)
