package main

import (
	"strings"
)

type Route struct {
	Description string `json:"description"`
}

func getRoutes() map[string]Route {
	routes := make(map[string]Route)

	routes["bedhead_attractor"] = Route{
		Description: "The Bedhead Attractor is a chaotic attractor defined by the following equations: x_{n+1} = sin(x \\cdot y/b) \\cdot y + cos(a \\cdot x - y), y_{n+1} = x + sin(y)/b",
	}
	routes["bogdanov_map"] = Route{
		Description: "The Bogdanov Map is a chaotic map defined by the following equations: x_{n+1} = y_n + 1 - a \\cdot x_n^2, y_{n+1} = b \\cdot x_n",
	}
	routes["brusselator"] = Route{
		Description: "The Brusselator is a chaotic map defined by the following equations: x_{n+1} = 1 + x_n + a \\cdot x_n^2 \\cdot y_n - (b + 1) \\cdot x_n, y_{n+1} = b \\cdot x_n - a \\cdot x_n^2 \\cdot y_n",
	}
	routes["clifford_attractor"] = Route{
		Description: "The Clifford Attractor is a chaotic attractor defined by the following equations: x_{n+1} = sin(a \\cdot y_n) + c \\cdot cos(a \\cdot x_n), y_{n+1} = sin(b \\cdot x_n) + d \\cdot cos(b \\cdot y_n)",
	}
	routes["fractal_dream_attractor"] = Route{
		Description: "The Fractal Dream Attractor is a chaotic attractor defined by the following equations: x_{n+1} = sin(y_n \\cdot b) + c \\cdot sin(x_n \\cdot b), y_{n+1} = sin(x_n \\cdot a) + d \\cdot sin(y_n \\cdot a)",
	}
	routes["gumowski-mira_attractor"] = Route{
		Description: "The Gumowski-Mira Attractor is a chaotic attractor defined by the following equations: x_{n+1} = b \\cdot y_n + a \\cdot x_n + x_n \\cdot (x_n^2 + y_n^2), y_{n+1} = -b \\cdot x_n + a \\cdot y_n + y_n \\cdot (x_n^2 + y_n^2)",
	}
	routes["henon_map"] = Route{
		Description: "The Henon Map is a chaotic map defined by the following equations: x_{n+1} = 1 - a \\cdot x_n^2 + y_n, y_{n+1} = b \\cdot x_n",
	}
	routes["hopalong_attractor"] = Route{
		Description: "The Hopalong Attractor is a chaotic attractor defined by the following equations: x_{n+1} = y_n - sign(x_n) \\cdot \\sqrt{|b \\cdot x_n - c|}, y_{n+1} = a - x_n",
	}
	routes["hopalong_attractor_positive"] = Route{
		Description: "The Hopalong Attractor Positive is a chaotic attractor defined by the following equations: x_{n+1} = y_n - sign(x_n) \\cdot \\sqrt{|b \\cdot x_n - c|}, y_{n+1} = a - x_n",
	}
	routes["hopalong_attractor_additive"] = Route{
		Description: "The Hopalong Attractor Additive is a chaotic attractor defined by the following equations: x_{n+1} = y_n - sign(x_n) \\cdot \\sqrt{|b \\cdot x_n - c|}, y_{n+1} = a - x_n",
	}
	routes["hopalong_attractor_sinusoidal"] = Route{
		Description: "The Hopalong Attractor (Sinusoidal) is a chaotic attractor that replaces the square-root term with a sine, blending periodic motion with fractal structure.",
	}
	routes["gingerbread_man"] = Route{
		Description: "WIP",
	}
	routes["ikeda_map"] = Route{
		Description: "The Ikeda Map is a chaotic map defined by the following equations: x_{n+1} = 1 + c \\cdot (x_n \\cdot cos(t) - y_n \\cdot sin(t)), y_{n+1} = c \\cdot (x_n \\cdot sin(t) + y_n \\cdot cos(t))",
	}
	routes["mandelbrot_set"] = Route{
		Description: "The Mandelbrot Set is defined by iterating z_{n+1} = z_n^2 + c for complex c; the set is those c for which the sequence remains bounded.",
	}
	routes["sierpiński_triangle"] = Route{
		Description: "The Sierpiński triangle is a fractal obtained by recursively removing the central triangle from an equilateral triangle (chaos-game / IFS form in the interactive viz).",
	}

	return routes
}

func genPath(path string) string {
	cleanPath := strings.TrimSpace(strings.ReplaceAll(path, " ", ""))
	if !strings.HasPrefix(cleanPath, "/") {
		cleanPath = "/" + cleanPath
	}
	return strings.TrimSuffix(cleanPath, "/")
}
