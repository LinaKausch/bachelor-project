export default class TimerBar {
    constructor(scene, timer, config = {}) {
        this.scene = scene;
        this.timer = timer;

        this.container = scene.add.container(0, 0);
        this.container.setDepth(100);

        this.x = scene.scale.width - 50;
        this.y = scene.scale.height -260;

        this.wandOutline = scene.add.image(this.x, this.y, 'wand-lines');
        this.wandOutline.setOrigin(0.5, 1);
        this.wandOutline.setDepth(100);
        this.wandOutline.setScale(0.15);
        this.wandOutline.postFX.addGlow(0xffffff, 0.5, 5, 0.5);
        this.wandOutline.scene.tweens.add({
            targets: this.wandOutline.glowFX,
            outerStrength: 0.1,
            duration: 300,
            yoyo: true,
            repeat: -1
        });


        this.wandFill = scene.add.image(this.x, this.y, 'wand');
        this.wandFill.setOrigin(0.5, 1);
        this.wandFill.setDepth(99);
        this.wandFill.setScale(0.15);

        this.maskGraphics = scene.add.graphics();
        this.maskGraphics.setDepth(101);
        this.maskGraphics.setVisible(false);

        this.mask = this.maskGraphics.createGeometryMask();
        this.wandFill.setMask(this.mask);

        this.fullHeight = this.wandFill.displayHeight;
        this.width = this.wandFill.displayWidth;

        this.glitter = scene.add.particles(0, 0, 'spark-y', {
            speed: { min: 10, max: 60 },
            lifespan: { min: 400, max: 800 },
            scale: { start: 0.01, end: 0 },
            quantity: 1,
            angle: { min: 0, max: 360 },
            blendMode: 'SCREEN',
        });
        this.glitter.setDepth(102);

    }

    update() {
        const percent = Phaser.Math.Clamp(
            this.timer.getTimeLeft() / this.timer.duration,
            0,
            1
        );

        const visibleHeight = this.fullHeight * percent;

        const left = this.x - this.width / 2;
        const topOfImage = this.y - this.fullHeight;
        const top = topOfImage + (this.fullHeight - visibleHeight);
        this.glitter.setPosition(this.x, top);

        this.maskGraphics.clear();
        this.maskGraphics.fillStyle(0xffffff);

        this.maskGraphics.fillRect(
            left,
            top,
            this.width,
            visibleHeight
        );

        if (percent < this.lastPercent) {
            const amount = Phaser.Math.Between(3, 6);

            this.glitter.explode(
                amount,
                this.x,
                top
            );

            this.lastPercent = percent;
        }
    }

    destroy() {
        this.maskGraphics.destroy();
        this.wandFill.destroy();
        this.wandOutline.destroy();
    }
}
