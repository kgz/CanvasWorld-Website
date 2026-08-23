uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_octaves;
uniform float u_time;

varying vec2 vUv;

vec2 fade2(vec2 t) {
	return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float hash21(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 0.1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
}

vec2 gradDir(float h) {
	float a = h * 6.28318530718;
	return vec2(cos(a), sin(a));
}

float perlin2(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = fade2(f);

	float a = dot(gradDir(hash21(i + vec2(0.0, 0.0))), f - vec2(0.0, 0.0));
	float b = dot(gradDir(hash21(i + vec2(1.0, 0.0))), f - vec2(1.0, 0.0));
	float c = dot(gradDir(hash21(i + vec2(0.0, 1.0))), f - vec2(0.0, 1.0));
	float d = dot(gradDir(hash21(i + vec2(1.0, 1.0))), f - vec2(1.0, 1.0));

	return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm2(vec2 p, float octaves) {
	float n = clamp(floor(octaves + 0.5), 1.0, 6.0);
	float amp = 1.0;
	float freq = 1.0;
	float sum = 0.0;
	float norm = 0.0;
	for (int i = 0; i < 6; i++) {
		if (float(i) >= n) break;
		sum += amp * perlin2(p * freq);
		norm += amp;
		amp *= 0.5;
		freq *= 2.0;
	}
	return norm > 0.0 ? sum / norm : 0.0;
}

vec3 hsl2rgb(float h, float s, float l) {
	float c = (1.0 - abs(2.0 * l - 1.0)) * s;
	float hp = h / 60.0;
	float x = c * (1.0 - abs(mod(hp, 2.0) - 1.0));
	vec3 rgb = vec3(0.0);
	if (hp < 1.0) rgb = vec3(c, x, 0.0);
	else if (hp < 2.0) rgb = vec3(x, c, 0.0);
	else if (hp < 3.0) rgb = vec3(0.0, c, x);
	else if (hp < 4.0) rgb = vec3(0.0, x, c);
	else if (hp < 5.0) rgb = vec3(x, 0.0, c);
	else rgb = vec3(c, 0.0, x);
	float m = l - 0.5 * c;
	return rgb + m;
}

void main() {
	float aspect = u_resolution.x / max(u_resolution.y, 1.0);
	vec2 uv = (vUv - 0.5) * vec2(aspect, 1.0);
	float sc = max(u_scale, 0.5);
	vec2 p = uv * sc + vec2(u_time * 0.15, u_time * 0.09);

	float n = fbm2(p, u_octaves);
	float t = clamp(0.5 + 0.5 * n, 0.0, 1.0);
	float hue = mix(200.0, 360.0, t);
	vec3 col = hsl2rgb(hue, 0.72, 0.48);
	gl_FragColor = vec4(col, 1.0);
}
