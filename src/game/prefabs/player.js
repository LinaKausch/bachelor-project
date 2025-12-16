import { GameObjects } from 'phaser';

export default class Player extends GameObjects.Sprite {
    constructor(scene, x = 200, y = 200) {
        super(scene, x, y, 'fly');
        scene.add.existing(this);

        this.anims.play('fly-idle');
        this.setScale(0.16);

        this.floatOffset = 0;
        this.floatTween = scene.tweens.add({
            targets: this,
            floatOffset: 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.speed = 300;
        this.baseY = this.y;

        this.isFalling = false;
        this.isGrounded = false;
        this.vy = 0;
        this.gravity = 1200;
        this.groundY = scene.scale.height - 60;
    }

    setDirection(dir) {
        if (this.isFalling) return;

        const directionMap = {
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 },
            'up-left': { x: -1, y: -1 },
            'up-right': { x: 1, y: -1 },
            'down-left': { x: -1, y: 1 },
            'down-right': { x: 1, y: 1 },
            'none': { x: 0, y: 0 }
        };

        const direction = directionMap[dir] || { x: 0, y: 0 };
        this.joyX = direction.x;
        this.joyY = direction.y;
    }

    update(time, delta) {
        const dt = delta / 1000;

        if (this.isFalling) {
            this.vy += this.gravity * dt;
            this.baseY += this.vy * dt;
            this.y = this.baseY;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.baseY = this.groundY;
                this.isFalling = false;
                this.isGrounded = true;
                this.vy = 0;
            }
        } else if (this.isGrounded) {
            if (this.joyX != null) {
                this.x += this.joyX * (this.speed / 4) * dt;
            }
            this.y = this.groundY;
            this.baseY = this.groundY;
        } else {
            if (this.joyX != null && this.joyY != null) {
                this.x += this.joyX * this.speed * dt;
                this.baseY += this.joyY * this.speed * dt;
            }
            this.y = this.baseY + this.floatOffset;
        }

        const currentAnim = this.anims.currentAnim?.key;
        if (this.joyX === 0 && currentAnim !== 'fly-idle') {
            this.anims.play('fly-idle', true);
        } else if (this.joyX > 0 && currentAnim !== 'fly-right') {
            this.anims.play('fly-right', true);
        } else if (this.joyX < 0 && currentAnim !== 'fly-left') {
            this.anims.play('fly-left', true);
        }

        const padding = 70;
        this.x = Phaser.Math.Clamp(this.x, padding, this.scene.scale.width - padding);
        if (!this.isFalling) {
            this.baseY = Phaser.Math.Clamp(this.baseY, padding, this.scene.scale.height - padding);
        }
    }

    startGravityFall(groundY) {
        if (this.isFalling) return;
        this.isFalling = true;
        this.floatOffset = 0;
        if (this.floatTween) this.floatTween.stop();
        this.vy = 0;
        if (groundY != null) this.groundY = groundY;
    }

}

