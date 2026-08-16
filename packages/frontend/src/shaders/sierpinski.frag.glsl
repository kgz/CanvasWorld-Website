uniform vec2 u_center;
uniform float u_zoom;
uniform int u_maxDepth;
uniform vec2 u_resolution;

varying vec2 vUv;

const vec2 A = vec2(0.0, 0.75);
const vec2 B = vec2(-0.86602540378, -0.75);
const vec2 C = vec2(0.86602540378, -0.75);
const vec3 FILL = vec3(0.91, 0.93, 0.96);
const vec3 VOID_COL = vec3(0.02, 0.027, 0.039);

vec3 barycentric(vec2 p) {
	vec2 v0 = B - A;
	vec2 v1 = C - A;
	vec2 v2 = p - A;
	float d00 = dot(v0, v0);
	float d01 = dot(v0, v1);
	float d11 = dot(v1, v1);
	float d20 = dot(v2, v0);
	float d21 = dot(v2, v1);
	float denom = d00 * d11 - d01 * d01;
	float v = (d11 * d20 - d01 * d21) / denom;
	float w = (d00 * d21 - d01 * d20) / denom;
	float u = 1.0 - v - w;
	return vec3(u, v, w);
}

// 1 = on finite gasket, 0 = hole or outside
float gasketSample(vec2 p, int maxDepth) {
	vec3 bary = barycentric(p);
	float u = bary.x;
	float v = bary.y;
	float w = bary.z;

	if (u < 0.0 || v < 0.0 || w < 0.0) {
		return 0.0;
	}

	for (int i = 0; i < 64; i++) {
		if (i >= maxDepth) break;

		if (u < 0.5 && v < 0.5 && w < 0.5) {
			return 0.0;
		}

		if (u >= 0.5) {
			u = 2.0 * u - 1.0;
			v = 2.0 * v;
			w = 2.0 * w;
		} else if (v >= 0.5) {
			v = 2.0 * v - 1.0;
			u = 2.0 * u;
			w = 2.0 * w;
		} else {
			w = 2.0 * w - 1.0;
			u = 2.0 * u;
			v = 2.0 * v;
		}
	}

	return 1.0;
}

void main() {
	float resY = max(u_resolution.y, 1.0);
	float pixel = 1.0 / max(u_zoom * resY, 1.0);

	// Don't recurse finer than ~1px — deeper than that just sparkles (aliasing).
	float useful = log2(max(1.5 / pixel, 1.0)) + 0.75;
	int depth = u_maxDepth;
	if (depth > int(useful)) {
		depth = int(useful);
	}
	if (depth < 1) {
		depth = 1;
	}

	vec2 p = (gl_FragCoord.xy - u_resolution * 0.5) / (u_zoom * resY);
	p += u_center;

	// 4-tap AA so edges stay solid instead of flickering into sparse points
	vec2 o = vec2(pixel * 0.35);
	float m =
		0.25 * gasketSample(p, depth) +
		0.25 * gasketSample(p + vec2(o.x, o.y), depth) +
		0.25 * gasketSample(p + vec2(-o.x, o.y), depth) +
		0.25 * gasketSample(p + vec2(0.0, -o.y), depth);

	vec3 color = mix(VOID_COL, FILL, clamp(m, 0.0, 1.0));
	gl_FragColor = vec4(color, 1.0);
}
