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

        const card = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'potion-bg'
        ).setDepth(5).setScale(0.5, 0.4);

        this.add.text(
            card.x,
            card.y - card.displayHeight / 2 + 50,
            'Selecteer jouw toverdrankje',
            {
                fontFamily: 'Arial Black',
                fontSize: '26px',
                color: '#2e2a3a'
            }
        ).setOrigin(0.5).setDepth(6);


        //BORDERS
        this.p1Border = this.add.image(0, 0, 'p1-frame').setDepth(25).setScale(0.4);
        // this.p1Border.lineStyle(6, 0x5DA9FF, 1);


        this.p2Border = this.add.image(0, 0, 'p2-frame').setDepth(25).setScale(0.4);
        // this.p2Border.lineStyle(6, 0xFFE45D, 1);


        this.selected1 = 0;
        this.selected2 = 3;

        //POTIONS
        this.potion1 = this.add.image(0, 0, 'glow');
        this.potion2 = this.add.image(0, 0, 'grow');
        this.potion3 = this.add.image(0, 0, 'trace');
        this.potion4 = this.add.image(0, 0, 'colour');

        this.potions = [this.potion1, this.potion2, this.potion3, this.potion4];
        this.spacing = 150;
        this.y = this.scale.height / 2 + 20;
        this.totalWidth = this.spacing * (this.potions.length - 1);
        this.startX = this.scale.width / 2 - this.totalWidth / 2;

        this.potions.forEach((potion, i) => {
            potion
                .setPosition(this.startX + i * this.spacing, this.y)
                .setScale(0.1)
                .setDepth(6);
        });


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


        this.add.video(
            this.scale.width / 2,
            this.scale.height - 100,
            'potion-demo'
        ).setScale(0.2).play(true);

        //PLAYERS
        this.add.image(
            250,
            150,
            'title-e'
        ).setOrigin(0.5).setScale(0.4);

        this.add.image(
            this.scale.width - 250,
            150,
            'title-e'
        ).setOrigin(0.5).setScale(0.4);

        this.add.text(
             250,
            130,
            'Speler 1',
            {
                fontFamily: 'Arial Black',
                fontSize: '24px',
                color: '#1E192F'
            }
        ).setOrigin(0.5).setDepth(50);

        this.add.text(
            this.scale.width - 250,
            130,
            'Speler 2',
            {
                fontFamily: 'Arial Black',
                fontSize: '24px',
                color: '#1E192F'
            }
        ).setOrigin(0.5).setDepth(50);

        this.add.text(
            250,
            165,
             "Flapke",
            {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: '#2347C2'
            }
        ).setOrigin(0.5).setDepth(50);

        this.add.text(
            this.scale.width - 250,
            165,
            "Snufke",
            {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: '#2347C2'
            }
        ).setOrigin(0.5).setDepth(50);

        this.players = [];

        const p1 = new Player(this, 250, this.scale.height / 2);
        p1.setScale(0.3);
        p1.setVisible(true);
        p1.active = true;
        p1.setOrigin(0.5);
        this.players.push(p1);

        if (PlayersNum.players === 3) {
            const p2 = new Player(this, this.scale.width - 250, this.scale.height / 2);
            p2.setScale(0.3);
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

        this.p1Status = this.add.text(250, this.scale.height / 2 + 200, 'NIET KLAAR', {
            fontFamily: 'Arial black',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.p2Status = this.player2
            ? this.add.text(this.scale.width - 250, this.scale.height / 2 + 200, 'NIET KLAAR', {
                fontFamily: 'Arial black',
                fontSize: '24px',
                color: '#ffffff'
            }).setOrigin(0.5) : null;




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
            this.p1Status.setText('KLAAR');
        }

        if (PlayersNum.players === 3) {
            if (!this.p2Locked && btn2 === 1 && this.prevBtn2 === 0) {
                this.p2Locked = true;
                this.applyPower(2, this.selected2);
                this.p2Status?.setText('KLAAR');
            }
        } else {
            this.p2Locked = true;
        }

        this.prevBtn1 = btn1;
        this.prevBtn2 = btn2;
    }


    updateBorders = () => {
        const p1 = this.potions[this.selected1];
        if (p1) {
            this.p1Border.setVisible(true);
            this.p1Border.setPosition(p1.x, p1.y);
            this.p1Border.setScale(0.5 * (p1.scaleX / 0.1)); // keep frame proportional if you change potion scale
        }

        if (PlayersNum.players === 3 && this.selected2 != null) {
            const p2 = this.potions[this.selected2];
            if (p2) {
                this.p2Border.setVisible(true);
                this.p2Border.setPosition(p2.x, p2.y);
                this.p2Border.setScale(0.5 * (p2.scaleX / 0.1));
            }
        } else {
            this.p2Border.setVisible(false);
        }
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
