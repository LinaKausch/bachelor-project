// import { Scene } from 'phaser';
// import { PlayersNum } from '../utils/PlayersNum.js';

// export class Players extends Scene {
//     constructor() {
//         super('Players');
//     }

//     create() {
//         this.bg = this.add.image(0, 0, 'background');
//         this.bg.setOrigin(0, 0);
//         this.bg.displayWidth = this.scale.width;
//         this.bg.displayHeight = this.scale.height;
//         this.bg.setDepth(-10);

//         const centerX = this.scale.width / 2;
//         let y = this.scale.height / 2 - 300;

//         this.add.text(centerX,
//             y, 'How many players', {
//             fontFamily: 'Arial Black', fontSize: 38, color: '#f5af54ff',
//             stroke: '#000000', strokeThickness: 8,
//             align: 'center'
//         }).setOrigin(0.5);

//         y += 60;
//         this.add.text(centerX,
//             y, "Can you escape the wizard's spell?", {
//             fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
//             align: 'center'
//         }).setOrigin(0.5);

//         y += 200;
//         this.twoPlayersBtn = this.add.text(
//             centerX - 200,
//             y,
//             "2 PLAYERS",
//             {
//                 fontSize: "38px",
//                 fontFamily: "Arial",
//                 color: "#ffffff"
//             }
//         )
//             .setOrigin(0.5)
//             .setInteractive()
//             .on("pointerdown", () => {
//                 PlayersNum.players = 2;
//                 this.scene.start('Potions');
//             });

//         this.threePlayersBtn = this.add.text(
//             centerX + 200,
//             y,
//             "3 PLAYERS",
//             {
//                 fontSize: "38px",
//                 fontFamily: "Arial",
//                 color: "#ffffff"
//             }
//         )
//             .setOrigin(0.5)
//             .setInteractive()
//             .on("pointerdown", () => {
//                 PlayersNum.players = 3;
//                 this.scene.start('Potions');
//             });
//     }



// }


import { Scene } from 'phaser';
import Wand from '../prefabs/wand.js';
import { PlayersNum } from '../utils/PlayersNum.js';

export class Players extends Scene {
    constructor() {
        super('Players');
    }

    create() {
        // Background
        this.bg = this.add.image(0, 0, 'background');
        this.bg.setOrigin(0, 0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;

        // Slight overlay
        this.add.rectangle(
            0, 0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.3
        ).setOrigin(0);

        const centerX = this.scale.width / 2;

        // TITLE
        this.add.text(centerX, 120, "Hoeveel Spelers?", {
            fontFamily: 'Arial Black',
            fontSize: 60,
            color: '#c685ffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // SUBTITLE
        this.add.text(centerX, 200, "Gebruik de toverstaf om de aantal spelers te selecteren", {
            fontFamily: 'Arial',
            fontSize: 28,
            color: '#ffffff'
        }).setOrigin(0.5);

        // PLAYER CHOICE BUTTONS
        const buttonY = this.scale.height / 2 + 20;
        const bw = 280;
        const bh = 110;

        // 2 PLAYERS
        this.drawPlayerButton(centerX - 220, buttonY, "3 Spelers", () => {
            PlayersNum.players = 3;
            this.scene.start('AnimationOne');
        });

        // 3 PLAYERS
        this.drawPlayerButton(centerX + 220, buttonY, "2 Spelers", () => {
            PlayersNum.players = 2;
            this.scene.start('Potions');
        });

        // --------------------------------------
        // WAND TARGET + PARTICLES
        // --------------------------------------
        this.wand = new Wand(this);

        this.input.on("pointermove", (p) => {
            this.wand.x = p.x;
            this.wand.y = p.y;
        });

        this.input.on("pointerdown", () => {
            this.mouseCasting = true;
        });

        this.input.on("pointerup", () => {
            this.mouseCasting = false;
        });
    }

    update(time, delta) {
        // Update wand (for particle casting)
        this.wand.update(time, delta);
    }

    // --------------------------------------
    // Rounded buttons
    // --------------------------------------
    drawPlayerButton(x, y, label, onClick) {
        const bw = 260;
        const bh = 90;

        const bg = this.add.graphics();
        bg.fillStyle(0xdedcff, 1);
        bg.lineStyle(6, 0x000000);
        bg.fillRoundedRect(x - bw / 2, y - bh / 2, bw, bh, 25);
        bg.strokeRoundedRect(x - bw / 2, y - bh / 2, bw, bh, 25);

        const text = this.add.text(x, y, label, {
            fontFamily: "Arial Black",
            fontSize: 32,
            color: "#000000"
        }).setOrigin(0.5);

        // Click zone
        const zone = this.add.zone(x, y, bw, bh).setOrigin(0.5).setInteractive();
        zone.on("pointerdown", onClick);
    }
}

