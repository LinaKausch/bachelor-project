import { Scene } from 'phaser';

export class Idle extends Scene {
    constructor() {
        super('Idle');
    }

    create() {
        this.add.image(512, 384, 'background');

        const centerX = this.scale.width / 2;
        let y = this.scale.height / 2 - 80;

        this.add.text(centerX,
            y, 'Catch me if you can', {
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

        y += 100;
        this.startButton = this.add.text(
            centerX,
            y,
            "START",
            {
                fontSize: "48px",
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
