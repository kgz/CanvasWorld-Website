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
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../../backend/static/images')
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3002').replace(/\/$/, '')

const SLUGS = [
	'bedhead_attractor',
	'bogdanov_map',
	'clifford_attractor',
	'fractal_dream_attractor',
	'gumowski-mira_attractor',
	'henon_map',
	'hopalong_attractor',
	'hopalong_attractor_positive',
	'hopalong_attractor_additive',
	'hopalong_attractor_sinusoidal',
	'gingerbread_man',
	'ikeda_map',
	'mandelbrot_set',
	'sierpiński_triangle',
]

function parseSlugArg(argv) {
	const i = argv.indexOf('--slug')
	if (i >= 0 && argv[i + 1]) {
		return argv[i + 1]
	}
	return null
}

async function captureSlug(page, slug) {
	const url = `${FRONTEND_URL}/${slug}?screenshot=true`
	console.log(`→ ${url}`)
	await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
	await page.waitForSelector('#cw-viz-canvas', { timeout: 30000 })
	await page.waitForFunction(() => window.__CW_READY__ === true, null, { timeout: 45000 })
	await page.waitForTimeout(250)
	const canvas = page.locator('#cw-viz-canvas')
	const buf = await canvas.screenshot({ type: 'png' })
	const out = path.join(OUT_DIR, `${slug}.png`)
	await writeFile(out, buf)
	console.log(`  saved ${out} (${buf.length} bytes)`)
}

async function main() {
	const only = parseSlugArg(process.argv.slice(2))
	const slugs = only ? [only] : SLUGS

	await mkdir(OUT_DIR, { recursive: true })

	const browser = await chromium.launch({ headless: true })
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
