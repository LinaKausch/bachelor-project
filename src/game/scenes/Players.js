import { Scene } from 'phaser';
import { PlayersNum } from '../utils/PlayersNum.js';
import Wand from '../prefabs/wand.js';
import { Serial } from '../utils/Serial.js';
import { Input } from '../utils/Input.js';
import Button from '../utils/Button.js';


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
        this.add.text(centerX, 150, "Hoeveel Spelers?", {
            fontFamily: 'Nova Square, sans-serif',
            fontSize: 80,
            color: '#fbf9fcff',
        }).setOrigin(0.5);

        //PLAYERS OPTIONS
        const optionsData = [
            { count: 3, x: centerX - 310 },
            { count: 2, x: centerX + 310 }
        ];

        this.playerSprites = {};

        optionsData.forEach(({ count, x }) => {
            const back = this.add.image(x, this.scale.height / 2, `back-${count}p`).setScale(1);
            const front = this.add.image(x, this.scale.height / 2, `front-${count}p`).setScale(1);
            this.playerSprites[count] = { back, front };
        });

        //BUTTONS
        const buttonY = this.scale.height / 2 + 250;
        this.button3P = new Button(this, {
            x: this.playerSprites[3].back.x,
            y: buttonY,
            label: '3 SPELERS',
            data: { players: 3 },
            onClick: (data) => this.startGame(data.players)
        });

        this.button2P = new Button(this, {
            x: this.playerSprites[2].back.x,
            y: buttonY,
            label: '2 SPELERS',
            data: { players: 2 },
            onClick: (data) => this.startGame(data.players)
        });

        this.options = [
            {
                image: this.playerSprites[3].front,
                hitAreas: [
                    () => this.playerSprites[3].front.getBounds(),
                    () => this.button3P.zone.getBounds()
                ],
                onSelect: () => this.startGame(3)
            },
            {
                image: this.playerSprites[2].front,
                hitAreas: [
                    () => this.playerSprites[2].front.getBounds(),
                    () => this.button2P.zone.getBounds()
                ],
                onSelect: () => this.startGame(2)
            }
        ];

        this.prevZ = 0;

        //WAND CONTROL ANIMATION
        if (!this.anims.exists('wand-move')) {
            this.anims.create({
                key: 'wand-move',
                frames: [
                    { key: 'wand-move', frame: 0 },
                    { key: 'wand-move', frame: 1 },
                    { key: 'wand-move', frame: 2 },
                    { key: 'wand-move', frame: 1 },
                    { key: 'wand-move', frame: 0 }
                ],
                frameRate: 4,
                repeat: -1
            });
        }

        const wand = this.add.sprite(
            this.scale.width / 2,
            this.scale.height / 2,
            'wand-move'
        );
        wand.setScale(0.09);
        wand.setOrigin(0.5);
        wand.setDepth(50);
        wand.play('wand-move');


        //WAND TARGET
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

    startGame(playerCount) {
        PlayersNum.players = playerCount;
        this.scene.start('AnimationOne');
    }

    update(time, delta) {
        this.wand.update(time, delta);

        const wandCircle = new Phaser.Geom.Circle(this.wand.x, this.wand.y, 20);
        const z = Input.z;

        let hoveredOption = null;

        this.options.forEach(opt => {
            opt.image.setAlpha(0.6);

            const isOver = opt.hitAreas.some(getBounds =>
                Phaser.Geom.Intersects.CircleToRectangle(
                    wandCircle,
                    getBounds()
                )
            );

            if (isOver) {
                opt.image.setAlpha(1);
                hoveredOption = opt;
            }
        });

        if (z === 1 && this.prevZ === 0 && hoveredOption) {
            hoveredOption.onSelect();
        }

        this.prevZ = z;
    }
}
