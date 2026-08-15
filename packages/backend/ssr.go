package main

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func serveSSR(c *fiber.Ctx) error {
	path := c.Path()
	routes := getRoutes()

	// Get route info if it exists
	var route Route
	var exists bool
	if path != "/" && path != "" {
		routeKey := strings.TrimPrefix(path, "/")
		route, exists = routes[routeKey]
	}

	// Default meta tags
	title := "CanvasWorld - Mathematical Attractors"
	description := "Explore beautiful mathematical attractors and chaotic systems through interactive visualizations."
	image := "/chaos/icons/mandelbrot_set.png"

	// Customize meta tags for specific routes
	if exists {
		routeKey := strings.TrimPrefix(path, "/")
		title = fmt.Sprintf("%s - CanvasWorld", strings.ReplaceAll(routeKey, "_", " "))
		description = route.Description
		image = fmt.Sprintf("/chaos/icons/%s.png", routeKey)
	}

	// Generate HTML with meta tags for Discord/social media
	html := fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://canvasworld.dev%s">
    <meta property="og:title" content="%s">
    <meta property="og:description" content="%s">
    <meta property="og:image" content="https://canvasworld.dev%s">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://canvasworld.dev%s">
    <meta property="twitter:title" content="%s">
    <meta property="twitter:description" content="%s">
    <meta property="twitter:image" content="https://canvasworld.dev%s">
    
    <!-- Discord -->
    <meta property="og:site_name" content="CanvasWorld">
    <meta name="theme-color" content="#000000">
    
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            text-align: center;
        }
        h1 { color: #4CAF50; }
        .description { 
            margin: 20px 0; 
            line-height: 1.6; 
            font-size: 16px;
        }
        .loading { 
            margin-top: 40px; 
            font-style: italic; 
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>%s</h1>
        <div class="description">%s</div>
        <div class="loading">Loading interactive visualization...</div>
    </div>
    
    <script>
        // Redirect to the actual SPA after a short delay
        setTimeout(() => {
            window.location.href = window.location.href;
        }, 1000);
    </script>
</body>
</html>`, title, path, title, description, image, path, title, description, image, title, description)

	c.Set("Content-Type", "text/html")
	return c.SendString(html)
}
