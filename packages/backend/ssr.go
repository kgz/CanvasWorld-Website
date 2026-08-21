package main

import (
	"fmt"
	"html"

	"github.com/gofiber/fiber/v2"
)

func serveSSR(c *fiber.Ctx) error {
	m := resolvePageMeta(c.Path())
	base := publicBase()
	canonical := absoluteURL(base, m.PagePath)
	image := absoluteURL(base, m.ImagePath)
	tags := metaTagsHTML(m)

	t := html.EscapeString(m.Title)
	d := html.EscapeString(m.Description)
	img := html.EscapeString(image)
	can := html.EscapeString(canonical)

	body := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%s</title>
    %s
    <style>
        body {
            margin: 0;
            padding: 24px;
            font-family: Georgia, "Times New Roman", serif;
            background: #0a0a0a;
            color: #e8e8e8;
            line-height: 1.5;
        }
        .wrap { max-width: 40rem; margin: 0 auto; }
        h1 { font-size: 1.75rem; font-weight: 600; color: #7dcea0; }
        p { margin: 1rem 0; }
        img { max-width: 100%%; height: auto; margin: 1.25rem 0; border: 1px solid #333; }
        a { color: #7dcea0; }
    </style>
</head>
<body>
    <div class="wrap">
        <h1>%s</h1>
        <p>%s</p>
        <p><img src="%s" alt="%s" width="1200" height="630"></p>
        <p><a href="%s">Open interactive sketch</a></p>
    </div>
</body>
</html>`, t, tags, t, d, img, t, can)

	c.Set("Content-Type", "text/html; charset=utf-8")
	return c.SendString(body)
}
