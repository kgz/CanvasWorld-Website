import { describe, expect, it } from 'vitest'
import {
	buildPostsByVizSlug,
	featuredHomePosts,
	relatedVizSlugs,
	vizSlugsFromMdx,
} from '../../blog/vizSlugIndex'

describe('vizSlugsFromMdx', () => {
	it('collects unique VizEmbed slugs', () => {
		const source = `
<VizEmbed slug="aizawa_attractor" label="Aizawa" animateN />
<VizEmbed slug='lorenz_attractor' />
<VizEmbed slug="aizawa_attractor" />
`
		expect(vizSlugsFromMdx(source)).toEqual(['aizawa_attractor', 'lorenz_attractor'])
	})

	it('reads slugs after other props', () => {
		const source = `<VizEmbed label="Classic" slug="hopalong_attractor" particles={16000} />`
		expect(vizSlugsFromMdx(source)).toEqual(['hopalong_attractor'])
	})
})

describe('relatedVizSlugs', () => {
	it('adds thumbSlug when not already embedded', () => {
		expect(relatedVizSlugs('<p>no embed</p>', 'boy_surface')).toEqual(['boy_surface'])
	})

	it('does not duplicate thumbSlug', () => {
		expect(relatedVizSlugs('<VizEmbed slug="boy_surface" />', 'boy_surface')).toEqual(['boy_surface'])
	})
})

describe('buildPostsByVizSlug', () => {
	const hopalong = {
		slug: 'hopalong-family',
		meta: { thumbSlug: 'hopalong_attractor' },
	}
	const aizawa = {
		slug: 'aizawa-funnel',
		meta: { thumbSlug: 'aizawa_attractor' },
	}

	it('maps each embedded slug to the post', () => {
		const sources = {
			'hopalong-family': `
<VizEmbed slug="hopalong_attractor" />
<VizEmbed slug="hopalong_attractor_positive" />
<VizEmbed slug="hopalong_attractor_additive" />
<VizEmbed slug="hopalong_attractor_sinusoidal" />
`,
			'aizawa-funnel': '<VizEmbed slug="aizawa_attractor" />',
		}
		const map = buildPostsByVizSlug([hopalong, aizawa], sources)
		expect(map.get('hopalong_attractor_positive')).toEqual([hopalong])
		expect(map.get('aizawa_attractor')).toEqual([aizawa])
		expect(map.get('missing_slug')).toBeUndefined()
	})
})

describe('featuredHomePosts', () => {
	it('puts featured first then keeps catalog order', () => {
		const posts = [
			{ slug: 'a', meta: { featured: false } },
			{ slug: 'b', meta: { featured: true } },
			{ slug: 'c', meta: { featured: false } },
			{ slug: 'd', meta: { featured: false } },
		]
		expect(featuredHomePosts(posts, 3).map((p) => p.slug)).toEqual(['b', 'a', 'c'])
	})
})
