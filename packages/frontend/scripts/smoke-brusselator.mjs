#!/usr/bin/env node
/**
 * Smoke: open /brusselator?screenshot=true and assert canvas + ready signal.
 *
 *   FRONTEND_URL=http://localhost:5173/chaos pnpm smoke:brusselator
 */
import { chromium } from 'playwright'

const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173/chaos').replace(/\/$/, '')
const SLUG = 'brusselator'

async function main() {
	const browser = await chromium.launch({
		headless: true,
		args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'],
	})
	const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
	const url = `${FRONTEND_URL}/${encodeURI(SLUG)}?screenshot=true`
	console.log(`→ ${url}`)

	const errors = []
	page.on('pageerror', (err) => errors.push(String(err)))

	await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
	await page.waitForSelector('#cw-viz-canvas', { timeout: 30000 })
	await page.waitForFunction(() => window.__CW_READY__ === true, null, { timeout: 45000 })

	const stats = await page.evaluate(() => {
		const canvas = document.querySelector('#cw-viz-canvas')
		if (!(canvas instanceof HTMLCanvasElement)) {
			return { ok: false, reason: 'no canvas' }
		}
		const gl =
			canvas.getContext('webgl2') ||
			canvas.getContext('webgl') ||
			canvas.getContext('experimental-webgl')
		return {
			ok: true,
			width: canvas.width,
			height: canvas.height,
			hasGl: Boolean(gl),
			ready: window.__CW_READY__ === true,
		}
	})

	await browser.close()

	if (errors.length) {
		console.error('page errors:', errors)
		process.exitCode = 1
		return
	}
	if (!stats.ok || !stats.ready || stats.width < 1 || stats.height < 1) {
		console.error('smoke failed:', stats)
		process.exitCode = 1
		return
	}
	console.log('ok', stats)
}

main().catch((err) => {
	console.error(err)
	process.exitCode = 1
})
