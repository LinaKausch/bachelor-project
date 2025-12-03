import { GameObjects } from 'phaser';

export default class Npc extends GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'fly');
        scene.add.existing(this);

        this.anims.play('fly-idle');

        this.setScale(0.16);

        this.target = new Phaser.Math.Vector2(
            Phaser.Math.Between(80, scene.scale.width - 80),
            Phaser.Math.Between(80, scene.scale.height - 80)
        );

        this.velocity = new Phaser.Math.Vector2(
            Phaser.Math.Between(-150, 150),
            Phaser.Math.Between(-150, 150)
        );

        this.wanderDelay = Phaser.Math.FloatBetween(0.5, 2);
        this.wanderTimer = Phaser.Math.FloatBetween(0, this.wanderDelay);


        this.floatPhase = Phaser.Math.FloatBetween(0, Math.PI * 2);
        this.floatSpeed = Phaser.Math.FloatBetween(2, 3);
        this.floatAmplitude = Phaser.Math.FloatBetween(5, 15);
        this.baseY = this.y;
        this.rest = false;
        this.testTimer = 0;
        this.restDuration = Phaser.Math.FloatBetween(0.5, 2);
    }

    update(dt, screenWidth, screenHeight) {
        const padding = 80;

        if (this.rest) {
            this.restTimer -= dt;

            this.floatPhase += this.floatSpeed * dt;
            this.y = this.baseY + Math.sin(this.floatPhase) * this.floatAmplitude;

            if (this.anims.currentAnim?.key !== 'fly-idle') {
                this.anims.play('fly-idle', true);
            }

            if (this.restTimer <= 0) {
                this.rest = false;
            }

            return;
        }

        this.wanderTimer -= dt;
        if (this.wanderTimer <= 0) {
            this.velocity.rotate(Phaser.Math.FloatBetween(-Math.PI / 6, Math.PI / 6));
            this.wanderTimer = this.wanderDelay;
        }

        const toTarget = new Phaser.Math.Vector2(
            this.target.x - this.x,
            this.target.y - this.y
        )

        if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 40) {
            // this.justPickedTarget = true;
            this.target.set(
                Phaser.Math.Between(padding, screenWidth - padding),
                Phaser.Math.Between(padding, screenHeight - padding)
            );
        }

        if (Phaser.Math.FloatBetween(0, 1) < 0.002) {
            this.rest = true;
            this.restTimer = Phaser.Math.FloatBetween(0.5, 2);
            this.anims.play('fly-idle', true);
            return;
        }

        toTarget.normalize();
        this.velocity.lerp(toTarget.scale(400), 0.02);

        this.x += this.velocity.x * dt;
        this.baseY += this.velocity.y * dt;

        this.floatPhase += this.floatSpeed * dt;
        this.y = this.baseY + Math.sin(this.floatPhase) * this.floatAmplitude;


        if (this.velocity.x > 0) {
            if (this.anims.currentAnim?.key !== 'fly-right') {
                this.anims.play('fly-right', true);
            }
        } else if (this.velocity.x < 0) {
            if (this.anims.currentAnim?.key !== 'fly-left') {
                this.anims.play('fly-left', true);
            }
        } else {
            if (this.anims.currentAnim?.key !== 'fly-idle') {
                this.anims.play('fly-idle', true);
            }
        }
        this.x = Phaser.Math.Clamp(this.x, 0, screenWidth);
        this.y = Phaser.Math.Clamp(this.y, 0, screenHeight);


    }
}