package main

import (
	"log"
	"net/http"
	"os"
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
	Port     string
	DBHost   string
	DBPort   string
	DBUser   string
	DBPass   string
	DBName   string
	Env      string
}

var config Config
var db *gorm.DB

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
	botKeywords := []string{
		"discordbot", "twitterbot", "facebookexternalhit", "linkedinbot",
		"slackbot", "telegrambot", "whatsapp", "skypeuripreview",
		"bot", "crawler", "spider", "scraper",
	}
	
	userAgent = strings.ToLower(userAgent)
	for _, keyword := range botKeywords {
		if strings.Contains(userAgent, keyword) {
			return true
		}
	}
	return false
}

func main() {
	// Initialize Fiber with HTML template engine
	engine := html.New("../frontend/dist", ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173,https://localhost:5173",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	// Serve static files from frontend dist
	app.Use("/static", filesystem.New(filesystem.Config{
		Root:   http.Dir("../frontend/dist"),
		Browse: false,
	}))

	// API routes
	api := app.Group("/api")
	api.Get("/version", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"version": "0.0.1"})
	})
	api.Get("/routes", func(c *fiber.Ctx) error {
		return c.JSON(getRoutes())
	})

	// Bot detection middleware for SSR
	app.Use(func(c *fiber.Ctx) error {
		userAgent := c.Get("User-Agent")
		
		if isBot(userAgent) {
			// Serve SSR HTML with meta tags for bots
			return serveSSR(c)
		}
		
		// For regular users, serve the SPA
		return c.Next()
	})

	// Catch-all route for SPA
	app.Get("*", func(c *fiber.Ctx) error {
		return c.Render("index", fiber.Map{})
	})

	log.Printf("Server starting on port %s", config.Port)
	log.Fatal(app.Listen(":" + config.Port))
}
