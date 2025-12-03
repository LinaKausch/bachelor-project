import Phaser from 'phaser';
import { Input } from '../utils/Input.js';

export default class Wand extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);
        scene.add.existing(this);

        this.scene = scene;

        this.radius = 20;
        this.lineStyle(3, 0xBDB9FA);
        this.strokeCircle(this.x, this.y, this.radius);
        this.setDepth(1);
        this.lastShot = 0;
        this.shootDelay = 200;

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
        this.particles.setDepth(2);

        // scene.input.on('pointerdown', () => {
        //     this.particles.explode(100, this.x, this.y);
        // });
    }

    update(time, delta) {

        const accX = Input.accX;
        const accY = Input.accY;
        const z = Input.z;

        // console.log(Input.zButton);

        if (accX !== undefined && accY !== undefined) {
            const smooth = 0.10;

            const MIN = 80;
            const MAX = 180;


            const clampedX = Phaser.Math.Clamp(accX, MIN, MAX);
            const clampedY = Phaser.Math.Clamp(accY, MIN, MAX);

            const normX = (clampedX - MIN) / (MAX - MIN);
            const normY = (clampedY - MIN) / (MAX - MIN);

            let targetX = normX * this.scene.scale.width;
            let targetY = normY * this.scene.scale.height;
            // let targetX = Phaser.Math.Linear(0, this.scene.scale.width, accX / 255);
            // let targetY = Phaser.Math.Linear(0, this.scene.scale.height, accY / 255);

            this.x = Phaser.Math.Linear(this.x, targetX, smooth);
            this.y = Phaser.Math.Linear(this.y, targetY, smooth);


            this.x = Phaser.Math.Clamp(this.x, 0, this.scene.scale.width);
            this.y = Phaser.Math.Clamp(this.y, 0, this.scene.scale.height);
        }


        // if (z === 1) {
        //     this.particles.explode(100, this.x, this.y);
        // }
        if (z === 1 && time > this.lastShot + this.shootDelay) {
            this.particles.explode(60, this.x, this.y);
            this.lastShot = time;
        }
    }
}
