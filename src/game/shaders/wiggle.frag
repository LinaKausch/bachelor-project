precision mediump float;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;

    // simple horizontal wave
    uv.y += sin(uv.x * 20.0) * 0.02;

    gl_FragColor = texture2D(uMainSampler, uv);
}
