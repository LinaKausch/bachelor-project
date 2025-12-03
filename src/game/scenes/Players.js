import { Scene } from 'phaser';

export class Players extends Scene {
    constructor() {
        super('Players');
    }

    create() {
        this.add.image(512, 384, 'background');

        const centerX = this.scale.width / 2;
        let y = this.scale.height / 2 - 300;

        this.add.text(centerX,
            y, 'How many players', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#f5af54ff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        y += 60;
        this.add.text(centerX,
            y, "Can you escape the wizard's spell?", {
            fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        y += 200;
        this.twoPlayersBtn = this.add.text(
            centerX - 200,
            y,
            "2 PLAYERS",
            {
                fontSize: "38px",
                fontFamily: "Arial",
                color: "#ffffff"
            }
        )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start('Players');
            });

        this.threePlayersBtn = this.add.text(
            centerX + 200,
            y,
            "3 PLAYERS",
            {
                fontSize: "38px",
                fontFamily: "Arial",
                color: "#ffffff"
            }
        )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.scene.start('Players');
            });


    }



}