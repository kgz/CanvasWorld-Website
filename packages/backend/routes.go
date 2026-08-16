package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
)

type CatalogEntry struct {
	Slug        string `json:"slug"`
	Title       string `json:"title"`
	Category    string `json:"category"`
	Description string `json:"description"`
	Thumbnail   string `json:"thumbnail"`
	RenderMode  string `json:"renderMode"`
	Active      bool   `json:"active"`
}

// Route is the API/SSR projection keyed by slug.
type Route struct {
	Description string `json:"description"`
	Title       string `json:"title,omitempty"`
	Category    string `json:"category,omitempty"`
	Thumbnail   string `json:"thumbnail,omitempty"`
	RenderMode  string `json:"renderMode,omitempty"`
	Active      bool   `json:"active"`
}

var (
	catalogOnce sync.Once
	catalogErr  error
	catalogList []CatalogEntry
	routesBySlug map[string]Route
)

func resolveCatalogPath() string {
	if p := os.Getenv("CW_ROUTES_CATALOG"); p != "" {
		return p
	}
	candidates := []string{
		"routes.json",
		"../shared/routes.json",
		"packages/shared/routes.json",
	}
	for _, c := range candidates {
		if _, err := os.Stat(c); err == nil {
			return c
		}
	}
	return "../shared/routes.json"
}

func loadCatalog() {
	catalogOnce.Do(func() {
		path := resolveCatalogPath()
		data, err := os.ReadFile(path)
		if err != nil {
			catalogErr = fmt.Errorf("route catalog %q: %w", path, err)
			return
		}
		var entries []CatalogEntry
		if err := json.Unmarshal(data, &entries); err != nil {
			catalogErr = fmt.Errorf("route catalog %q: %w", path, err)
			return
		}
		catalogList = entries
		routesBySlug = make(map[string]Route, len(entries))
		for _, e := range entries {
			routesBySlug[e.Slug] = Route{
				Description: e.Description,
				Title:       e.Title,
				Category:    e.Category,
				Thumbnail:   e.Thumbnail,
				RenderMode:  e.RenderMode,
				Active:      e.Active,
			}
		}
		log.Printf("loaded route catalog %s (%d entries)", path, len(entries))
	})
}

func getCatalog() []CatalogEntry {
	loadCatalog()
	if catalogErr != nil {
		log.Fatal(catalogErr)
	}
	return catalogList
}

func getRoutes() map[string]Route {
	loadCatalog()
	if catalogErr != nil {
		log.Fatal(catalogErr)
	}
	return routesBySlug
}

func activeSlugs() []string {
	entries := getCatalog()
	out := make([]string, 0, len(entries))
	for _, e := range entries {
		if e.Active {
			out = append(out, e.Slug)
		}
	}
	return out
}
