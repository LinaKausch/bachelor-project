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
        video.setMute(false).play();
        const targetHeight = this.scale.height / 8;
        const ratio = video.width / video.height;
        video.setDisplaySize(targetHeight * ratio, targetHeight);
        video.on('complete', () => {
            this.scene.start('Potions');
        });
    }
}
