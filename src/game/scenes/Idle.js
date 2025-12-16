import { Scene } from 'phaser';
import Wand from '../prefabs/wand.js';
import { Serial } from '../utils/Serial.js';
import { Input } from '../utils/Input.js';
import Button from '../utils/Button.js';

export class Idle extends Scene {
    constructor() {
        super('Idle');
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // VIDEO
        this.video = this.add.video(centerX, centerY, 'idle');
        this.video.setMute(true).setLoop(true).play();

        const targetHeight = this.scale.height / 8;
        const ratio = this.video.width / this.video.height;
        this.video.setDisplaySize(targetHeight * ratio, targetHeight);
        this.video.setDepth(-10);

        this.scale.on('resize', ({ width, height }) => {
            this.resize(width, height);
        });

        // TITLE
        this.title = this.add.text(centerX, 190, 'Mistique Minis', {
            fontFamily: '"Nova Square", sans-serif',
            fontSize: '130px',
            color: '#fbf9fcff',
        }).setOrigin(0.5);

        // BUTTON
        this.startButton = new Button(this, {
            x: centerX,
            y: centerY + 200,
            label: 'START',
            onClick: () => this.startGame()
        });

        //WAND ANIMATION
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

        // WAND CONTROL
        this.wand = new Wand(this);
        this.prevZ = 0;

        this.input.on('pointermove', p => {
            if (!Serial || !Serial.port) {
                this.wand.setPosition(p.x, p.y);
            }
        });

        this.input.on('pointerdown', () => {
            if (!Serial || !Serial.port) this.mouseCasting = true;
        });

        this.input.on('pointerup', () => {
            if (!Serial || !Serial.port) this.mouseCasting = false;
        });

        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    startGame() {
        this.scene.start('Players');
    }

    resize(width, height) {
        this.video.setPosition(width / 2, height / 2);
        this.video.setDisplaySize(width, height);
    }

    update(time, delta) {
        this.wand.update(time, delta);
        this.startButton.update(this.wand);
    }
}
