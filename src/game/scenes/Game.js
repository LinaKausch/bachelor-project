import { Scene } from 'phaser';
import Player from '../prefabs/player.js';
import Npc from '../prefabs/npc.js';
import Timer from '../utils/Timer.js';
import Wand from '../prefabs/wand.js';
import { Serial } from '../utils/Serial.js';
import PlayerCounter from '../utils/PlayerCounter.js';
import { creatureAnimation } from '../utils/CreatureAnimation.js';
import { wiggleOn, wiggleOff, initWiggle, updateWiggle } from '../powers/Wiggle.js';
import { glowOn, glowOff } from '../powers/Glow.js';
import { growOn, growOff } from '../powers/Grow.js';
import { colorOn, colorOff } from '../powers/Color.js';
import { Input } from '../utils/Input.js';
import { ChosenPowers} from '../utils/ChosenPowers.js';
import { PlayersNum } from '../utils/PlayersNum.js';
import TimerBar from '../utils/TimerBar.js';
import { GameState } from '../utils/Input.js';


export class Game extends Scene {
    constructor() {
        super('Game');
    }

    init(data) {
        this.skipIntro = data?.skipIntro || false;
    }

    create() {
        this.bg = this.add.image(0, 0, 'game-background');
        this.bg.setOrigin(0, 0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;
        this.bg.setDepth(-10);

        creatureAnimation(this);
        initWiggle(this);

        this.gameOn = GameState.demoShown;
        this.player1Found = false;
        this.player2Found = false;

        //DEMO
        if (!GameState.demoShown) {
            GameState.demoShown = true;
            const tintRect = this.add.rectangle(
                0, 0,
                this.scale.width,
                this.scale.height,
                0x000000,
                0.7
            ).setOrigin(0).setDepth(100);

            const demo = this.add.video(
                this.scale.width / 2,
                this.scale.height / 2,
                'game-demo'
            );

            demo
                .setOrigin(0.5)
                .setScale(1)
                .setDepth(101)
                .setMute(true)
                .play();

            demo.once('complete', () => {
                this.tweens.add({
                    targets: [demo, tintRect],
                    alpha: 0,
                    duration: 500,
                    ease: 'Power2.inOut',
                    onComplete: () => {
                        demo.destroy();
                        tintRect.destroy();
                        this.gameOn = true;
                        this.timer.start();
                    }
                });
            });
        }

        //PLAYERS
        const creatureCount = PlayersNum.players === 3 ? 2 : 1;
        this.playerCounter = new PlayerCounter(this, creatureCount);

        const player1X = Phaser.Math.Between(100, this.scale.width - 100);
        const player1Y = Phaser.Math.Between(100, this.scale.height - 100);

        this.player1 = new Player(this, player1X, player1Y);
        this.player1.setInteractive();
        this.player2 = new Player(this, Phaser.Math.Between(100, this.scale.width - 100), Phaser.Math.Between(100, this.scale.height - 100));
        this.player2.setInteractive();

        if (PlayersNum.players === 2) {
            this.player2.setVisible(false);
            this.player2.active = false;
            this.player2Found = true;
        }

        this.joystickDir1 = 'none';
        this.joystickDir2 = 'none';
        this.blueBtn = 0;
        this.yellowBtn = 0;
        this.prevBlue = 0;
        this.prevYellow = 0;

        // ANTIPOWERS
        this.applyChosenPower(this.player1, ChosenPowers.p1);
        this.applyChosenPower(this.player2, ChosenPowers.p2);

        this.tempOff = (player, offFn, onFn, seconds, cooldown) => {
            if (player._isOnCooldown) return;
            if (player._powerIsOff) return;

            player._powerIsOff = true;
            offFn(player);

            player._isOnCooldown = true;

            this.time.delayedCall(seconds * 1000, () => {
                player._powerIsOff = false;
                onFn(player);

                this.time.delayedCall(cooldown * 1000, () => {
                    player._isOnCooldown = false;
                });
            });
        };

        // NPC
        this.npcs = [];

        for (let i = 0; i < 20; i++) {
            const npc = new Npc(
                this,
                Phaser.Math.Between(100, this.scale.width - 100),
                Phaser.Math.Between(100, this.scale.height - 100)
            )
            this.npcs.push(npc);
        }

        //TARGET
        this.wand = new Wand(this);

        this.input.on('pointermove', (pointer) => {
            if (!Serial || !Serial.port) {
                this.wand.x = pointer.x;
                this.wand.y = pointer.y;
            }
        });
        this.input.on('pointerdown', () => {
            if (!Serial || !Serial.port) this.mouseCasting = true;
        });
        this.input.on('pointerup', () => {
            if (!Serial || !Serial.port) this.mouseCasting = false;
        });

        // TIMER
        const timerDuration = PlayersNum.players === 3 ? 50 : 30;
        this.timer = new Timer(timerDuration);
        this.timerBar = new TimerBar(this, this.timer, { direction: 'vertical' });
        
        if (this.skipIntro || GameState.demoShown) {
            this.timer.start();
        }
    }

    checkWandHit(player) {
        const circle = new Phaser.Geom.Circle(this.wand.x, this.wand.y, 20);
        return Phaser.Geom.Intersects.CircleToRectangle(circle, player.getBounds());
    }

    update(time, delta) {
        const dt = delta / 1000;
        const tsec = time / 1000;
        updateWiggle(tsec);


        this.joystickDir1 = Input.joy1;
        this.joystickDir2 = Input.joy2;
        this.blueBtn = Input.btn1;
        this.yellowBtn = Input.btn2;
        this.zButton = Input.z;

        this.playerCounter.update(delta / 1000);


        if (this.blueBtn === 1 && this.prevBlue === 0) {
            this.activatePowerForPlayer(1, ChosenPowers.p1);
        }
        if (this.yellowBtn === 1 && this.prevYellow === 0) {
            this.activatePowerForPlayer(2, ChosenPowers.p2);
        }
        this.prevBlue = this.blueBtn;
        this.prevYellow = this.yellowBtn;


        if (this.gameOn) {
            this.player1.setDirection(this.joystickDir1);
            this.player2.setDirection(this.joystickDir2);
        }

        this.player1.update(time, delta);
        this.player2.update(time, delta);

        if (this.player1.updateCage) this.player1.updateCage();
        if (this.player2.updateCage) this.player2.updateCage();

        const cast = (this.zButton === 1) || this.mouseCasting;

        if (!this.player1Found && this.checkWandHit(this.player1) && cast) {
            this.playCaughtAnimation();
            this.attachCage(this.player1);
            this.playerCounter.greyOutProfile(0);
            this.player1.startGravityFall(this.scale.height - 60);
            this.player1Found = true;
        }

        if (!this.player2Found && this.checkWandHit(this.player2) && cast) {
            this.playCaughtAnimation();
            this.attachCage(this.player2);
            this.playerCounter.greyOutProfile(1);
            this.player2.startGravityFall(this.scale.height - 60);
            this.player2Found = true;
        }

        if (this.player1Found && this.player2Found) {
            this.time.delayedCall(800, () => {
                this.scene.start("GameOver", { result: "wizard" });
            });
        }

        this.npcs.forEach(npc =>
            npc.update(dt, this.scale.width, this.scale.height)
        )

        this.timer.update(delta / 1000);
        this.timerBar.update();

        if (this.timer.getTimeLeft() <= 0 && this.gameOn) {
            this.gameOn = false;
            this.endGame();
        }

        this.wand.update(time, delta);
    }

    applyChosenPower(player, potionIndex) {
        if (potionIndex === null) return;

        const POWER_MAP = [
            { on: glowOn, off: glowOff },
            { on: growOn, off: growOff },
            { on: wiggleOn, off: wiggleOff },
            { on: colorOn, off: colorOff }
        ];

        POWER_MAP.forEach(p => p.off(player));
        if (POWER_MAP[potionIndex]) {
            POWER_MAP[potionIndex].on(player);
        }
    }

    activatePowerForPlayer(playerNum, potionIndex) {
        const player = playerNum === 1 ? this.player1 : this.player2;
        const power = [
            { on: glowOn, off: glowOff },
            { on: growOn, off: growOff },
            { on: wiggleOn, off: wiggleOff },
            { on: colorOn, off: colorOff }
        ][potionIndex];

        if (power) {
            this.playerCounter.startCooldown(playerNum - 1, 10, 5);
            this.tempOff(player, power.off, power.on, 10, 5);
        }
    }

    playCaughtAnimation() {
        const caughtVideo = this.add.video(
            this.scale.width / 2,
            this.scale.height - 90,
            'caught'
        );

        caughtVideo
            .setOrigin(0.5)
            .setScale(0.5)
            .setDepth(5)
            .setMute(true)
            .play();

        this.time.delayedCall(3500, () => {
            caughtVideo.stop();
            caughtVideo.destroy();
        });
    }

    attachCage(player) {
        const cage = this.add.image(player.x, player.y, 'cage');
        cage.setScale(0.1);
        cage.setDepth(player.depth + 1);

        player.cage = cage;

        player.updateCage = () => {
            if (player.cage) {
                player.cage.setPosition(player.x, player.y);
            }
        };
    }

    endGame() {
        const p1Alive = !this.player1Found;
        const p2Alive = PlayersNum.players === 3 ? !this.player2Found : false;

        if (!p1Alive && !p2Alive) {
            this.scene.start("GameOver", { result: "wizard" });
            return;
        }

        if (p1Alive !== p2Alive) {
            this.scene.start("GameOver", { result: "single" });
            return;
        }

        if (p1Alive && p2Alive) {
            this.scene.start("GameOver", { result: "both" });
            return;
        }
    }



}
