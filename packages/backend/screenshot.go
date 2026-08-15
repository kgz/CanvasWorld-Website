package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/chromedp/chromedp"
)

type ScreenshotService struct {
	frontendURL string
	imagesDir   string
}

func NewScreenshotService(frontendURL, imagesDir string) *ScreenshotService {
	if err := os.MkdirAll(imagesDir, 0755); err != nil {
		log.Printf("Failed to create images directory: %v", err)
	}

	return &ScreenshotService{
		frontendURL: frontendURL,
		imagesDir:   imagesDir,
	}
}

func (s *ScreenshotService) ScreenshotAttractor(routeName string) error {
	filename := fmt.Sprintf("%s.png", routeName)
	outPath := filepath.Join(s.imagesDir, filename)

	// SPA routes are /{slug}. screenshot=true hides chrome and sets window.__CW_READY__.
	url := fmt.Sprintf("%s/%s?screenshot=true", s.frontendURL, routeName)
	log.Printf("Taking screenshot of %s", url)

	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	ctx, cancel = context.WithTimeout(ctx, 45*time.Second)
	defer cancel()

	var buf []byte
	err := chromedp.Run(ctx,
		chromedp.EmulateViewport(1280, 720),
		chromedp.Navigate(url),
		chromedp.WaitVisible(`#cw-viz-canvas`, chromedp.ByID),
		chromedp.ActionFunc(func(ctx context.Context) error {
			deadline := time.Now().Add(30 * time.Second)
			for time.Now().Before(deadline) {
				var ready bool
				if err := chromedp.Evaluate(`window.__CW_READY__ === true`, &ready).Do(ctx); err != nil {
					return err
				}
				if ready {
					return nil
				}
				time.Sleep(100 * time.Millisecond)
			}
			return fmt.Errorf("timeout waiting for window.__CW_READY__")
		}),
		chromedp.Sleep(200*time.Millisecond),
		chromedp.Screenshot(`#cw-viz-canvas`, &buf, chromedp.NodeVisible, chromedp.ByID),
	)
	if err != nil {
		return fmt.Errorf("failed to take screenshot: %w", err)
	}

	if err := os.WriteFile(outPath, buf, 0644); err != nil {
		return fmt.Errorf("failed to save screenshot: %w", err)
	}

	log.Printf("Screenshot saved: %s (%d bytes)", outPath, len(buf))
	return nil
}

func (s *ScreenshotService) ScreenshotAllAttractors() error {
	routes := getRoutes()

	for routeName := range routes {
		// Skip BE-only stubs that are not active FE pages
		if routeName == "brusselator" {
			continue
		}
		if err := s.ScreenshotAttractor(routeName); err != nil {
			log.Printf("Failed to screenshot %s: %v", routeName, err)
		}
	}

	return nil
}

func (s *ScreenshotService) ScreenshotIfNotExists(routeName string) error {
	filename := fmt.Sprintf("%s.png", routeName)
	outPath := filepath.Join(s.imagesDir, filename)

	if _, err := os.Stat(outPath); err == nil {
		return nil
	}

	return s.ScreenshotAttractor(routeName)
}
