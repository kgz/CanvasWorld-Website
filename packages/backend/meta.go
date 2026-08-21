package main

import (
	"html"
	"strings"
)

type pageMeta struct {
	Title       string
	Description string
	Slug        string // empty on home / unknown
	ImagePath   string // path under PUBLIC_BASE, e.g. /icons/lorenz_attractor.png
	PagePath    string // path under PUBLIC_BASE, e.g. / or /lorenz_attractor
	BodyHTML    string // optional crawler-visible article HTML (trusted, from our export)
	AboutHTML   string // optional About / catalog blurb HTML
}

func publicBase() string {
	base := getEnv("PUBLIC_BASE", "")
	if base == "" {
		base = getEnv("PROD_URL", "https://matf.dev/chaos")
	}
	return strings.TrimRight(base, "/")
}

// catalogSlug maps a request path (with or without /chaos) to a routes.json key.
func catalogSlug(requestPath string) string {
	p := strings.Trim(requestPath, "/")
	if p == "" {
		return ""
	}
	if strings.HasPrefix(p, "chaos/") {
		p = strings.TrimPrefix(p, "chaos/")
	} else if p == "chaos" {
		return ""
	}
	return p
}

func resolvePageMeta(requestPath string) pageMeta {
	slug := catalogSlug(requestPath)
	meta := pageMeta{
		Title:       "Classical Chaos",
		Description: "Interactive sketches of classical dynamical systems.",
		ImagePath:   "/icons/mandelbrot_set.png",
		PagePath:    "/",
	}

	if slug == "" {
		return meta
	}

	if slug == "blog" {
		meta.Title = "Lab notebook — Classical Chaos"
		meta.Description = "Notes on attractors, maps, and meshes in the Classical Chaos catalog."
		meta.PagePath = "/blog"
		var list strings.Builder
		list.WriteString("<p>Notes in the Classical Chaos lab notebook:</p><ul>")
		for _, p := range blogPostSlugs() {
			post, ok := getBlogPost(p)
			if !ok {
				continue
			}
			list.WriteString(`<li><a href="`)
			list.WriteString(html.EscapeString(absoluteURL(publicBase(), "/blog/"+post.Slug)))
			list.WriteString(`">`)
			list.WriteString(html.EscapeString(post.Title))
			list.WriteString(`</a></li>`)
		}
		list.WriteString("</ul>")
		meta.BodyHTML = list.String()
		return meta
	}

	if strings.HasPrefix(slug, "blog/") {
		postSlug := strings.TrimPrefix(slug, "blog/")
		canonical := resolveBlogSlug(postSlug)
		meta.PagePath = "/blog/" + canonical
		if post, ok := getBlogPost(canonical); ok {
			meta.Title = post.Title + " — Classical Chaos"
			if post.Excerpt != "" {
				meta.Description = post.Excerpt
			} else {
				meta.Description = "Lab notebook note on Classical Chaos."
			}
			if post.ThumbSlug != "" {
				meta.ImagePath = "/icons/" + post.ThumbSlug + ".png"
			}
			meta.Slug = "blog/" + post.Slug
			meta.BodyHTML = post.BodyHTML
		} else {
			meta.Title = "Lab notebook — Classical Chaos"
			meta.Description = "Notes on attractors, maps, and meshes in the Classical Chaos catalog."
		}
		return meta
	}

	routes := getRoutes()
	route, ok := routes[slug]
	if !ok || !route.Active {
		meta.PagePath = "/" + slug
		return meta
	}

	title := route.Title
	if title == "" {
		title = strings.ReplaceAll(slug, "_", " ")
	}
	meta.Slug = slug
	meta.Title = title + " — Classical Chaos"
	if route.Description != "" {
		meta.Description = route.Description
		meta.AboutHTML = "<p>" + html.EscapeString(route.Description) + "</p>"
	}
	meta.ImagePath = "/icons/" + slug + ".png"
	meta.PagePath = "/" + slug
	return meta
}

func absoluteURL(base, pathUnderBase string) string {
	if pathUnderBase == "" || pathUnderBase == "/" {
		return base + "/"
	}
	if !strings.HasPrefix(pathUnderBase, "/") {
		pathUnderBase = "/" + pathUnderBase
	}
	return base + pathUnderBase
}

