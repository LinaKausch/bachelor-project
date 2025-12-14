import { Scene } from 'phaser';
import Wand from '../prefabs/wand.js';
import { Serial } from '../utils/Serial.js';

export class Idle extends Scene {
    constructor() {
        super('Idle');
    }

    create() {
        // this.bg = this.add.image(0, 0, 'background')
        //     .setOrigin(0)
        //     .setDepth(-10);

        // this.overlay = this.add.rectangle(
        //     0, 0,
        //     0, 0,
        //     0x000000,
        //     0.5
        // ).setOrigin(0);

        const video = this.add.video(
            this.scale.width / 2,
            this.scale.height / 2,
            'idle'
        );

        video.play(true);
        video.setDisplaySize(100, 100);
        video.setDepth(-10);


        this.scale.on('resize', ({ width, height }) => {
            this.resize(width, height);
        });

        const centerX = this.scale.width / 2;
        const buttonY = this.scale.height / 2 + 100;

        // TITLE
        this.title = this.add.text(centerX, 140, 'Mistique Minis', {
            fontFamily: 'Arial Black',
            fontSize: 60,
            color: '#c685ffff',
            stroke: '#000000ff',
            strokeThickness: 8
        }).setOrigin(0.5);

        // BUTTON
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

        // WAND
        this.wand = new Wand(this);

        this.input.on("pointermove", p => {
            if (!Serial || !Serial.port) {
                this.wand.setPosition(p.x, p.y);
            }
        });

        this.input.on("pointerdown", () => {
            this.mouseCasting = true;
        });

        this.input.on("pointerup", () => {
            this.mouseCasting = false;
        });

        // this.resize(this.scale.width, this.scale.height);
    }

    // resize(width, height) {
    //     this.bg.displayWidth = width;
    //     this.bg.displayHeight = height;

    //     this.overlay.width = width;
    //     this.overlay.height = height;
    // }


    update(time, delta) {
        this.wand.update(time, delta);

    }
}
