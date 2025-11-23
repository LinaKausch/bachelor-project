import Phaser from 'phaser';

export default class Wand extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);

        scene.add.existing(this);

        this.radius = 20;

        this.lineStyle(3, 0xff0000);
        this.strokeCircle(0, 0, this.radius);
    }

    update(pointer) {
        this.x = pointer.worldX;
        this.y = pointer.worldY;
    }
}
