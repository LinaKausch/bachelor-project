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


        // video.setDisplaySize(3840, 2160);
        video.setDisplaySize(100, 100);


        // Auto-next scene
        video.on('complete', () => {
            this.scene.start('Game');
        });
    }
}