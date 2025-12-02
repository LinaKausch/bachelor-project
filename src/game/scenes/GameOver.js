import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.add.image(512, 384, 'background');

        this.add.text(512, 384, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#f5af54ff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        //check how many players where chosen in the Players.js
 
        // 3 PLAYERS
        // If time is up and no creature is found then -> 2 creatures win
        // If time is up and one creature is found -> 1 creature win
        // If wizard finds both players -> wizard wins

        // 2 PLAYERS
        // If times is up and creature is not found -> creature wins
        // If Wizard catches a player -> wizard wins


        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}





// export const glow = (player) => {
//     const scene = player.scene;

//     player.postFX.addGlow(0x66ffcc, 1, 2, 2);
//     player.scene.tweens.add({
//         targets: player.glowFX,
//         outerStrength: 1.0,
//         duration: 500,
//         yoyo: true,
//         repeat: -1
//     });

// };