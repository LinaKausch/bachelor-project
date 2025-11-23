
import { GameObjects } from 'phaser';

export default class Player extends GameObjects.Sprite {

    constructor(scene) {
        super(scene, 112, 184, 'npc');
        scene.add.existing(this);

        this.setScale(0.05);

        this.floatOffset = 0;
        scene.tweens.add({
            targets: this,
            floatOffset: 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.speed = 200;
        this.baseY = this.y

    }
    update(time, delta) {
        const dt = delta / 1000;

        if (this.cursors.left.isDown) this.x -= this.speed * dt;
        if (this.cursors.right.isDown) this.x += this.speed * dt;
        if (this.cursors.up.isDown) this.baseY -= this.speed * dt;    // <-- update baseY
        if (this.cursors.down.isDown) this.baseY += this.speed * dt;
        this.y = this.baseY + this.floatOffset;
        // this.x = Phaser.Math.Wrap(this.x, 0, this.scene.sys.game.config.width);
        // this.y = Phaser.Math.Wrap(this.y, 0, this.scene.sys.game.config.height);
    }

}

