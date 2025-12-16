import { Scene } from 'phaser';

export class AnimationTwo extends Scene {
    constructor() {
        super('AnimationTwo');
    }

    create() {
        const video = this.add.video(
            this.scale.width / 2,
            this.scale.height / 2,
            'part2'
        );
        video.play();

        // video size 3840 x 2160
        const targetHeight = this.scale.height / 8;
        const ratio = video.width / video.height;

        video.setDisplaySize(targetHeight * ratio, targetHeight);
        video.on('complete', () => {
            this.scene.start('Game');
        });
    }
}