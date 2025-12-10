import { Scene } from 'phaser';

export class AnimationOne extends Scene {
    constructor() {
        super('AnimationOne');
    }

    create() {
        const video = this.add.video(
            this.scale.width / 2,
            this.scale.height / 2,
            'part1'
        );

        video.play();


        // video.setDisplaySize(3840, 2160);
        video.setDisplaySize(100, 100);


        // Auto-next scene
        video.on('complete', () => {
            this.scene.start('Potions');
        });
    }
}
