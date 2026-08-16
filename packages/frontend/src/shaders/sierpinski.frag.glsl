uniform vec2 u_center;
uniform float u_zoom;
uniform int u_maxDepth;
uniform vec2 u_resolution;

varying vec2 vUv;

const vec2 A = vec2(0.0, 0.75);
const vec2 B = vec2(-0.86602540378, -0.75);
const vec2 C = vec2(0.86602540378, -0.75);

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

void main() {
	float resY = max(u_resolution.y, 1.0);
	vec2 p = (gl_FragCoord.xy - u_resolution * 0.5) / (u_zoom * resY);
	p += u_center;

	vec3 bary = barycentric(p);
	float u = bary.x;
	float v = bary.y;
	float w = bary.z;

	if (u < 0.0 || v < 0.0 || w < 0.0) {
		gl_FragColor = vec4(0.015, 0.015, 0.02, 1.0);
		return;
	}

	float hitDepth = -1.0;
	int maxDepth = u_maxDepth;
	for (int i = 0; i < 64; i++) {
		if (i >= maxDepth) break;

		if (u < 0.5 && v < 0.5 && w < 0.5) {
			hitDepth = float(i);
			break;
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

	vec3 color;
	if (hitDepth < 0.0) {
		color = vec3(0.97, 0.94, 0.88);
	} else {
		// Near-black voids; slight lift by depth so nested holes stay readable while zooming
		float t = hitDepth / max(float(maxDepth), 1.0);
		color = vec3(0.025 + 0.04 * t);
	}

	gl_FragColor = vec4(color, 1.0);
}
