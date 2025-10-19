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
							// Check WebGL context (Three.js uses WebGL)
							const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
							if (gl) {
								// Check if canvas has been drawn to
								const pixels = new Uint8Array(4);
								gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
								// If any pixel is not black (0,0,0,0), canvas has content
								const hasContent = pixels.some(pixel => pixel !== 0);
								if (hasContent) {
									resolve(true);
									return;
								}
							}
							
							setTimeout(checkCanvas, 100);
						};
						
						checkCanvas();
					});
				`, nil),
			)
		}),
		chromedp.Sleep(2*time.Second), // Additional wait
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Hide .stats canvas elements and other non-Three.js canvases before screenshot
			return chromedp.Run(ctx,
				chromedp.Evaluate(`
					// Hide all canvas elements in .stats containers
					const statsCanvases = document.querySelectorAll('.stats canvas');
					statsCanvases.forEach(canvas => {
						canvas.style.display = 'none';
					});
					
					// Hide any canvas elements that are not the main Three.js canvas
					const allCanvases = document.querySelectorAll('canvas');
					let mainCanvas = null;
					
					// Find the main Three.js canvas (usually the largest one)
					allCanvases.forEach(canvas => {
						if (canvas.hasAttribute('data-engine') && canvas.getAttribute('data-engine').includes('three.js')) {
							mainCanvas = canvas;
						}
					});
					
					// If no Three.js canvas found, use the largest canvas
					if (!mainCanvas && allCanvases.length > 0) {
						mainCanvas = Array.from(allCanvases).reduce((largest, current) => {
							return (current.width * current.height) > (largest.width * largest.height) ? current : largest;
						});
					}
					
					// Hide all other canvases
					allCanvases.forEach(canvas => {
						if (canvas !== mainCanvas) {
							canvas.style.display = 'none';
						}
					});
				`, nil),
			)
		}),
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
