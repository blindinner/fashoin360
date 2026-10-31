export const vertexShader = `
  uniform float uBend;
  uniform float uRotate;
  uniform float uRadius;
  uniform vec2 uViewport;

  varying vec2 vUv;
  varying float vColorAmt;

  float easeInOutQuad(float t) {
    return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
  }

  void main() {
    vUv = uv;

    // Get world position
    vec4 worldPos = modelMatrix * vec4(position, 1.0);

    // Distance from horizontal center (camera at x=0)
    float dist = abs(worldPos.x);

    // Calculate bulge z offset
    float z = 0.0;
    if (dist < uRadius) {
      float normalizedDist = dist / uRadius;
      z = (uRadius - easeInOutQuad(normalizedDist) * uRadius) * uBend;
    }

    // Apply Y-axis rotation based on velocity
    float angle = -0.4 * uRotate;
    mat3 rotY = mat3(
      cos(angle), 0.0, sin(angle),
      0.0, 1.0, 0.0,
      -sin(angle), 0.0, cos(angle)
    );

    vec3 rotatedPos = rotY * position;
    vec4 rotatedWorldPos = modelMatrix * vec4(rotatedPos, 1.0);

    // Apply bulge to z
    rotatedWorldPos.z += z;

    // Pass color amount to fragment (how much color to show based on bulge)
    vColorAmt = min(z * 0.005, 0.7);

    gl_Position = projectionMatrix * viewMatrix * rotatedWorldPos;
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uScale;
  uniform float uOffsetY;
  uniform float uLight;
  uniform float uOpacity;
  uniform float uMultiply;
  uniform vec3 uBgColor;

  varying vec2 vUv;
  varying float vColorAmt;

  void main() {
    // Cover-fit UV scaling with optional Y offset for parallax
    vec2 coverUv = (vUv - 0.5) * uScale + 0.5;
    coverUv.y += uOffsetY;

    vec4 texColor = texture2D(uTexture, coverUv);

    // Greyscale version with reduced opacity
    float grey = (texColor.r + texColor.g + texColor.b) / 3.0;
    vec4 greyColor = vec4(vec3(grey), 0.4);

    // Mix between grey and color based on bulge + hover light
    float colorMix = clamp(vColorAmt + uLight, 0.0, 1.0);
    vec4 color = mix(greyColor, texColor, colorMix);

    // Apply multiply tint toward background color
    color.rgb = mix(color.rgb, color.rgb * uBgColor, uMultiply);

    // Apply opacity for intro/outro fades
    color.a *= uOpacity;

    gl_FragColor = color;
  }
`;

export const bgVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const bgFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;