func metaTagsHTML(m pageMeta) string {
	base := publicBase()
	canonical := absoluteURL(base, m.PagePath)
	image := absoluteURL(base, m.ImagePath)
	t := html.EscapeString(m.Title)
	d := html.EscapeString(m.Description)
	c := html.EscapeString(canonical)
	img := html.EscapeString(image)
	ogType := "website"
	if strings.HasPrefix(m.PagePath, "/blog/") {
		ogType = "article"
	}

	return strings.Join([]string{
		`<meta name="description" content="` + d + `">`,
		`<link rel="canonical" href="` + c + `">`,
		`<meta property="og:type" content="` + ogType + `">`,
		`<meta property="og:site_name" content="Classical Chaos">`,
		`<meta property="og:url" content="` + c + `">`,
		`<meta property="og:title" content="` + t + `">`,
		`<meta property="og:description" content="` + d + `">`,
		`<meta property="og:image" content="` + img + `">`,
		`<meta name="twitter:card" content="summary_large_image">`,
		`<meta name="twitter:url" content="` + c + `">`,
		`<meta name="twitter:title" content="` + t + `">`,
		`<meta name="twitter:description" content="` + d + `">`,
		`<meta name="twitter:image" content="` + img + `">`,
		`<meta name="theme-color" content="#008f68">`,
	}, "\n    ")
}

func injectIndexMeta(indexHTML string, m pageMeta) string {
	out := indexHTML
	escapedTitle := html.EscapeString(m.Title)
	if strings.Contains(out, "<title>") {
		start := strings.Index(out, "<title>")
		end := strings.Index(out, "</title>")
		if start >= 0 && end > start {
			out = out[:start] + "<title>" + escapedTitle + "</title>" + out[end+len("</title>"):]
		}
	}
	tags := metaTagsHTML(m)
	if i := strings.Index(out, "</head>"); i >= 0 {
		out = out[:i] + "    " + tags + "\n  " + out[i:]
	}
	seo := seoContentHTML(m)
	if seo != "" {
		if i := strings.Index(out, `<div id="root"></div>`); i >= 0 {
			out = out[:i] + seo + "\n    " + out[i:]
		} else if i := strings.Index(out, "</body>"); i >= 0 {
			out = out[:i] + seo + "\n  " + out[i:]
		}
	}
	return out
}

// seoContentHTML is crawler-visible copy in the SPA shell (removed on React hydrate).
func seoContentHTML(m pageMeta) string {
	base := publicBase()
	canonical := absoluteURL(base, m.PagePath)
	image := absoluteURL(base, m.ImagePath)
	t := html.EscapeString(m.Title)
	d := html.EscapeString(m.Description)
	img := html.EscapeString(image)
	can := html.EscapeString(canonical)

	var b strings.Builder
	b.WriteString(`<div id="cw-seo" data-cw-seo="1">`)
	b.WriteString(`<article>`)
	b.WriteString(`<h1>`)
	b.WriteString(t)
	b.WriteString(`</h1>`)
	if m.BodyHTML != "" {
		b.WriteString(`<div class="cw-seo-body">`)
		b.WriteString(m.BodyHTML)
		b.WriteString(`</div>`)
	} else if m.AboutHTML != "" {
		b.WriteString(`<section aria-label="About">`)
		b.WriteString(`<h2>About</h2>`)
		b.WriteString(m.AboutHTML)
		b.WriteString(`</section>`)
	} else if d != "" {
		b.WriteString(`<p>`)
		b.WriteString(d)
		b.WriteString(`</p>`)
	}
	b.WriteString(`<p><img src="`)
	b.WriteString(img)
	b.WriteString(`" alt="`)
	b.WriteString(t)
	b.WriteString(`" width="1200" height="630"></p>`)
	b.WriteString(`<p><a href="`)
	b.WriteString(can)
	b.WriteString(`">Open Classical Chaos page</a></p>`)
	b.WriteString(`</article></div>`)
	return b.String()
}

func sitemapXML() string {
	base := publicBase()
	var b strings.Builder
	b.WriteString(`<?xml version="1.0" encoding="UTF-8"?>` + "\n")
	b.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + "\n")
	writeURL := func(path string) {
		b.WriteString("  <url><loc>")
		b.WriteString(html.EscapeString(absoluteURL(base, path)))
		b.WriteString("</loc></url>\n")
	}
	writeURL("/")
	writeURL("/blog")
	for _, slug := range blogPostSlugs() {
		writeURL("/blog/" + slug)
	}
	for _, slug := range activeSlugs() {
		writeURL("/" + slug)
	}
	b.WriteString("</urlset>\n")
	return b.String()
}

func robotsTxtBody() string {
	return "User-agent: *\nAllow: /\n\nSitemap: " + publicBase() + "/sitemap.xml\n"
}
