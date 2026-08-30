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
	// Let several presented frames land (line trails need drawRange + GPU upload).
	await page.waitForTimeout(1500)
}

async function captureSlug(page, slug) {
	const url = `${FRONTEND_URL}/${encodeURI(slug)}?screenshot=true`
	console.log(`→ ${url}`)
	await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
	await page.waitForSelector('#cw-viz-canvas', { timeout: 30000 })
	await waitForDrawnCanvas(page)

	// Supersample (deviceScaleFactor 2) then high-quality downsample — headless MSAA
	// on 1px line strips is weak; gallery cards look blotchy without this.
	// Optional solidify: crush AA fringes to a flat stroke color (soft translucent
	// trails wash gray when downscaled).
	const solidify =
		slug === 'lorenz_attractor'
			? { r: 102, g: 255, b: 224 }
			: null
	const boostLines = false
	const crispDownscale = slug === 'hilbert_curve'
	const dataUrl = await page.evaluate(
		({ flat, boost, crisp }) => {
		const src = document.querySelector('#cw-viz-canvas')
		if (!(src instanceof HTMLCanvasElement)) {
			return null
		}
		const out = document.createElement('canvas')
		out.width = 1280
		out.height = 960
		const ctx = out.getContext('2d')
		if (!ctx) {
			return null
		}
		ctx.imageSmoothingEnabled = !boost && !crisp
		ctx.imageSmoothingQuality = 'high'
		ctx.fillStyle = '#000'
		ctx.fillRect(0, 0, out.width, out.height)
		ctx.drawImage(src, 0, 0, out.width, out.height)
		if (flat || boost) {
			const img = ctx.getImageData(0, 0, out.width, out.height)
			const d = img.data
			for (let i = 0; i < d.length; i += 4) {
				if (flat && d[i] + d[i + 1] + d[i + 2] > 20) {
					d[i] = flat.r
					d[i + 1] = flat.g
					d[i + 2] = flat.b
					d[i + 3] = 255
				} else if (flat) {
					d[i] = 0
					d[i + 1] = 0
					d[i + 2] = 0
					d[i + 3] = 255
				} else if (boost && d[i] + d[i + 1] + d[i + 2] > 20) {
					d[i] = Math.min(255, Math.round(d[i] * 1.35))
					d[i + 1] = Math.min(255, Math.round(d[i + 1] * 1.35))
					d[i + 2] = Math.min(255, Math.round(d[i + 2] * 1.35))
					d[i + 3] = 255
				}
			}
			ctx.putImageData(img, 0, 0)
		}
		return out.toDataURL('image/png')
	},
		{ flat: solidify, boost: boostLines, crisp: crispDownscale },
	)

	if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/png;base64,')) {
		throw new Error('downsample capture failed')
	}
	const buf = Buffer.from(dataUrl.slice('data:image/png;base64,'.length), 'base64')
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
	// Match gallery card 4:3; 2× DPR then downsample (headless MSAA is weak on 1px lines).
	const page = await browser.newPage({
		viewport: { width: 1280, height: 960 },
		deviceScaleFactor: 2,
	})

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
