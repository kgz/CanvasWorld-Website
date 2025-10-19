package main

import (
	"context"
	"fmt"
	"io/ioutil"
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
	// Ensure images directory exists
	if err := os.MkdirAll(imagesDir, 0755); err != nil {
		log.Printf("Failed to create images directory: %v", err)
	}
	
	return &ScreenshotService{
		frontendURL: frontendURL,
		imagesDir:   imagesDir,
	}
}

func (s *ScreenshotService) ScreenshotAttractor(routeName string) error {
	// Check if screenshot already exists
	filename := fmt.Sprintf("%s.png", routeName)
	filepath := filepath.Join(s.imagesDir, filename)
	
	if _, err := os.Stat(filepath); err == nil {
		log.Printf("Screenshot already exists for %s", routeName)
		return nil
	}
	
	// Build URL
	url := fmt.Sprintf("%s/chaos/%s", s.frontendURL, routeName)
	log.Printf("Taking screenshot of %s", url)
	
	// Create Chrome context
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()
	
	// Set timeout
	ctx, cancel = context.WithTimeout(ctx, 30*time.Second)
	defer cancel()
	
	var buf []byte
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.WaitVisible("canvas", chromedp.ByQuery),
		chromedp.Sleep(3*time.Second), // Wait for Three.js to render
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Wait for canvas to be fully rendered
			return chromedp.Run(ctx,
				chromedp.Evaluate(`
					// Wait for canvas to have content
					new Promise((resolve) => {
						const canvas = document.querySelector('canvas');
						if (!canvas) {
							resolve(false);
							return;
						}
						
						const checkCanvas = () => {
							const ctx = canvas.getContext('2d');
							if (ctx) {
								const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
								const hasContent = imageData.data.some(pixel => pixel !== 0);
								if (hasContent) {
									resolve(true);
									return;
								}
							}
							
							// Also check WebGL context
							const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
							if (gl) {
								resolve(true);
								return;
							}
							
							setTimeout(checkCanvas, 100);
						};
						
						checkCanvas();
					});
				`, nil),
			)
		}),
		chromedp.Sleep(2*time.Second), // Additional wait
		chromedp.CaptureScreenshot(&buf),
	)
	
	if err != nil {
		return fmt.Errorf("failed to take screenshot: %v", err)
	}
	
	// Save screenshot
	if err := ioutil.WriteFile(filepath, buf, 0644); err != nil {
		return fmt.Errorf("failed to save screenshot: %v", err)
	}
	
	log.Printf("Screenshot saved: %s", filepath)
	return nil
}

func (s *ScreenshotService) ScreenshotAllAttractors() error {
	routes := getRoutes()
	
	for routeName := range routes {
		if err := s.ScreenshotAttractor(routeName); err != nil {
			log.Printf("Failed to screenshot %s: %v", routeName, err)
			// Continue with other routes
		}
	}
	
	return nil
}

func (s *ScreenshotService) ScreenshotIfNotExists(routeName string) error {
	filename := fmt.Sprintf("%s.png", routeName)
	filepath := filepath.Join(s.imagesDir, filename)
	
	if _, err := os.Stat(filepath); err == nil {
		return nil // File exists
	}
	
	return s.ScreenshotAttractor(routeName)
}
