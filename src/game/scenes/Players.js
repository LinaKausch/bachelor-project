import { Scene } from 'phaser';
import { PlayersNum } from '../utils/PlayersNum.js';
import Wand from '../prefabs/wand.js';
import { Serial } from '../utils/Serial.js';

export class Players extends Scene {
    constructor() {
        super('Players');
    }

    create() {
        this.bg = this.add.image(0, 0, 'background');
        this.bg.setOrigin(0, 0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;
        this.bg.setDepth(-10);

        const centerX = this.scale.width / 2;

        //TITLE
        this.add.text(centerX, 120, "Hoeveel Spelers?", {
            fontFamily: 'Arial Black',
            fontSize: 60,
            color: '#c685ffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        //SUBTITLE
        this.add.text(centerX, 200, "Gebruik de toverstaf om de aantal spelers te selecteren", {
            fontFamily: 'Arial',
            fontSize: 28,
            color: '#ffffff'
        }).setOrigin(0.5);

        //BUTTONS
        const buttonY = this.scale.height / 2 + 20;
        const bw = 280;
        const bh = 110;

        this.drawPlayerButton(centerX - 220, buttonY, "3 Spelers", () => {
            PlayersNum.players = 3;
            this.scene.start('AnimationOne');
        });

        this.drawPlayerButton(centerX + 220, buttonY, "2 Spelers", () => {
            PlayersNum.players = 2;
            this.scene.start('AnimationOne');
        });

        //WAND
        this.wand = new Wand(this);

        this.input.on("pointermove", (pointer) => {
            if (!Serial || !Serial.port) {
                this.wand.x = pointer.x;
                this.wand.y = pointer.y;
            }
        });

        this.input.on("pointerdown", () => {
            if (!Serial || !Serial.port) this.mouseCasting = true;
        });

        this.input.on("pointerup", () => {
            if (!Serial || !Serial.port) this.mouseCasting = false;
        });
    }

    update(time, delta) {
        this.wand.update(time, delta);
    }

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

        const zone = this.add.zone(x, y, bw, bh).setOrigin(0.5).setInteractive();
        zone.on("pointerdown", onClick);
    }

}
