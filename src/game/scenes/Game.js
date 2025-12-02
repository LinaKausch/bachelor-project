import { Scene } from 'phaser';
import Player from '../prefabs/player.js';
import Npc from '../prefabs/npc.js';
import Timer from '../utils/Timer.js';
import Wand from '../prefabs/wand.js';
import Counter from '../utils/Counter.js';
import { creatureAnimation } from '../utils/CreatureAnimation.js';
import { traceOn, traceOff } from '../powers/Trace.js';
import { glowOn, glowOff } from '../powers/Glow.js';
import {growOn, growOff} from '../powers/Grow.js';
import {colorOn, colorOff} from '../powers/Color.js';

let port;
let reader;

const connectArduino = async (scene) => {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    console.log("Connected! Waiting for data...");
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        let lines = buffer.split('\n');
        buffer = lines.pop();

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("{")) {
                try {
                    const data = JSON.parse(line);
                    scene.joystickDir1 = data.p1;
                    scene.joystickDir2 = data.p2;

                    if (data.btn1 !== undefined) scene.blueBtn = data.btn1;
                    if (data.btn2 !== undefined) scene.yellowBtn = data.btn2;

                    scene.accX = data.accX;
                    scene.accY = data.accY;
                    scene.zButton = data.z;

                } catch (e) {
                    console.warn("Bad JSON:", line);
                }
            }

        }
    }

};

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


        // PLAYER 1
        this.player1 = new Player(this, 200, 200);

        this.player1.setInteractive();

        // this.player1.on('pointerdown', () => {
        //     this.poof(this.player1.x, this.player1.y);
        //     this.player1.setVisible(false);
        // });

        this.joystickDir1 = "none";
        this.joystickDir2 = "none";

        this.blueBtn = 0;  
        this.yellowBtn = 0;

        this.prevBlue = 0;
        this.prevYellow = 0;

        //PLAYER 2

        this.player2 = new Player(this, 300, 300);

        this.player2.setInteractive();

        // this.player2.on('pointerdown', () => {
        //     this.poof(this.player2.x, this.player2.y);
        //     this.player2.setVisible(false);
        // });

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
        };


        this.emitter = this.add.particles(0, 0, 'particle', {
            lifespan: 300,
            speed: { min: -100, max: 100 },
            scale: { start: 1, end: 0 },
            quantity: 0
        });

        growOn(this.player1);
        glowOn(this.player2);


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

        // TIMER
        this.timer = new Timer(120);
        this.timer.start();
        this.timer.onComplete = () => {
            console.log('Time is up!');
            this.gameOn = false;
        }

        this.timerText = this.add.text(20, 20, "Time: 120", {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#ffffff"
        });

        //COUNTER
        this.creatureCounter = new Counter(2);
        this.counterText = this.add.text(20, 60, "Found: 0 / 2", {
            fontSize: "32px",
            fontFamily: "Arial",
            color: "#ffffff"
        });

        this.input.once("pointerdown", async () => {
            try {
                await connectArduino(this);
                console.log("Joystick connected!");
            } catch (err) {
                console.error("Failed to connect:", err);
            }
        });

    }

    checkWandHit(player) {
        const circle = new Phaser.Geom.Circle(this.wand.x, this.wand.y, 20);
        return Phaser.Geom.Intersects.CircleToRectangle(circle, player.getBounds());
    }

    poof(x, y) {
        this.emitter.explode(20, x, y);
    }

    findCreature() {
        this.creatureCounter.add();
        console.log('Found:', this.creatureCounter.get());
    }

    update(time, delta) {
        const dt = delta / 1000;

        // if (Phaser.Input.Keyboard.JustDown(this.keys.enter)) {
        //     this.tempOff(this.player1, growOff, growOn, 10, 10);
        // }

        // if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        //     this.tempOff(this.player2, glowOff, glowOn, 10, 10);
        // }

        if (this.blueBtn === 1 && this.prevBlue === 0) {
            this.tempOff(this.player1, growOff, growOn, 10, 10);
        }
        if (this.yellowBtn === 1 && this.prevYellow === 0) {
            this.tempOff(this.player2, glowOff, glowOn, 10, 10);
        }
        this.prevBlue = this.blueBtn;
        this.prevYellow = this.yellowBtn;
     

        if (this.gameOn) {
            this.player1.setDirection(this.joystickDir1);
            this.player2.setDirection(this.joystickDir2);
        }

        this.player1.update(time, delta);
        this.player2.update(time, delta);


            if (this.player1.visible && this.checkWandHit(this.player1) && this.zButton === 1) {
                this.poof(this.player1.x, this.player1.y);
                this.player1.setVisible(false);
            }

        if (this.player2.visible && this.checkWandHit(this.player2) && this.zButton === 1) {
                this.poof(this.player2.x, this.player2.y);
                this.player2.setVisible(false);
            }

        this.npcs.forEach(npc =>
            npc.update(dt, this.scale.width, this.scale.height)
        )

        this.timer.update(dt);
        const timeLeft = Math.ceil(this.timer.getTimeLeft());
        this.timerText.setText("Time: " + timeLeft);

        this.wand.update(this.input.activePointer);

        this.counterText.setText(`Found: ${this.creatureCounter.get()} / ${this.creatureCounter.max}`);
    }
}
