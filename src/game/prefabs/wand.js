// import Phaser from 'phaser';
// import { Input } from '../utils/Input.js';

// export default class Wand extends Phaser.GameObjects.Graphics {
//     constructor(scene) {
//         super(scene);
//         scene.add.existing(this);

//         this.scene = scene;

//         this.radius = 20;
//         this.lineStyle(3, 0xBDB9FA);
//         this.strokeCircle(this.x, this.y, this.radius);
//         this.setDepth(1);
//         this.lastShot = 0;
//         this.shootDelay = 200;

//         //PARTICLE
//         // const g = scene.add.graphics();
//         // g.fillStyle(0xffffff, 1);
//         // g.fillCircle(4, 4, 4);
//         // g.generateTexture('spark', 10, 10);

//         // const spark = scene.add.image(0, 0, 'spark');

//         // spark.postFX.addGlow({
//         //     color: 0xFF0000,
//         //     outerStrength: 20,
//         //     distance: 100,
//         //     quality: 0.1
//         // });


//         this.particles = scene.add.particles(this.x, this.y, 'spark', {
//             speed: { min: 10, max: 300 },
//             lifespan: { min: 400, max: 800 },
//             scale: { start: 0.07, end: 0},
//             quantity: -1,
//             angle: { min: 0, max: 360 },
//             blendMode: 'SCREEN',
//         });
//         this.particles.setDepth(2);

//         // scene.input.on('pointerdown', () => {
//         //     this.particles.explode(100, this.x, this.y);
//         // });
//     }

//     update(time, delta) {

//         const accX = Input.accX;
//         const accY = Input.accY;
//         const z = Input.z;

//         // console.log(Input.zButton);

//         if (accX !== undefined && accY !== undefined) {
//             const smooth = 0.10;

//             const MIN = 80;
//             const MAX = 180;


//             const clampedX = Phaser.Math.Clamp(accX, MIN, MAX);
//             const clampedY = Phaser.Math.Clamp(accY, MIN, MAX);

//             const normX = (clampedX - MIN) / (MAX - MIN);
//             const normY = (clampedY - MIN) / (MAX - MIN);

//             let targetX = normX * this.scene.scale.width;
//             let targetY = normY * this.scene.scale.height;
//             // let targetX = Phaser.Math.Linear(0, this.scene.scale.width, accX / 255);
//             // let targetY = Phaser.Math.Linear(0, this.scene.scale.height, accY / 255);

//             this.x = Phaser.Math.Linear(this.x, targetX, smooth);
//             this.y = Phaser.Math.Linear(this.y, targetY, smooth);


//             this.x = Phaser.Math.Clamp(this.x, 0, this.scene.scale.width);
//             this.y = Phaser.Math.Clamp(this.y, 0, this.scene.scale.height);
//         }


//         // if (z === 1) {
//         //     this.particles.explode(100, this.x, this.y);
//         // }
//         if (z === 1 && time > this.lastShot + this.shootDelay) {
//             this.particles.explode(60, this.x, this.y);
//             this.lastShot = time;
//         }
//     }
// }


