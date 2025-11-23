import { Scene } from 'phaser';
import Player from '../prefabs/player.js';
import Npc from '../prefabs/npc.js';
import Timer from '../utils/Timer.js';
import Wand from '../prefabs/wand.js';
import Counter from '../utils/Counter.js';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        // PLAYER
        this.player = new Player(this);

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
        }

        //COUNTER
        this.creatureCounter = new Counter(2);

    }

    findCreature() {
        this.creatureCounter.add();
        console.log('Found:', this.creatureCounter.get());
    }

    update(time, delta) {
        const dt = delta / 1000;

        this.player.update(time, delta);

        this.npcs.forEach(npc =>
            npc.update(dt, this.scale.width, this.scale.height)
        )

        this.timer.update(dt);
        // console.log(this.timer.getTimeLeft());

        this.wand.update(this.input.activePointer);
    }
}
