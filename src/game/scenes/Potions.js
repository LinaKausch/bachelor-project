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
        this.p1Locked = false;
        this.p2Locked = false;
        this.p1LeftHeld = false;
        this.p1RightHeld = false;
        this.p2LeftHeld = false;
        this.p2RightHeld = false;

        creatureAnimation(this);
        initWiggle(this);

        //POTION SELECTION CARD
        const card = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'potion-bg'
        ).setDepth(5).setScale(0.5, 0.4);

        //TITLE
        this.add.text(
            card.x,
            card.y - card.displayHeight / 2 + 50,
            'Selecteer jouw toverdrankje',
            {
                fontFamily: '"Nunito", sans-serif',
                fontSize: '26px',
                color: '#2e2a3a'
            }
        ).setOrigin(0.5).setDepth(6);


        //SELECTION BORDERS
        this.p1Border = this.add.image(0, 0, 'p1-frame').setDepth(25).setScale(0.4);
        this.p2Border = this.add.image(0, 0, 'p2-frame').setDepth(25).setScale(0.4);

        this.selected1 = 0;
        this.selected2 = 3;

        //POTIONS
        const potionKeys = ['glow', 'grow', 'trace', 'colour'];
        this.potions = potionKeys.map(key => this.add.image(0, 0, key));
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


        //MOUSE HOVER
        this.potions.forEach((potion, index) => {
            potion.setInteractive();
            potion.on('pointerover', () => this.previewPower(this.player1, index));
            potion.on('pointerout', () => this.clearPowers(this.player1));
        });


        //DEMO
        this.add.video(
            this.scale.width / 2,
            this.scale.height - 100,
            'potion-demo'
        ).setScale(0.2).play(true);

        //PLAYERS
        this.players = [];
        this.statusTexts = [];

        const playerData = [
            { x: 350, label: 'Speler 1', name: 'Flapke' },
            ...(PlayersNum.players === 3 ? [{ x: this.scale.width - 350, label: 'Speler 2', name: 'Snufke' }] : [])
        ];

        playerData.forEach(data => {
            this.createPlayerUI(data.x, data.label, data.name);
            const player = new Player(this, data.x, this.scale.height / 2);
            player.setScale(0.3).setVisible(true).setOrigin(0.5);
            player.active = true;
            this.players.push(player);
        });

        this.p1Status = this.statusTexts[0];
        this.p2Status = this.statusTexts[1] || null;

        this.player1 = this.players[0];
        this.player2 = this.players[1] ?? null;
        if (this.player1) this.player1.setDepth(1);
        if (this.player2) this.player2.setDepth(1);

        this.selected1 = 0;
        this.selected2 = PlayersNum.players === 3 ? 3 : null;

        this.updateBorders();

        //TIMER
        this.timer = new Timer(20);
        this.timerBar = new TimerBar(this, this.timer);
        this.timer.start();

        this.timer.onComplete = () => {

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

        this.handleJoystick(joystickDir1, 1);
        if (PlayersNum.players === 3) {
            this.handleJoystick(joystickDir2, 2);
        }

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

    createPlayerUI(x, label, name) {
        if (!this.statusTexts) this.statusTexts = [];

        this.add.image(x, 200, 'title-e').setOrigin(0.5).setScale(0.4);

        this.add.text(x, 180, label, {
            fontFamily: '"Nunito", sans-serif',
            fontSize: '24px',
            color: '#1E192F'
        }).setOrigin(0.5).setDepth(50);

        this.add.text(x, 215, name, {
            fontFamily: '"Nunito", sans-serif',
            fontSize: '20px',
            color: '#2347C2'
        }).setOrigin(0.5).setDepth(50);

        const statusText = this.add.text(x, this.scale.height / 2 + 200, 'NIET KLAAR', {
            fontFamily: '"Nunito", sans-serif',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.statusTexts.push(statusText);
    }

    handleJoystick(direction, playerNum) {
        const selectedKey = playerNum === 1 ? 'selected1' : 'selected2';
        const leftHeldKey = `p${playerNum}LeftHeld`;
        const rightHeldKey = `p${playerNum}RightHeld`;
        const player = playerNum === 1 ? this.player1 : this.player2;

        if (direction === 'left' && !this[leftHeldKey]) {
            this[selectedKey] = Math.max(0, this[selectedKey] - 1);
            this[leftHeldKey] = true;
            this.previewPower(player, this[selectedKey]);
            this.updateBorders();
            this.sound.play('potion-selection', { volume: 0.5 });
        }
        if (direction !== 'left') this[leftHeldKey] = false;

        if (direction === 'right' && !this[rightHeldKey]) {
            this[selectedKey] = Math.min(3, this[selectedKey] + 1);
            this[rightHeldKey] = true;
            this.previewPower(player, this[selectedKey]);
            this.updateBorders();
            this.sound.play('potion-selection', { volume: 0.5 });
        }
        if (direction !== 'right') this[rightHeldKey] = false;
    }

    updateBorders = () => {
        const p1 = this.potions[this.selected1];
        if (p1) {
            this.p1Border.setVisible(true);
            this.p1Border.setPosition(p1.x, p1.y);
            this.p1Border.setScale(0.5 * (p1.scaleX / 0.1));
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

    clearPowers(player) {
        glowOff(player);
        growOff(player);
        wiggleOff(player);
        colorOff(player);
    }

    previewPower(player, potionIndex) {
        this.clearPowers(player);

        switch (potionIndex) {
            case 0: glowOn(player); break;
            case 1: growOn(player); break;
            case 2: wiggleOn(player); break;
            case 3: colorOn(player); break;
        }
    }

    applyPower(playerNumber, potionIndex) {
        const player = playerNumber === 1 ? this.player1 : this.player2;
        this.clearPowers(player);

        switch (potionIndex) {
            case 0: glowOn(player); break;
            case 1: growOn(player); break;
            case 2: wiggleOn(player); break;
            case 3: colorOn(player); break;
        }

        ChosenPowers[`p${playerNumber}`] = potionIndex;

        if (this.p1Locked && this.p2Locked) {
            this.time.delayedCall(300, () => {
                this.scene.start("AnimationTwo");
            });
        }

        console.log(`Player ${playerNumber} selected potion ${potionIndex}`);
    }

}
