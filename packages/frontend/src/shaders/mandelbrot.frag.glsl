uniform vec2 u_center;
uniform float u_zoom;
uniform int u_maxIterations;
uniform vec2 u_resolution;
uniform float u_juliaMode;
uniform vec2 u_juliaC;

varying vec2 vUv;

void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / (u_zoom * max(u_resolution.y, 1.0));
    vec2 z, c;

    if (u_juliaMode > 0.5) {
        z = uv + u_center;
        c = u_juliaC;
    } else {
        z = vec2(0.0);
        c = uv + u_center;
    }

    float iterations = 0.0;
    float magnitude = 0.0;
    int maxIter = u_maxIterations;
    if (maxIter < 1) {
        maxIter = 1;
    }

    for (int i = 0; i < 1000; i++) {
        if (i >= maxIter) break;
        magnitude = dot(z, z);
        if (magnitude > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iterations += 1.0;
    }

    vec3 color;
    if (iterations >= float(maxIter) - 0.5) {
        color = vec3(0.0);
    } else {
        float mag = max(magnitude, 1.0000001);
        float logzn = log(mag) / log(2.0);
        float nu = log(max(logzn, 1.0000001)) / log(2.0);
        float smoothValue = iterations + 1.0 - nu;
        float t = clamp(smoothValue / float(maxIter), 0.0, 1.0);
        color = vec3(t);
    }

    gl_FragColor = vec4(color, 1.0);
}
