uniform vec2 u_center;
uniform float u_zoom;
uniform int u_maxIterations;
uniform vec2 u_resolution;
uniform bool u_juliaMode;
uniform vec2 u_juliaC;
uniform int u_colorScheme;

varying vec2 vUv;

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / (u_zoom * u_resolution.y);
    vec2 z, c;
    
    if (u_juliaMode) {
        z = uv + u_center;
        c = u_juliaC;
    } else {
        z = vec2(0.0);
        c = uv + u_center;
    }
    
    float iterations = 0.0;
    float magnitude = 0.0;
    
    for(int i = 0; i < 1000; i++) {
        if(i >= u_maxIterations) break;
        magnitude = dot(z, z);
        if(magnitude > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iterations += 1.0;
    }
    
    vec3 color;
    if(iterations >= float(u_maxIterations)) {
        color = vec3(0.0);
    } else {
        float smoothValue = iterations - log2(log2(magnitude)) + 4.0;
        float t = smoothValue / float(u_maxIterations);
        
        if(u_colorScheme == 0) {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.67));
        } else if(u_colorScheme == 1) {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.1, 0.2));
        } else if(u_colorScheme == 2) {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(1.0, 1.0, 0.5), vec3(0.8, 0.9, 0.3));
        } else if(u_colorScheme == 3) {
            color = vec3(t);
        } else {
            color = palette(t, vec3(0.5), vec3(0.5), vec3(2.0, 1.0, 0.0), vec3(0.5, 0.2, 0.25));
        }
    }
    
    gl_FragColor = vec4(color, 1.0);
}

