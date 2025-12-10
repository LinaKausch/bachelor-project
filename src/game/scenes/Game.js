import { Scene } from 'phaser';
import Player from '../prefabs/player.js';
import Npc from '../prefabs/npc.js';
import Timer from '../utils/Timer.js';
import Wand from '../prefabs/wand.js';
import Counter from '../utils/PlayerCounter.js';
import { creatureAnimation } from '../utils/CreatureAnimation.js';
import { traceOn, traceOff } from '../powers/Trace.js';
import { glowOn, glowOff } from '../powers/Glow.js';
import { growOn, growOff } from '../powers/Grow.js';
import { colorOn, colorOff } from '../powers/Color.js';
import { Input } from '../utils/Input.js';
import { ChosenPowers } from "../utils/ChosenPowers.js";
import { PlayersNum } from '../utils/PlayersNum.js';
import TimerBar from "../utils/TimerBar.js";
import PlayerCounter from "../utils/PlayerCounter.js";




let port;
let reader;

// window.connectArduino = async () => {
//     port = await navigator.serial.requestPort();
//     await port.open({ baudRate: 9600 });

//     const textDecoder = new TextDecoderStream();
//     port.readable.pipeTo(textDecoder.writable);
//     reader = textDecoder.readable.getReader();

//     console.log("Connected! Waiting for data...");
//     let buffer = '';

//     while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += value;
//         let lines = buffer.split('\n');
//         buffer = lines.pop();

//         for (let line of lines) {
//             line = line.trim();
//             if (line.startsWith("{")) {
//                 try {
//                     const data = JSON.parse(line);
//                     console.log("JSON:", data);

//                     // scene.joystickDir1 = data.p1;
//                     // scene.joystickDir2 = data.p2;

//                     // if (data.btn1 !== undefined) scene.blueBtn = data.btn1;
//                     // if (data.btn2 !== undefined) scene.yellowBtn = data.btn2;

//                     // scene.accX = data.accX;
//                     // scene.accY = data.accY;
//                     // scene.zButton = data.z;
//                     window.joy1 = data.p1;
//                     window.joy2 = data.p2;
//                     window.btn1 = data.btn1;
//                     window.btn2 = data.btn2;
//                     window.accX = data.accX;
//                     window.accY = data.accY;
//                     window.zButton = data.z;


//                 } catch (e) {
//                     console.warn("Bad JSON:", line);
//                 }
//             }

//         }
//     }

// }

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.bg = this.add.image(0, 0, 'background');
        this.bg.setOrigin(0, 0);
        this.bg.displayWidth = this.scale.width;
        this.bg.displayHeight = this.scale.height;
        this.bg.setDepth(-10);

        creatureAnimation(this);

        this.gameOn = true;
        this.player1Found = false;
        this.player2Found = false;

        const creatureCount = PlayersNum.players === 3 ? 2 : 1;
        this.playerCounter = new PlayerCounter(this, creatureCount);

        // PLAYER 1
        this.player1 = new Player(this, 200, 200);

        this.player1.setInteractive();
        this.joystickDir1 = "none";
        this.blueBtn = 0;
        this.prevBlue = 0;

        //PLAYER 2
        this.player2 = new Player(this, 300, 300);
        this.player2.setInteractive();

        if (PlayersNum.players === 2) {
            this.player2.setVisible(false);
            this.player2.active = false;
            this.player2Found = true;
        }

        this.joystickDir2 = "none";
        this.yellowBtn = 0;
        this.prevYellow = 0;

        this.applyChosenPower(this.player1, ChosenPowers.p1);
        this.applyChosenPower(this.player2, ChosenPowers.p2);


        this.keys = this.input.keyboard.addKeys({
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

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
        }


        this.emitter = this.add.particles(0, 0, 'particle', {
            lifespan: 300,
            speed: { min: -100, max: 100 },
            scale: { start: 1, end: 0 },
            quantity: 0
        });

        // growOn(this.player1);
        // glowOn(this.player2);


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

        //Mouse
        this.input.on("pointermove", (pointer) => {
            this.wand.x = pointer.x;
            this.wand.y = pointer.y;
        });
        this.input.on("pointerdown", () => {
            this.mouseCasting = true;
        });

        this.input.on("pointerup", () => {
            this.mouseCasting = false;
        });
        //

        // TIMER
        this.timer = new Timer(120);
        this.timerBar = new TimerBar(this, this.timer);
        this.timer.start();


        //COOLDOWN
        this.playerCounter.cooldowns[0].cooldown = 10;
        if (PlayersNum.players === 3) {
            this.playerCounter.cooldowns[1].cooldown = 10;
        }

        // this.timerText = this.add.text(20, 20, "Time: 120", {
        //     fontSize: "32px",
        //     fontFamily: "Arial",
        //     color: "#ffffff"
        // });

        //COUNTER
        // this.creatureCounter = new Counter(2);
        // this.counterText = this.add.text(20, 60, "Found: 0 / 2", {
        //     fontSize: "32px",
        //     fontFamily: "Arial",
        //     color: "#ffffff"
        // });

    }

    checkWandHit(player) {
        const circle = new Phaser.Geom.Circle(this.wand.x, this.wand.y, 20);
        return Phaser.Geom.Intersects.CircleToRectangle(circle, player.getBounds());
    }

    poof(x, y) {
        this.emitter.explode(20, x, y);
        // const fx = this.postFX.addGlow(0x66ffcc, 1, 2, 2);
        //     this.tweens.add({
        //         targets: fx,
        //         outerStrength: 1.0,
        //         duration: 500,
        //         yoyo: true,
        //         repeat: -1
        //     });
    }



    findCreature() {
        this.creatureCounter.add();
        console.log('Found:', this.creatureCounter.get());
    }

    update(time, delta) {
        const dt = delta / 1000;

        this.joystickDir1 = Input.joy1;
        this.joystickDir2 = Input.joy2;
        this.blueBtn = Input.btn1;
        this.yellowBtn = Input.btn2;
        this.zButton = Input.z;

        this.playerCounter.update(delta / 1000);


        if (this.blueBtn === 1 && this.prevBlue === 0) {
            const power = this.getPower(ChosenPowers.p1);
            if (power) this.tempOff(this.player1, power.off, power.on, 10, 10);
        }
        if (this.yellowBtn === 1 && this.prevYellow === 0) {
            const power = this.getPower(ChosenPowers.p2);
            if (power) this.tempOff(this.player2, power.off, power.on, 10, 10);
        }
        this.prevBlue = this.blueBtn;
        this.prevYellow = this.yellowBtn;


        if (this.gameOn) {
            this.player1.setDirection(this.joystickDir1);
            this.player2.setDirection(this.joystickDir2);
        }

        this.player1.update(time, delta);
        this.player2.update(time, delta);


        const cast = (this.zButton === 1) || this.mouseCasting;


        if (!this.player1Found && this.player1.visible && this.checkWandHit(this.player1) && cast) {
            this.poof(this.player1.x, this.player1.y);
            this.player1Found = true;
            this.player1.setVisible(false);
        }

        if (!this.player2Found && this.player2.visible && this.checkWandHit(this.player2) && cast) {
            this.poof(this.player2.x, this.player2.y);
            this.player2Found = true;
            this.player2.setVisible(false);
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

    getPower(index) {
        switch (index) {
            case 0: return { on: glowOn, off: glowOff };
            case 1: return { on: growOn, off: growOff };
            case 2: return { on: traceOn, off: traceOff };
            case 3: return { on: colorOn, off: colorOff };
            default: return null;
        }
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
