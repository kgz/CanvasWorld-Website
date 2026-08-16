#!/usr/bin/env node
/**
 * Capture gallery thumbs into packages/backend/static/images/{slug}.png
 *
 * Prerequisites:
 *   - Frontend running (default http://localhost:3002)
 *   - pnpm exec playwright install chromium  (once)
 *
 * Usage:
 *   FRONTEND_URL=http://localhost:3002 pnpm thumbs
 *   pnpm thumbs -- --slug clifford_attractor
 */
import { chromium } from 'playwright'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../../backend/static/images')
const CATALOG_PATH = path.resolve(__dirname, '../../shared/routes.json')
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3002').replace(/\/$/, '')

async function loadActiveSlugs() {
	const raw = await readFile(CATALOG_PATH, 'utf8')
	const entries = JSON.parse(raw)
	return entries.filter((e) => e.active).map((e) => e.slug)
}

function parseSlugArg(argv) {
	const filtered = argv.filter((a) => a !== '--')
	const i = filtered.indexOf('--slug')
	if (i >= 0 && filtered[i + 1]) {
		return filtered[i + 1]
	}
	return null
}

async function waitForDrawnCanvas(page) {
	await page.waitForFunction(() => window.__CW_READY__ === true, null, { timeout: 45000 })
	// Let a couple of presented frames land (preserveDrawingBuffer must be on).
	await page.waitForTimeout(800)
}

async function captureSlug(page, slug) {
	const url = `${FRONTEND_URL}/${encodeURI(slug)}?screenshot=true`
	console.log(`→ ${url}`)
	await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
	await page.waitForSelector('#cw-viz-canvas', { timeout: 30000 })
	await waitForDrawnCanvas(page)
	const canvas = page.locator('#cw-viz-canvas')
	const buf = await canvas.screenshot({ type: 'png' })
	const out = path.join(OUT_DIR, `${slug}.png`)
	await writeFile(out, buf)
	console.log(`  saved ${out} (${buf.length} bytes)`)
}

async function main() {
	const only = parseSlugArg(process.argv.slice(2))
	const slugs = only ? [only] : await loadActiveSlugs()

	await mkdir(OUT_DIR, { recursive: true })

	const browser = await chromium.launch({
		headless: true,
		args: [
			'--use-gl=angle',
			'--enable-webgl',
			'--ignore-gpu-blocklist',
		],
	})
	const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

	let failed = 0
	for (const slug of slugs) {
		try {
			await captureSlug(page, slug)
		} catch (err) {
			failed += 1
			console.error(`  FAIL ${slug}:`, err instanceof Error ? err.message : err)
		}
	}

	await browser.close()
	if (failed > 0) {
		process.exitCode = 1
		console.error(`Done with ${failed} failure(s)`)
	} else {
		console.log('Done')
	}
}

main()
