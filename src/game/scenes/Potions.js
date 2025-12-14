import { Scene } from 'phaser';
import Player from '../prefabs/player.js';
import { creatureAnimation } from '../utils/CreatureAnimation.js';
import { wiggleOn, wiggleOff, initWiggle, updateWiggle } from '../powers/Wiggle.js';
import { glowOn, glowOff } from '../powers/Glow.js';
import { growOn, growOff } from '../powers/Grow.js';
import { colorOn, colorOff } from '../powers/Color.js';
import { Input } from '../utils/Input.js';
import { ChosenPowers } from '../utils/ChosenPowers.js';
import { PlayersNum } from '../utils/PlayersNum.js';
import Timer from '../utils/Timer.js';
import TimerBar from '../utils/TimerBar.js';


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
            0.8,

        ).setOrigin(0)
            .setDepth(-9);

        this.prevBtn1 = 0;
        this.prevBtn2 = 0;

        creatureAnimation(this);

        // Ensure wiggle pipeline is available for previews in this scene
        initWiggle(this);

        //BORDERS
        this.p1Border = this.add.graphics();
        this.p1Border.lineStyle(6, 0x5DA9FF, 1);
        this.p1Border.setDepth(5);

        this.p2Border = this.add.graphics();
        this.p2Border.lineStyle(6, 0xFFE45D, 1);
        this.p2Border.setDepth(5);

        this.selected1 = 0;
        this.selected2 = 3;

        //POTIONS
        this.potion1 = this.add.image(400, 300, 'glow');
        this.potion1.setScale(0.1);

        this.potion2 = this.add.image(550, 300, 'grow');
        this.potion2.setScale(0.1);

        this.potion3 = this.add.image(700, 300, 'trace');
        this.potion3.setScale(0.1);

        this.potion4 = this.add.image(850, 300, 'colour');
        this.potion4.setScale(0.1);

        this.potions = [this.potion1, this.potion2, this.potion3, this.potion4];


        //MOUSE CONTROL
        this.potion1.setInteractive();
        this.potion2.setInteractive();
        this.potion3.setInteractive();
        this.potion4.setInteractive();

        this.potion1.on('pointerover', () => { glowOn(this.player1); });
        this.potion1.on('pointerout', () => { glowOff(this.player1); });

        this.potion2.on('pointerover', () => { growOn(this.player1); });
        this.potion2.on('pointerout', () => { growOff(this.player1); });

        this.potion3.on('pointerover', () => { wiggleOn(this.player1); });
        this.potion3.on('pointerout', () => { wiggleOff(this.player1); });

        this.potion4.on('pointerover', () => { colorOn(this.player1); });
        this.potion4.on('pointerout', () => { colorOff(this.player1); });



        //PLAYERS
        this.players = [];

        const p1 = new Player(this, 150, 300);
        p1.setScale(0.25);
        p1.setVisible(true);
        p1.active = true;
        this.players.push(p1);

        if (PlayersNum.players === 3) {
            const p2 = new Player(this, 1100, 300);
            p2.setScale(0.25);
            p2.setVisible(true);
            p2.active = true;
            this.players.push(p2);
        }

        this.player1 = this.players[0];
        this.player2 = this.players[1] ?? null;
        if (this.player1) this.player1.setDepth(1);
        if (this.player2) this.player2.setDepth(1);

        this.selected1 = 0;
        this.selected2 = PlayersNum.players === 3 ? 3 : null;

        this.updateBorders();

        this.p1Status = this.add.text(150, 500, 'NIET KLAAR', {
            fontFamily: 'Ariel black',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.p2Status = this.player2
            ? this.add.text(1100, 500, 'NIET KLAAR', {
                fontFamily: 'Ariel black',
                fontSize: '24px',
                color: '#ffffff'
            }).setOrigin(0.5): null;

        // this.input.once("pointerdown", () => {

        //RANDOM POTION
        // if (this.selected1 === null || this.selected1 === undefined) {
        //     this.selected1 = Phaser.Math.Between(0, 3);
        // }
        // if (PlayersNum.players === 3) {
        //     if (this.selected2 === null || this.selected2 === undefined) {
        //         this.selected2 = Phaser.Math.Between(0, 3);
        //     }
        // }

        //TIMER
        this.timer = new Timer(20);
        this.timerBar = new TimerBar(this, this.timer, { direction: 'horizontal' });
        this.timer.start();

        this.timer.onComplete = () => {
            console.log("Potion time is up!");

            if (!this.p1Locked) {
                this.selected1 = Phaser.Math.Between(0, 3);
                this.applyPower(1, this.selected1);
            }
            if (PlayersNum.players === 3 && !this.p2Locked) {
                this.selected2 = Phaser.Math.Between(0, 3);
                this.applyPower(2, this.selected2);
            }
            ChosenPowers.p1 = this.selected1;
            ChosenPowers.p2 = PlayersNum.players === 3 ? this.selected2 : null;

            this.scene.start("AnimationTwo");
        };
    }

    update(time, delta) {
        const tsec = time / 1000;
        updateWiggle(tsec);

        this.timer.update(delta / 1000);
        this.timerBar.update();

        const joystickDir1 = Input.joy1;
        const joystickDir2 = Input.joy2;

        const btn1 = Input.btn1;
        const btn2 = Input.btn2;

        this.player1.update(time, delta);
        if (this.player2) {
            this.player2.update(time, delta);
        }

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

        if (PlayersNum.players === 3) {
            if (!this.p2Locked && btn2 === 1 && this.prevBtn2 === 0) {
                this.p2Locked = true;
                this.applyPower(2, this.selected2);
            }
        } else {
            this.p2Locked = true;
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
        if (PlayersNum.players === 3) {
            const p2 = this.potions[this.selected2];
            this.p2Border.lineStyle(6, 0xFFE45D, 1);
            this.p2Border.strokeRect(
                p2.x - p2.displayWidth / 2 - 10,
                p2.y - p2.displayHeight / 2 - 10,
                p2.displayWidth + 20,
                p2.displayHeight + 20
            );
        }
        // this.p2Border.strokeRect(
        //     p2.x - p2.displayWidth / 2 - 10,
        //     p2.y - p2.displayHeight / 2 - 10,
        //     p2.displayWidth + 20,
        //     p2.displayHeight + 20
        // );
    }

    previewPower(player, potionIndex) {
        glowOff(player);
        growOff(player);
        wiggleOff(player);
        colorOff(player);

        switch (potionIndex) {
            case 0: glowOn(player); break;
            case 1: growOn(player); break;
            case 2: wiggleOn(player); break;
            case 3: colorOn(player); break;
        }
    }

    applyPower(playerNumber, potionIndex) {
        const player = playerNumber === 1 ? this.player1 : this.player2;


        glowOff(player);
        growOff(player);
        wiggleOff(player);
        colorOff(player);

        switch (potionIndex) {
            case 0: glowOn(player); break;
            case 1: growOn(player); break;
            case 2: wiggleOn(player); break;
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
