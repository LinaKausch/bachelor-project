// import { Scene } from 'phaser';

// export class Idle extends Scene {
//     constructor() {
//         super('Idle');
//     }

//     create() {
//         this.bg = this.add.image(0, 0, 'background');
//         this.bg.setOrigin(0, 0);
//         this.bg.displayWidth = this.scale.width;
//         this.bg.displayHeight = this.scale.height;
//         this.bg.setDepth(-10);

//         this.add.rectangle(
//             0, 0,
//             this.scale.width,
//             this.scale.height,
//             0x000000,
//             0.5
//         ).setOrigin(0);

//         const centerX = this.scale.width / 2;
//         let y = this.scale.height / 2 - 80;

//         this.add.text(centerX,
//             y, 'Mistique Minis', {
//             fontFamily: 'Arial Black', fontSize: 48, color: '#c685ffff',
//             stroke: '#e3e1ffff', strokeThickness: 8,
//             align: 'center'
//         }).setOrigin(0.5);

//         y += 60;
//         this.add.text(centerX,
//             y, "Can you escape the wizard's spell?", {
//             fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
//             align: 'center'
//         }).setOrigin(0.5);

//         y += 100;
//         this.startButton = this.add.text(
//             centerX,
//             y,
//             "START",
//             {
//                 fontSize: "48px",
//                 fontFamily: "Arial",
//                 color: "#ffffff"
//             }
//         )
//             .setOrigin(0.5)
//             .setInteractive()
//             .on("pointerdown", () => {
//                 this.scene.start('Players');
//             });

//     }
// }

import { Scene } from 'phaser';
import Wand from '../prefabs/wand.js';
import { Input } from '../utils/Input.js';

export class Idle extends Scene {
    constructor() {
        super('Idle');
    }

    create() {
        // Background
        this.bg = this.add.image(0, 0, 'background');
        this.bg.setOrigin(0, 0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;

        // Soft dark overlay
        this.add.rectangle(
            0, 0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.4
        ).setOrigin(0);

        const centerX = this.scale.width / 2;

        // TITLE
        this.add.text(centerX, 140, 'Mistique Minis', {
            fontFamily: 'Arial Black',
            fontSize: 80,
            color: '#c685ffff',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5);

        // SUBTITLE
        this.add.text(centerX, 230,
            'Kan de tovenaar de echte wezens vangen?', {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#ffffff'
        }).setOrigin(0.5);

        // PLAY BUTTON
        const buttonY = this.scale.height / 2 + 100;
        const bw = 300, bh = 90;
        const bx = centerX - bw / 2;
        const by = buttonY - bh / 2;

        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xdedcff, 1);
        buttonBg.fillRoundedRect(bx, by, bw, bh, 30);
        buttonBg.lineStyle(6, 0x000000);
        buttonBg.strokeRoundedRect(bx, by, bw, bh, 30);

        this.add.text(centerX, buttonY, "START", {
            fontFamily: "Arial Black",
            fontSize: 40,
            color: "#000000"
        }).setOrigin(0.5);

        const buttonZone = this.add.zone(centerX, buttonY, bw, bh)
            .setOrigin(0.5)
            .setInteractive();
        buttonZone.on("pointerdown", () => this.scene.start("Players"));

        // ------------------------------------------------
        // WAND TARGET + SHOOTING IN IDLE SCREEN
        // ------------------------------------------------
        this.wand = new Wand(this);

        // Mouse movement controls wand
        this.input.on("pointermove", (pointer) => {
            this.wand.x = pointer.x;
            this.wand.y = pointer.y;
        });

        // Mouse casting events
        this.input.on("pointerdown", () => {
            this.mouseCasting = true;
        });

        this.input.on("pointerup", () => {
            this.mouseCasting = false;
        });
    }

    update(time, delta) {
        // Update wand just like in the Game scene
        this.wand.update(time, delta);
    }
}

