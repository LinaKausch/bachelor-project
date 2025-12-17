import Phaser from 'phaser';
import { Input } from '../utils/Input.js';

export default class Wand extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);
        scene.add.existing(this);

        this.scene = scene;

        this.radius = 20;
        this.strokeColor = 0xBDB9FA;
        this.strokeWidth = 3;

        this.shootDelay = 800;
        this.particleCount = 30;

        this.accCenterX = -25;
        this.accCenterY = 90;
        this.accRangeX = 100;
        this.accRangeY = 60;
        this.smoothFactor = 0.15;

        this.lastShot = 0;
        this.smoothX = 0;
        this.smoothY = 0;

        this.initializePosition();
        this.initializeParticles();
        this.setupCleanup();
    }

    initializePosition() {
        const pointer = this.scene?.input?.activePointer;
        if (pointer && typeof pointer.x === 'number') {
            this.x = pointer.x;
            this.y = pointer.y;
        } else {
            this.x = this.scene.scale.width / 2;
            this.y = this.scene.scale.height / 2;
        }

        this.lineStyle(this.strokeWidth, this.strokeColor);
        this.strokeCircle(this.x, this.y, this.radius);
        this.setDepth(1);
    }

    initializeParticles() {
        this.particles = this.scene.add.particles(0, 0, 'spark-y', {
            speed: { min: 10, max: 300 },
            lifespan: { min: 600, max: 800 },
            scale: { start: 0.08, end: 0 },
            quantity: -1,
            angle: { min: 0, max: 360 },
            blendMode: 'SCREEN'
        });
        this.particles.setDepth(2);
        this.particles.startFollow(this, 0, 0);
    }

    setupCleanup() {
        this.scene.events.once('shutdown', () => {
            this.lastShot = 0;
            if (this.particles) {
                this.particles.stop();
            }
        });
    }

    update(time, delta) {
        this.redraw();
        this.updatePositionFromAccelerometer();
        this.handleCasting(time);
    }

    redraw() {
        this.clear();
        this.lineStyle(this.strokeWidth, this.strokeColor);
        this.strokeCircle(0, 0, this.radius);
    }

    updatePositionFromAccelerometer() {
        const { accX, accY } = Input;
        if (accX === undefined || accY === undefined) return;

        const centerX = this.accCenterX;
        const centerY = this.accCenterY;
        const rangeX = this.accRangeX;
        const rangeY = this.accRangeY;

        const rawX = Phaser.Math.Clamp(accX - centerX, -rangeX, rangeX);
        const rawY = Phaser.Math.Clamp(accY - centerY, -rangeY, rangeY);

        this.smoothX += (rawX - this.smoothX) * this.smoothFactor;
        this.smoothY += (rawY - this.smoothY) * this.smoothFactor;

        const normX = this.smoothX / rangeX;
        const normY = this.smoothY / rangeY;

        this.x = Phaser.Math.Clamp(
            (normX + 1) * 0.5 * this.scene.scale.width,
            0,
            this.scene.scale.width
        );

        this.y = Phaser.Math.Clamp(
            (normY + 1) * 0.5 * this.scene.scale.height,
            0,
            this.scene.scale.height
        );
    }

    handleCasting(time) {
        const cast = (Input.z === 1) || this.scene.mouseCasting;
        if (cast && time > this.lastShot + this.shootDelay) {
            this.particles.explode(30, this.x, this.y);
            this.lastShot = time;
            this.scene.sound.play('wand-sound', { volume: 1 });
        }
    }
}