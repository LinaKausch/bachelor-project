import Phaser from 'phaser';

export default class Wand extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);
        scene.add.existing(this);

        this.scene = scene;

        this.radius = 20;
        this.lineStyle(3, 0xBDB9FA);
        this.strokeCircle(this.x, this.y, this.radius);


        //PARTICLE
        // const g = scene.add.graphics();
        // g.fillStyle(0xffffff, 1);
        // g.fillCircle(4, 4, 4);
        // g.generateTexture('spark', 10, 10);

        // const spark = scene.add.image(0, 0, 'spark');

        // spark.postFX.addGlow({
        //     color: 0xFF0000,
        //     outerStrength: 20,
        //     distance: 100,
        //     quality: 0.1
        // });


        this.particles = scene.add.particles(this.x, this.y, 'spark', {
            speed: { min: 10, max: 300 },
            lifespan: { min: 400, max: 800 },
            scale: { start: 0.07, end: 0},
            quantity: -1,
            angle: { min: 0, max: 360 },
            blendMode: 'SCREEN',
        });

        // scene.input.on('pointerdown', () => {
        //     this.particles.explode(100, this.x, this.y);
        // });
    }

    update(pointer) {
        // this.x = pointer.worldX;
        // this.y = pointer.worldY;

        const accX = this.scene.accX;
        const accY = this.scene.accY;
        const z = this.scene.zButton;


        if (accX !== undefined && accY !== undefined) {
            // const sensitivity = 0.2;
            const smooth = 0.12;

            let targetX = Phaser.Math.Linear(0, this.scene.scale.width, accX / 255);
            let targetY = Phaser.Math.Linear(0, this.scene.scale.height, accY / 255);

            this.x = Phaser.Math.Linear(this.x, targetX, smooth);
            this.y = Phaser.Math.Linear(this.y, targetY, smooth);
            // const centerX = 128;
            // const centerY = 128;

            // let dx = (accX - centerX) * sensitivity;
            // let dy = (accY - centerY) * sensitivity;

            // this.x += dx;
            // this.y += dy;

            this.x = Phaser.Math.Clamp(this.x, 0, this.scene.scale.width);
            this.y = Phaser.Math.Clamp(this.y, 0, this.scene.scale.height);
        }

        if (z === 1) {
            this.particles.explode(100, this.x, this.y);
        }
    }
}
