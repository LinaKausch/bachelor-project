import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        this.load.setPath('assets');
        this.load.spritesheet('fly', 'sprites/creature-ss.png', {
            frameWidth: 840,
            frameHeight: 1008
        });

        this.load.image('spark', 'items/spark.png');
        this.load.image('spark-y', 'items/spark-y.png');
        this.load.image('glow', 'items/potions-glow.png');
        this.load.image('grow', 'items/potions-grow.png');
        this.load.image('colour', 'items/potions-colour.png');
        this.load.image('trace', 'items/potions-trace.png');
        this.load.image('wand', 'items/wand.png');
        this.load.image('wand-lines', 'items/wand-lines.png');
        this.load.image('front-3p', 'items/players3-front.png');
        this.load.image('back-3p', 'items/players3-background.png');
        this.load.image('front-2p', 'items/players2-front.png');
        this.load.image('back-2p', 'items/players2-background.png');

        this.load.video('part1', 'video/part1.mp4', 'loadeddata');
        this.load.video('part2', 'video/part2.mp4', 'loadeddata');
        this.load.video('idle', 'video/idle.mp4', 'loadeddata');
        this.load.video('potion-demo', 'video/potion-demo.mp4', 'loadeddata');

        this.load.glsl('wiggle', '/src/game/shaders/wiggle.frag');
    }

    create() {

        this.scene.start('Players');
    }
}
