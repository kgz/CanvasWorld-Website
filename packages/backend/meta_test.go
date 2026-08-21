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
	if isBot("Mozilla/5.0 (compatible; Googlebot/2.1)") {
		t.Fatal("googlebot must not match social SSR")
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
