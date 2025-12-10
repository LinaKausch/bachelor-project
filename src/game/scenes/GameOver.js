// import { Scene } from 'phaser';

// // export class GameOver extends Scene {
// //     constructor() {
// //         super('GameOver');
// //     }

// //     create() {
// //         this.bg = this.add.image(0, 0, 'background');
// //         this.bg.setOrigin(0, 0);
// //         this.bg.displayWidth = this.scale.width;
// //         this.bg.displayHeight = this.scale.height;
// //         this.bg.setDepth(-10);
        

// //         this.add.text(512, 384, 'Game Over', {
// //             fontFamily: 'Arial Black', fontSize: 64, color: '#f5af54ff',
// //             stroke: '#000000', strokeThickness: 8,
// //             align: 'center'
// //         }).setOrigin(0.5);

// //         let titleText = "";
// //         let winners = [];

// //         switch (this.result) {
// //             case "wizard":
// //                 titleText = "WIZARD WINS!";
// //                 break;

// //             case "p1":
// //                 titleText = "PLAYER 1 ESCAPED!";
// //                 winners = [1];
// //                 break;

// //             case "p2":
// //                 titleText = "PLAYER 2 ESCAPED!";
// //                 winners = [2];
// //                 break;

// //             case "both":
// //                 titleText = "BOTH CREATURES ESCAPED!";
// //                 winners = [1, 2];
// //                 break;
// //         }


// //         //check how many players where chosen in the Players.js
 
// //         // 3 PLAYERS
// //         // If time is up and no creature is found then -> 2 creatures win
// //         // If time is up and one creature is found -> 1 creature win
// //         // If wizard finds both players -> wizard wins

// //         // 2 PLAYERS
// //         // If times is up and creature is not found -> creature wins
// //         // If Wizard catches a player -> wizard wins


// //         this.input.once('pointerdown', () => {

// //             this.scene.start('Players');

// //         });
// //     }
// // }


// export class GameOver extends Scene {
//     constructor() {
//         super("GameOver");
//     }

//     init(data) {
//         this.result = data.result;
//     }

//     create() {
//         this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.85)
//             .setOrigin(0);

//         switch (this.result) {

//             case "wizard":
//                 this.showWizardWin();
//                 break;

//             case "single":
//                 this.showSingleWin();
//                 break;

//             case "both":
//                 this.showBothWin();
//                 break;
//         }

//         this.add.text(
//             this.scale.width / 2,
//             this.scale.height - 100,
//             "Click to Restart",
//             {
//                 fontFamily: "Arial",
//                 fontSize: "32px",
//                 color: "#ffffff"
//             }
//         ).setOrigin(0.5);

//         this.input.once("pointerdown", () => {
//             this.scene.start("Idle");
//         });
//     }


//     showWizardWin() {
//         this.add.text(this.scale.width / 2, 180, "WIZARD WINS!", {
//             fontFamily: "Arial Black",
//             fontSize: "72px",
//             color: "#ff4444"
//         }).setOrigin(0.5);
//     }


//     showSingleWin() {
//         this.add.text(this.scale.width / 2, 150, "CREATURES ESCAPED!", {
//             fontFamily: "Arial Black",
//             fontSize: "60px",
//             color: "#55ff88"
//         }).setOrigin(0.5);
//     }


//     showBothWin() {
//         this.add.text(this.scale.width / 2, 150, "BOTH CREATURES ESCAPED!", {
//             fontFamily: "Arial Black",
//             fontSize: "52px",
//             color: "#55ff88"
//         }).setOrigin(0.5);
//     }


// }






// // export const glow = (player) => {
// //     const scene = player.scene;

// //     player.postFX.addGlow(0x66ffcc, 1, 2, 2);
// //     player.scene.tweens.add({
// //         targets: player.glowFX,
// //         outerStrength: 1.0,
// //         duration: 500,
// //         yoyo: true,
// //         repeat: -1
// //     });

// // };


import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    init(data) {
        this.result = data.result;
    }

    create() {
        // BACKGROUND
        this.bg = this.add.image(0, 0, 'background');
        this.bg.setOrigin(0, 0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;

        // DARK OVERLAY
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.55)
            .setOrigin(0);

        // TITLE
        this.add.text(
            this.scale.width / 2,
            120,
            "Game Over",
            {
                fontFamily: "Arial Black",
                fontSize: 60,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // RESULT SPECIFIC UI
        switch (this.result) {
            case "wizard": this.showWizardWins(); break;
            case "single": this.showSingleEscape(); break;
            case "both": this.showBothEscape(); break;
        }

        this.drawPlayAgainButton();
    }

    // -------------------------------
    // WIZARD WINS
    // -------------------------------
    showWizardWins() {
        this.add.text(
            this.scale.width / 2,
            260,
            "Tovenaar Wint!",
            {
                fontFamily: "Arial Black",
                fontSize: 72,
                color: "#c685ffff",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5);


        // // Wizard illustration
        // const wiz = this.add.image(250, this.scale.height - 100, "wizard");
        // wiz.setScale(0.9).setOrigin(0.5, 1);
    }

    // -------------------------------
    // ONE CREATURE ESCAPED
    // -------------------------------
    showSingleEscape() {
        this.add.text(
            this.scale.width / 2,
            260,
            "Wezens Winnen!",
            {
                fontFamily: "Arial Black",
                fontSize: 72,
                color: "#c685ffff",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5);


        // One creature (left)
        // const npc = this.add.image(200, this.scale.height - 120, "npc");
        // npc.setScale(0.7).setOrigin(0.5, 1);
    }

    // -------------------------------
    // BOTH CREATURES ESCAPED
    // -------------------------------
    showBothEscape() {
        this.add.text(
            this.scale.width / 2,
            260,
            "Wezens Winnen!",
            {
                fontFamily: "Arial Black",
                fontSize: 72,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8
            }
        ).setOrigin(0.5);


        // Two creatures
        // const npc1 = this.add.image(200, this.scale.height - 120, "npc");
        // npc1.setScale(0.7).setOrigin(0.5, 1);

        // const npc2 = this.add.image(this.scale.width - 200, this.scale.height - 120, "npc");
        // npc2.setScale(0.7).setOrigin(0.5, 1);
    }

    // -------------------------------
    // PLAY AGAIN BUTTON
    // -------------------------------
    drawPlayAgainButton() {
        const centerX = this.scale.width / 2;
        const y = this.scale.height - 180;
        const bw = 400;
        const bh = 90;

        // Rounded rectangle graphics
        const button = this.add.graphics();
        button.fillStyle(0xdedcff, 1);
        button.lineStyle(6, 0x000000);
        button.fillRoundedRect(centerX - bw / 2, y - bh / 2, bw, bh, 25);
        button.strokeRoundedRect(centerX - bw / 2, y - bh / 2, bw, bh, 25);

        // Button text
        this.add.text(centerX, y, "START OPNIEUW", {
            fontFamily: "Arial Black",
            fontSize: 38,
            color: "#000000"
        }).setOrigin(0.5);

        // Click zone
        const hitbox = this.add.zone(centerX, y, bw, bh)
            .setOrigin(0.5)
            .setInteractive();

        hitbox.on("pointerdown", () => {
            this.scene.start("Players");
        });
    }
}
