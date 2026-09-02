import type { Root, Text } from 'mdast'
import type { MdxJsxTextElement } from 'mdast-util-mdx'
import { visit } from 'unist-util-visit'
import { GLOSSARY_MATCHERS, GLOSSARY_PROTECTED_PHRASES } from './matchers'

type TextParent = {
	type: string
	children: Array<Text | MdxJsxTextElement | { type: string }>
}

const SKIP_PARENT_TYPES = new Set([
	'inlineCode',
	'code',
	'link',
	'linkReference',
	'mdxJsxTextElement',
	'mdxJsxFlowElement',
	'mdxFlowExpression',
	'mdxTextExpression',
])

const PROTECT_TOKEN_PREFIX = '\uE000'
const PROTECT_TOKEN_SUFFIX = '\uE001'

function protectPhrases(value: string): { text: string; phrases: string[] } {
	const phrases: string[] = []
	let text = value
	for (const phrase of GLOSSARY_PROTECTED_PHRASES) {
		let idx = text.indexOf(phrase)
		while (idx !== -1) {
			const token = `${PROTECT_TOKEN_PREFIX}${phrases.length}${PROTECT_TOKEN_SUFFIX}`
			phrases.push(phrase)
			text = text.slice(0, idx) + token + text.slice(idx + phrase.length)
			idx = text.indexOf(phrase)
		}
	}
	return { text, phrases }
}

function restorePhrases(value: string, phrases: string[]): string {
	let text = value
	for (let i = 0; i < phrases.length; i += 1) {
		const token = `${PROTECT_TOKEN_PREFIX}${i}${PROTECT_TOKEN_SUFFIX}`
		text = text.split(token).join(phrases[i])
	}
	return text
}

function createGlossaryNode(slug: string, label: string): MdxJsxTextElement {
	return {
		type: 'mdxJsxTextElement',
		name: 'GlossaryTerm',
		attributes: [{ type: 'mdxJsxAttribute', name: 'term', value: slug }],
		children: [{ type: 'text', value: label }],
	}
}

function splitGlossaryText(value: string): Array<Text | MdxJsxTextElement> {
	const { text: protectedText, phrases } = protectPhrases(value)
	const nodes: Array<Text | MdxJsxTextElement> = []
	let remaining = protectedText

	while (remaining.length > 0) {
		let best: { index: number; length: number; slug: string; label: string } | null = null

		for (const { slug, re } of GLOSSARY_MATCHERS) {
			re.lastIndex = 0
			const match = re.exec(remaining)
			if (!match) continue
			if (best === null || match.index < best.index) {
				best = { index: match.index, length: match[0].length, slug, label: match[0] }
			}
		}

		if (best === null) {
			nodes.push({ type: 'text', value: restorePhrases(remaining, phrases) })
			break
		}

		if (best.index > 0) {
			nodes.push({
				type: 'text',
				value: restorePhrases(remaining.slice(0, best.index), phrases),
			})
		}

		nodes.push(createGlossaryNode(best.slug, restorePhrases(best.label, phrases)))
		remaining = remaining.slice(best.index + best.length)
	}

	return nodes
}

export function remarkGlossaryTerms() {
	return (tree: Root) => {
		visit(tree, 'text', (node, index, parent) => {
			if (index === undefined || !parent) return
			if (SKIP_PARENT_TYPES.has(parent.type)) return
			if (!node.value.trim()) return

			const parts = splitGlossaryText(node.value)
			if (parts.length === 1 && parts[0].type === 'text') return

			const container = parent as TextParent
			container.children.splice(index, 1, ...parts)
		})
	}
}
