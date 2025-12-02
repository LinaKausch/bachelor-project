
import { GameObjects } from 'phaser';

export default class Player extends GameObjects.Sprite {

    constructor(scene, x = 200, y = 200) {
        super(scene, x, y, 'fly');
        scene.add.existing(this);

        this.anims.play('fly-idle');

        this.setScale(0.16);

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
        this.speed = 300;
        this.baseY = this.y
    }

    setDirection(dir) {
        this.joyX = 0;
        this.joyY = 0;

        switch (dir) {
            case "up": this.joyY = -1; break;
            case "down": this.joyY = 1; break;
            case "left": this.joyX = -1; break;
            case "right": this.joyX = 1; break;
            case "up-left": this.joyX = -1; this.joyY = -1; break;
            case "up-right": this.joyX = 1; this.joyY = -1; break;
            case "down-left": this.joyX = -1; this.joyY = 1; break;
            case "down-right": this.joyX = 1; this.joyY = 1; break;
            default: break;
        }
    }


    update(time, delta) {
        const dt = delta / 1000;

        if (this.joyX != null && this.joyY != null) {
            this.x += this.joyX * this.speed * dt;
            this.baseY += this.joyY * this.speed * dt;
        }

        this.y = this.baseY + this.floatOffset;

        if (this.joyX === 0) {
            if (this.anims.currentAnim?.key !== 'fly-idle') {
                this.anims.play('fly-idle', true);
            }
        } else if (this.joyX > 0) {
            if (this.anims.currentAnim?.key !== 'fly-right') {
                this.anims.play('fly-right', true);
            }
        } else if (this.joyX < 0) {
            if (this.anims.currentAnim?.key !== 'fly-left') {
                this.anims.play('fly-left', true);
            }
        }

        const padding = 70;
        this.x = Phaser.Math.Clamp(this.x, padding, this.scene.scale.width - padding);
        this.baseY = Phaser.Math.Clamp(this.baseY, padding, this.scene.scale.height - padding);

    }
}

