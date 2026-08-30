package main

import (
	"strings"
	"testing"
)

func TestCatalogSlug(t *testing.T) {
	cases := map[string]string{
		"/":                         "",
		"/clifford_attractor":       "clifford_attractor",
		"/chaos/clifford_attractor": "clifford_attractor",
		"/chaos":                    "",
		"/blog":                     "blog",
		"/blog/lorenz-never-closes": "blog/lorenz-never-closes",
	}
	for path, want := range cases {
		if got := catalogSlug(path); got != want {
			t.Fatalf("catalogSlug(%q)=%q want %q", path, got, want)
		}
	}
}

func TestPublicBaseDefault(t *testing.T) {
	t.Setenv("PUBLIC_BASE", "")
	t.Setenv("PROD_URL", "")
	if got := publicBase(); got != "https://matf.dev/chaos" {
		t.Fatalf("publicBase=%q", got)
	}
}

func TestIsBotNarrow(t *testing.T) {
	if !isBot("Mozilla/5.0 (compatible; Discordbot/2.0)") {
		t.Fatal("discord should match")
	}
	if !isBot("Mozilla/5.0 (compatible; Googlebot/2.1)") {
		t.Fatal("googlebot should get content SSR")
	}
	if isBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0") {
		t.Fatal("desktop chrome must not match")
	}
}

func TestVizSeoImageAlt(t *testing.T) {
	t.Setenv("PUBLIC_BASE", "https://matf.dev/chaos")
	m := resolvePageMeta("/lorenz_attractor")
	html := seoContentHTML(m)
	if !strings.Contains(html, "/icons/lorenz_attractor.png") {
		t.Fatalf("expected lorenz thumb in seo html")
	}
	alt := imageAlt(m)
	if !strings.Contains(alt, "Lorenz") {
		t.Fatalf("alt=%q", alt)
	}
	if strings.HasSuffix(alt, ".png") {
		t.Fatalf("alt should not be a filename: %q", alt)
	}
	if !strings.Contains(html, alt) {
		t.Fatalf("seo html missing alt %q", alt)
	}
}

func TestBlogPageMeta(t *testing.T) {
	t.Setenv("CW_BLOG_CATALOG", "../shared/blog-posts.json")
	t.Setenv("PUBLIC_BASE", "https://matf.dev/chaos")
	m := resolvePageMeta("/blog/lorenz-never-closes")
	if !strings.Contains(m.Title, "Lorenz") {
		t.Fatalf("title=%q", m.Title)
	}
	if m.PagePath != "/blog/lorenz-never-closes" {
		t.Fatalf("path=%q", m.PagePath)
	}
	if m.ImagePath != "/icons/lorenz_attractor.png" {
		t.Fatalf("image=%q", m.ImagePath)
	}
	if m.Description == "" || strings.HasPrefix(m.Description, "Notes on attractors") {
		t.Fatalf("expected post excerpt, got %q", m.Description)
	}
}
