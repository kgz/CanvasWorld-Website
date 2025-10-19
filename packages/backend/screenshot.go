package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
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

	// Create Chrome context with shorter timeout
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// Set timeout - shorter timeout to fail fast
	ctx, cancel = context.WithTimeout(ctx, 20*time.Second)
	defer cancel()

	var buf []byte
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.WaitVisible("canvas", chromedp.ByQuery),
		chromedp.Sleep(3*time.Second), // Wait for Three.js to render
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Hide ALL Material-UI components and UI elements
			return chromedp.Run(ctx,
				chromedp.Evaluate(`
					// Hide ALL Material-UI components
					const muiElements = document.querySelectorAll('[class*="Mui"]');
					muiElements.forEach(el => {
						el.style.display = 'none';
					});
					
					// Hide any element that might be a sidebar/drawer
					const sidebarSelectors = [
						'[class*="sidebar"]',
						'[class*="menu"]', 
						'[class*="drawer"]',
						'[class*="nav"]',
						'[class*="panel"]',
						'[class*="control"]'
					];
					
					sidebarSelectors.forEach(selector => {
						const elements = document.querySelectorAll(selector);
						elements.forEach(el => {
							el.style.display = 'none';
							el.style.visibility = 'hidden';
							el.style.opacity = '0';
						});
					});
					
					// Hide all .stats elements
					const statsElements = document.querySelectorAll('.stats');
					statsElements.forEach(el => {
						el.style.display = 'none';
					});
					
					// Hide any canvas elements that are not the main Three.js canvas
					const allCanvases = document.querySelectorAll('canvas');
					if (allCanvases.length > 1) {
						// Find the main Three.js canvas by data-engine attribute
						let mainCanvas = null;
						allCanvases.forEach(canvas => {
							if (canvas.hasAttribute('data-engine') && canvas.getAttribute('data-engine').includes('three.js')) {
								mainCanvas = canvas;
							}
						});
						
						// If no Three.js canvas found, use the largest canvas
						if (!mainCanvas) {
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
					}
					
					// Hide ALL interactive UI elements
					const uiElements = document.querySelectorAll('button, input, select, .gui, .controls, .menu, .sidebar, nav, header, aside');
					uiElements.forEach(el => {
						el.style.display = 'none';
						el.style.visibility = 'hidden';
						el.style.opacity = '0';
					});
				`, nil),
			)
		}),
		chromedp.Sleep(1*time.Second), // Short wait after hiding elements
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Add ID to canvas for targeting
			return chromedp.Run(ctx,
				chromedp.Evaluate(`
					const canvas = document.querySelector('canvas');
					if (canvas) {
						canvas.id = 'fractal-canvas';
					}
				`, nil),
			)
		}),
		chromedp.ActionFunc(func(ctx context.Context) error {
			// Capture screenshot of only the canvas element
			return chromedp.Run(ctx,
				chromedp.CaptureScreenshot(&buf),
			)
		}),
	)

	if err != nil {
		return fmt.Errorf("failed to take screenshot: %v", err)
	}

	// Crop the image using ImageMagick to remove black borders
	log.Printf("Original image size: %d bytes", len(buf))
	croppedBuf, err := cropWithImageMagick(buf)
	if err != nil {
		log.Printf("Failed to crop image with ImageMagick, using original: %v", err)
		croppedBuf = buf
	} else {
		log.Printf("Cropped image size: %d bytes", len(croppedBuf))
	}

	// Save screenshot
	if err := ioutil.WriteFile(filepath, croppedBuf, 0644); err != nil {
		return fmt.Errorf("failed to save screenshot: %v", err)
	}

	log.Printf("Screenshot saved: %s", filepath)
	return nil
}

// cropWithImageMagick uses ImageMagick to crop black borders from the image
func cropWithImageMagick(imageData []byte) ([]byte, error) {
	// Create temporary files for input and output
	inputFile, err := ioutil.TempFile("", "screenshot_input_*.png")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp input file: %v", err)
	}
	defer os.Remove(inputFile.Name())
	defer inputFile.Close()

	outputFile, err := ioutil.TempFile("", "screenshot_output_*.png")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp output file: %v", err)
	}
	defer os.Remove(outputFile.Name())
	defer outputFile.Close()

	// Write image data to input file
	if _, err := inputFile.Write(imageData); err != nil {
		return nil, fmt.Errorf("failed to write to temp input file: %v", err)
	}
	inputFile.Close()
	outputFile.Close()

	// Run ImageMagick convert command to trim black borders
	cmd := exec.Command("convert", inputFile.Name(), "-trim", outputFile.Name())
	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("ImageMagick convert failed: %v", err)
	}

	// Read the cropped image
	croppedData, err := ioutil.ReadFile(outputFile.Name())
	if err != nil {
		return nil, fmt.Errorf("failed to read cropped image: %v", err)
	}

	return croppedData, nil
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
