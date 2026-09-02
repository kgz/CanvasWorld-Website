package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/html/v2"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Config struct {
	Port   string
	DBHost string
	DBPort string
	DBUser string
	DBPass string
	DBName string
	Env    string
}

var config Config
var db *gorm.DB
var screenshotService *ScreenshotService

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	config = Config{
		Port:   getEnv("PORT", "8080"),
		DBHost: getEnv("DB_HOST", "localhost"),
		DBPort: getEnv("DB_PORT", "3306"),
		DBUser: getEnv("DB_USER", "root"),
		DBPass: getEnv("DB_PASS", "password"),
		DBName: getEnv("DB_NAME", "canvasworld"),
		Env:    getEnv("ENV", "development"),
	}

	// Initialize database
	initDB()

	// Initialize screenshot service
	frontendURL := getEnv("FRONTEND_URL", "http://localhost:5173/chaos")
	imagesDir := getEnv("IMAGES_DIR", "static/images")
	screenshotService = NewScreenshotService(frontendURL, imagesDir)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func initDB() {
	dsn := config.DBUser + ":" + config.DBPass + "@tcp(" + config.DBHost + ":" + config.DBPort + ")/" + config.DBName + "?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		// Continue without database in development
	} else {
		log.Println("Database connected successfully")
	}
}

func isBot(userAgent string) bool {
	// Preview fetchers + major search crawlers (content SSR, not a loading stub).
	bots := []string{
		"discordbot",
		"twitterbot",
		"facebookexternalhit",
		"linkedinbot",
		"slackbot",
		"telegrambot",
		"whatsapp",
		"skypeuripreview",
		"redditbot",
		"embedly",
		"pinterest",
		"googlebot",
		"bingbot",
		"duckduckbot",
		"slurp",
		"applebot",
		"yandexbot",
	}

	userAgent = strings.ToLower(userAgent)
	for _, keyword := range bots {
		if strings.Contains(userAgent, keyword) {
			return true
		}
	}
	return false
}

func main() {
	prod := config.Env == "production"
	distDir := getEnv("DIST_DIR", "")
	if distDir == "" {
		if prod {
			distDir = "dist"
		} else {
			distDir = "../frontend/dist"
		}
	}
	imagesDir := getEnv("IMAGES_DIR", "static/images")

	templateDir := "templates"
	engine := html.New(templateDir, ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173,https://localhost:5173,https://matf.dev",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	// Icons: keep /chaos/icons for absolute URLs; /icons after Traefik strip_prefix=/chaos
	cacheIcons := func(c *fiber.Ctx) error {
		c.Set("Cache-Control", "public, max-age=604800")
		return c.Next()
	}
	iconFS := filesystem.New(filesystem.Config{
		Root:   http.Dir(imagesDir),
		Browse: false,
	})
	app.Use("/chaos/icons", cacheIcons, iconFS)
	app.Use("/icons", cacheIcons, iconFS)

	app.Use("/static", func(c *fiber.Ctx) error {
		c.Set("Cache-Control", "public, max-age=604800")
		return c.Next()
	}, filesystem.New(filesystem.Config{
		Root:   http.Dir(distDir),
		Browse: false,
	}))
	// Vite hashed filenames — long cache safe
	app.Use("/assets", func(c *fiber.Ctx) error {
		c.Set("Cache-Control", "public, max-age=31536000, immutable")
		return c.Next()
	}, filesystem.New(filesystem.Config{
		Root:   http.Dir(distDir + "/assets"),
		Browse: false,
	}))
	// filesystem mount on /favicon.ico served index.html (empty path). SendFile instead.
	app.Get("/favicon.ico", func(c *fiber.Ctx) error {
		c.Set("Cache-Control", "public, max-age=604800")
		return c.SendFile(filepath.Join(distDir, "favicon.ico"))
	})
	app.Get("/manifest.json", func(c *fiber.Ctx) error {
		c.Set("Cache-Control", "public, max-age=86400")
		return c.SendFile(filepath.Join(distDir, "manifest.json"))
	})

	app.Get("/robots.txt", func(c *fiber.Ctx) error {
		c.Set("Content-Type", "text/plain; charset=utf-8")
		return c.SendString(robotsTxtBody())
	})
	app.Get("/llms.txt", func(c *fiber.Ctx) error {
		c.Set("Content-Type", "text/plain; charset=utf-8")
		return c.SendString(llmsTxtBody())
	})
	app.Get("/sitemap.xml", func(c *fiber.Ctx) error {
		c.Set("Content-Type", "application/xml; charset=utf-8")
		return c.SendString(sitemapXML())
	})

	api := app.Group("/api")
	api.Get("/version", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"version": "0.0.1"})
	})
	api.Get("/routes", func(c *fiber.Ctx) error {
		return c.JSON(getRoutes())
	})
	api.Post("/screenshot/:route", func(c *fiber.Ctx) error {
		route := c.Params("route")
		if err := screenshotService.ScreenshotAttractor(route); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"message": "Screenshot taken", "route": route})
	})
	api.Post("/screenshot-all", func(c *fiber.Ctx) error {
		if err := screenshotService.ScreenshotAllAttractors(); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"message": "All screenshots taken"})
	})

	app.Use(func(c *fiber.Ctx) error {
		if isBot(c.Get("User-Agent")) {
			return serveSSR(c)
		}
		return c.Next()
	})

	app.Get("*", func(c *fiber.Ctx) error {
		m := resolvePageMeta(c.Path())

		if prod {
			raw, err := os.ReadFile(distDir + "/index.html")
			if err != nil {
				return c.Status(500).SendString("index.html missing")
			}
			c.Set("Content-Type", "text/html; charset=utf-8")
			return c.SendString(injectIndexMeta(string(raw), m))
		}

		return c.Render("index", fiber.Map{
			"Title":       m.Title,
			"Description": m.Description,
			"Image":       absoluteURL(publicBase(), m.ImagePath),
			"Path":        m.PagePath,
			"Canonical":   absoluteURL(publicBase(), m.PagePath),
			"PublicBase":  publicBase(),
			"IsDev":       true,
		})
	})

	log.Printf("Server starting on port %s (env=%s dist=%s)", config.Port, config.Env, distDir)
	log.Fatal(app.Listen(":" + config.Port))
}
