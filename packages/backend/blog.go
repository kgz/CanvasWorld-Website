package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
)

type BlogPost struct {
	Slug      string `json:"slug"`
	Title     string `json:"title"`
	Excerpt   string `json:"excerpt"`
	Tag       string `json:"tag"`
	ThumbSlug string `json:"thumbSlug"`
	Order     int    `json:"order"`
	Featured  bool   `json:"featured"`
}

type blogCatalogFile struct {
	Redirects map[string]string `json:"redirects"`
	Posts     []BlogPost        `json:"posts"`
}

var (
	blogOnce      sync.Once
	blogErr       error
	blogBySlug    map[string]BlogPost
	blogRedirects map[string]string
	blogList      []BlogPost
)

func resolveBlogCatalogPath() string {
	if p := os.Getenv("CW_BLOG_CATALOG"); p != "" {
		return p
	}
	candidates := []string{
		"blog-posts.json",
		"../shared/blog-posts.json",
		"packages/shared/blog-posts.json",
	}
	for _, c := range candidates {
		if _, err := os.Stat(c); err == nil {
			return c
		}
	}
	return "../shared/blog-posts.json"
}

func loadBlogCatalog() {
	blogOnce.Do(func() {
		path := resolveBlogCatalogPath()
		data, err := os.ReadFile(path)
		if err != nil {
			blogErr = fmt.Errorf("blog catalog %q: %w", path, err)
			return
		}
		var file blogCatalogFile
		if err := json.Unmarshal(data, &file); err != nil {
			blogErr = fmt.Errorf("blog catalog %q: %w", path, err)
			return
		}
		blogRedirects = file.Redirects
		if blogRedirects == nil {
			blogRedirects = map[string]string{}
		}
		blogList = file.Posts
		blogBySlug = make(map[string]BlogPost, len(file.Posts))
		for _, p := range file.Posts {
			blogBySlug[p.Slug] = p
		}
		log.Printf("loaded blog catalog %s (%d posts)", path, len(file.Posts))
	})
}

func resolveBlogSlug(slug string) string {
	loadBlogCatalog()
	if blogErr != nil {
		return slug
	}
	if dest, ok := blogRedirects[slug]; ok {
		return dest
	}
	return slug
}

func getBlogPost(slug string) (BlogPost, bool) {
	loadBlogCatalog()
	if blogErr != nil {
		log.Printf("blog catalog: %v", blogErr)
		return BlogPost{}, false
	}
	p, ok := blogBySlug[resolveBlogSlug(slug)]
	return p, ok
}

func blogPostSlugs() []string {
	loadBlogCatalog()
	if blogErr != nil {
		return nil
	}
	out := make([]string, 0, len(blogList))
	for _, p := range blogList {
		out = append(out, p.Slug)
	}
	return out
}
