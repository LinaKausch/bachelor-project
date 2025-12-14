import Phaser from 'phaser';

export default class WigglePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game: game,
            renderer: game.renderer,
            fragShader: `
            precision mediump float;

            uniform float time;
            uniform sampler2D uMainSampler;
            varying vec2 outTexCoord;

            void main() {
                vec2 uv = outTexCoord;

                uv.x += sin(uv.y * 50.0 + time * 10.0) * 0.001;

                gl_FragColor = texture2D(uMainSampler, uv);
            }
            `
        });
    }
}
