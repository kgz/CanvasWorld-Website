/** postMessage channel between notebook VizEmbed and iframe canvas. */
export const CW_EMBED_CHANNEL = 'cw-embed'

export type EmbedProgressMessage = {
	channel: typeof CW_EMBED_CHANNEL
	kind: 'progress'
	drawn: number
	total: number
	complete: boolean
}

export type EmbedControlMessage = {
	channel: typeof CW_EMBED_CHANNEL
	kind: 'pause' | 'play' | 'replay'
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

export function parseEmbedProgress(data: unknown): EmbedProgressMessage | null {
	if (!isRecord(data)) {
		return null
	}
	if (data.channel !== CW_EMBED_CHANNEL || data.kind !== 'progress') {
		return null
	}
	const drawn = data.drawn
	const total = data.total
	const complete = data.complete
	if (typeof drawn !== 'number' || typeof total !== 'number' || typeof complete !== 'boolean') {
		return null
	}
	return { channel: CW_EMBED_CHANNEL, kind: 'progress', drawn, total, complete }
}

export function parseEmbedControl(data: unknown): EmbedControlMessage | null {
	if (!isRecord(data)) {
		return null
	}
	if (data.channel !== CW_EMBED_CHANNEL) {
		return null
	}
	if (data.kind === 'pause' || data.kind === 'play' || data.kind === 'replay') {
		return { channel: CW_EMBED_CHANNEL, kind: data.kind }
	}
	return null
}

/** Sync flag for R3F ticks — React setState alone is too late for useFrame. */
let embedTransportPaused = false

export function setEmbedTransportPaused(paused: boolean): void {
	embedTransportPaused = paused
}

export function isEmbedTransportPaused(): boolean {
	return embedTransportPaused
}

export function postEmbedProgress(drawn: number, total: number, complete: boolean): void {
	if (typeof window === 'undefined' || window.parent === window) {
		return
	}
	const msg: EmbedProgressMessage = {
		channel: CW_EMBED_CHANNEL,
		kind: 'progress',
		drawn,
		total,
		complete,
	}
	window.parent.postMessage(msg, '*')
}

export function postEmbedControl(target: Window, kind: EmbedControlMessage['kind']): void {
	const msg: EmbedControlMessage = { channel: CW_EMBED_CHANNEL, kind }
	target.postMessage(msg, '*')
}