import Phaser from 'phaser';
import { Input } from '../utils/Input.js';
import { Serial } from '../utils/Serial.js';

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
        this.shootDelay = 800;

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


        this.particles = scene.add.particles(this.x, this.y, 'spark-y', {
            speed: { min: 10, max: 300 },
            lifespan: { min: 600, max: 800 },
            scale: { start: 0.08, end: 0 },
            quantity: -1,
            angle: { min: 0, max: 360 },
            blendMode: 'SCREEN',
        });
        this.particles.setDepth(2);

        // scene.input.on('pointerdown', () => {
        //     this.particles.explode(100, this.x, this.y);
        // });
        // this.particles.setDepth(2);

        if (scene && scene.input && scene.input.activePointer && typeof scene.input.activePointer.x === 'number') {
            this.x = scene.input.activePointer.x;
            this.y = scene.input.activePointer.y;
        } else {
            this.x = scene.scale.width / 2;
            this.y = scene.scale.height / 2;
        }
    }

    update(time, delta) {
        this.clear();
        this.lineStyle(3, 0xBDB9FA);
        this.strokeCircle(0, 0, this.radius);

        let targetX = this.x;
        let targetY = this.y;

        const accX = Input.accX;
        const accY = Input.accY;

        const useAccel = accX !== undefined && accY !== undefined;

        if (useAccel) {
            // --- ACCEL CONTROL ---

            // These are empirical values for Nunchuk
            const CENTER_X = 130;
            const CENTER_Y = 130;

            const RANGE = 50; // tilt sensitivity
            let dx = (accX - CENTER_X) / RANGE;
            let dy = (accY - CENTER_Y) / RANGE;

            // Dead zone
            const DEAD = 0.15;
            if (Math.abs(dx) < DEAD) dx = 0;
            if (Math.abs(dy) < DEAD) dy = 0;

            // Clamp tilt
            dx = Phaser.Math.Clamp(dx, -1, 1);
            dy = Phaser.Math.Clamp(dy, -1, 1);

            // Map to movement area
            const rangeX = this.scene.scale.width * 0.35;
            const rangeY = this.scene.scale.height * 0.35;

            targetX = this.scene.scale.width / 2 + dx * rangeX;
            targetY = this.scene.scale.height / 2 + dy * rangeY;

        } else if (this.scene.input?.activePointer) {
            // --- MOUSE FALLBACK ---
            targetX = this.scene.input.activePointer.x;
            targetY = this.scene.input.activePointer.y;
        }

        // Smooth follow
        const followSmooth = useAccel ? 0.08 : 0.45;
        this.x = Phaser.Math.Linear(
            this.x,
            Phaser.Math.Clamp(targetX, 0, this.scene.scale.width),
            followSmooth
        );
        this.y = Phaser.Math.Linear(
            this.y,
            Phaser.Math.Clamp(targetY, 0, this.scene.scale.height),
            followSmooth
        );

        // Cast particles
        const cast = (Input.z === 1) || this.scene.mouseCasting;
        if (cast && time > this.lastShot + this.shootDelay) {
            this.particles.explode(30, this.x, this.y);
            this.lastShot = time;
        }
    }


    // update(time, delta) {

    //     this.clear();
    //     this.lineStyle(3, 0xBDB9FA);
    //     this.strokeCircle(0, 0, this.radius);


    //     let targetX = this.x;
    //     let targetY = this.y;

    //     const accX = Input.accX;
    //     const accY = Input.accY;

    //     // Prefer accelerometer when values are present; fall back to mouse otherwise
    //     const useAccel = (accX !== undefined && accY !== undefined);
    //     if (useAccel) {

    //         const MIN = 80; //make 100
    //         const MAX = 180; // make -100

    //         const clampedX = Phaser.Math.Clamp(accX, MIN, MAX);
    //         const clampedY = Phaser.Math.Clamp(accY, MIN, MAX);

    //         const normX = (clampedX - MIN) / (MAX - MIN);
    //         const normY = (clampedY - MIN) / (MAX - MIN);

    //         // Use centered mapping with dead zone for accel
    //         let dx = normX - 0.5;
    //         let dy = normY - 0.5;
    //         const DEAD = 0.08;
    //         if (Math.abs(dx) < DEAD) dx = 0;
    //         if (Math.abs(dy) < DEAD) dy = 0;
    //         const rangeX = this.scene.scale.width * 0.35;
    //         const rangeY = this.scene.scale.height * 0.35;
    //         targetX = this.scene.scale.width / 2 + dx * rangeX;
    //         targetY = this.scene.scale.height / 2 + dy * rangeY;
    //     } else if (this.scene && this.scene.input && this.scene.input.activePointer) {
    //         const p = this.scene.input.activePointer;
    //         if (typeof p.x === 'number' && typeof p.y === 'number') {
    //             targetX = p.x;
    //             targetY = p.y;
    //         }
    //     }

    //     const followSmooth = useAccel ? 0.12 : 0.45;
    //     this.x = Phaser.Math.Linear(this.x, Phaser.Math.Clamp(targetX, 0, this.scene.scale.width), followSmooth);
    //     this.y = Phaser.Math.Linear(this.y, Phaser.Math.Clamp(targetY, 0, this.scene.scale.height), followSmooth);


    //     const cast = (Input.z === 1) || this.scene.mouseCasting;
    //     if (cast && time > this.lastShot + this.shootDelay) {
    //         this.particles.explode(30, this.x, this.y);
    //         this.lastShot = time;
    //     }
    // }
}
