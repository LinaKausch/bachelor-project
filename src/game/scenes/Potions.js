import { Scene } from 'phaser';
import Player from '../prefabs/player.js';
import { creatureAnimation } from '../utils/CreatureAnimation.js';
import { traceOn, traceOff } from '../powers/Trace.js';
import { glowOn, glowOff } from '../powers/Glow.js';
import { growOn, growOff } from '../powers/Grow.js';
import { colorOn, colorOff } from '../powers/Color.js';
import { Input } from '../utils/Input.js';
import { ChosenPowers } from '../utils/ChosenPowers.js';


export class Potions extends Scene {
    constructor() {
        super('Potions');
    }


    create() {
        this.bg = this.add.image(0, 0, 'cabin');
        this.bg.setOrigin(0, 0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;
        this.bg.setDepth(-10);

        this.add.rectangle(
            0, 0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.7
        ).setOrigin(0);

        this.prevBtn1 = 0;
        this.prevBtn2 = 0;

        this.p1Border = this.add.graphics();
        this.p1Border.lineStyle(6, 0x5DA9FF, 1);  // blue
        this.p1Border.setDepth(5);

        // Border for player 2 (yellow)
        this.p2Border = this.add.graphics();
        this.p2Border.lineStyle(6, 0xFFE45D, 1);  // yellow
        this.p2Border.setDepth(5);

        this.selected1 = 0;
        this.selected2 = 3;

        this.potion1 = this.add.image(600, 500, 'glow');
        this.potion1.setScale(0.15);

        this.potion2 = this.add.image(800, 500, 'grow');
        this.potion2.setScale(0.15);

        this.potion3 = this.add.image(1000, 500, 'trace');
        this.potion3.setScale(0.15);

        this.potion4 = this.add.image(1200, 500, 'colour');
        this.potion4.setScale(0.15);

        this.potions = [this.potion1, this.potion2, this.potion3, this.potion4];

        // this.potion1.setInteractive();
        // this.potion2.setInteractive();
        // this.potion3.setInteractive();
        // this.potion4.setInteractive();

        // this.potion1.on('pointerover', () => { glowOn(this.player1); });
        // this.potion1.on('pointerout', () => { glowOff(this.player1); });

        // this.potion2.on('pointerover', () => { growOn(this.player1); });
        // this.potion2.on('pointerout', () => { growOff(this.player1); });

        // this.potion3.on('pointerover', () => { traceOn(this.player1); });
        // this.potion3.on('pointerout', () => { traceOff(this.player1); });

        // this.potion4.on('pointerover', () => { colorOn(this.player1); });
        // this.potion4.on('pointerout', () => { colorOff(this.player1); });

        creatureAnimation(this);
        this.player1 = new Player(this, 200, 500);

        this.player2 = new Player(this, 1700, 500);
        this.player1.setScale(0.3);
        this.player2.setScale(0.3);
        this.updateBorders();


    }

    update(time, delta) {
        const joystickDir1 = Input.joy1;
        const joystickDir2 = Input.joy2;

        const btn1 = Input.btn1;
        const btn2 = Input.btn2;

        this.player1.update(time, delta);
        this.player2.update(time, delta)

        //PLAYER 1
        if (joystickDir1 === "left" && !this.p1LeftHeld) {
            this.selected1 = Math.max(0, this.selected1 - 1);
            this.p1LeftHeld = true;
            this.previewPower(this.player1, this.selected1);
            this.updateBorders();
        }
        if (joystickDir1 !== "left") this.p1LeftHeld = false;


        if (joystickDir1 === "right" && !this.p1RightHeld) {
            this.selected1 = Math.min(3, this.selected1 + 1);
            this.previewPower(this.player1, this.selected1);
            this.p1RightHeld = true;
            this.updateBorders();
        }
        if (joystickDir1 !== "right") this.p1RightHeld = false;

        // PLAYER 2 
        if (joystickDir2 === "left" && !this.p2LeftHeld) {
            this.selected2 = Math.max(0, this.selected2 - 1);
            this.p2LeftHeld = true;
            this.previewPower(this.player2, this.selected2)
            this.updateBorders();
        }
        if (joystickDir2 !== "left") this.p2LeftHeld = false;

        if (joystickDir2 === "right" && !this.p2RightHeld) {
            this.selected2 = Math.min(3, this.selected2 + 1);
            this.previewPower(this.player2, this.selected2)
            this.p2RightHeld = true;
            this.updateBorders();
        }
        if (joystickDir2 !== "right") this.p2RightHeld = false;

        // BUTTONS
        if (!this.p1Locked && btn1 === 1 && this.prevBtn1 === 0) {
             this.p1Locked = true;
            this.applyPower(1, this.selected1);
           
        }

        if (!this.p2Locked && btn2 === 1 && this.prevBtn2 === 0) {
            this.p2Locked = true;
            this.applyPower(2, this.selected2);
            
        }

        this.prevBtn1 = btn1;
        this.prevBtn2 = btn2;
    }


    updateBorders = () => {

        this.p1Border.clear();
        this.p2Border.clear();

        this.p1Border.lineStyle(6, 0x5DA9FF, 1);
        this.p2Border.lineStyle(6, 0xFFE45D, 1);

        const p1 = this.potions[this.selected1];
        const p2 = this.potions[this.selected2];

        this.p1Border.strokeRect(
            p1.x - p1.displayWidth / 2 - 10,
            p1.y - p1.displayHeight / 2 - 10,
            p1.displayWidth + 20,
            p1.displayHeight + 20
        );

        this.p2Border.strokeRect(
            p2.x - p2.displayWidth / 2 - 10,
            p2.y - p2.displayHeight / 2 - 10,
            p2.displayWidth + 20,
            p2.displayHeight + 20
        );
    }

    previewPower(player, potionIndex) {
        glowOff(player);
        growOff(player);
        traceOff(player);
        colorOff(player);

        switch (potionIndex) {
            case 0: glowOn(player); break;
            case 1: growOn(player); break;
            case 2: traceOn(player); break;
            case 3: colorOn(player); break;
        }
    }

    applyPower(playerNumber, potionIndex) {
        const player = playerNumber === 1 ? this.player1 : this.player2;


        glowOff(player);
        growOff(player);
        traceOff(player);
        colorOff(player);

        switch (potionIndex) {
            case 0: glowOn(player); break;
            case 1: growOn(player); break;
            case 2: traceOn(player); break;
            case 3: colorOn(player); break;
        }

        ChosenPowers[`p${playerNumber}`] = potionIndex;

        if (this.p1Locked && this.p2Locked) {
            this.time.delayedCall(300, () => {
                this.scene.start("Game");
            });
        }

        console.log(`Player ${playerNumber} selected potion ${potionIndex}`);
    }

}