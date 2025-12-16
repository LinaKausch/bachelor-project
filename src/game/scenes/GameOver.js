import { Scene } from 'phaser';
import Wand from '../prefabs/wand.js';
import Button from '../utils/Button.js';
import { Serial } from '../utils/Serial.js';

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    init(data) {
        this.result = data.result;
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // TITLE
        this.add.text(centerX, 120, 'Game Over', {
            fontFamily: '"Nova Square", sans-serif',
            fontSize: 60,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        //RESULT
        this.showResultScreen();
        this.setupWandInput();
        this.restartButton = new Button(this, {
            x: centerX,
            y: centerY + 200,
            width: 400,
            label: 'START OPNIEUW',
            onClick: () => this.scene.start('Potions')
        });
    }

    setupWandInput() {
        this.wand = new Wand(this);
        this.prevZ = 0;

        this.input.on('pointermove', p => {
            if (!Serial || !Serial.port) {
                this.wand.setPosition(p.x, p.y);
            }
        });

        this.input.on('pointerdown', () => {
            this.mouseCasting = true;
        });

        this.input.on('pointerup', () => {
            this.mouseCasting = false;
        });
    }

    showResultScreen() {
        const resultScreens = {
            wizard: () => this.showWizardWins(),
            single: () => this.showSingleEscape(),
            both: () => this.showBothEscape()
        };

        const screenFn = resultScreens[this.result];
        if (screenFn) screenFn();
    }

    createResultVideo(videoKey, title, titleColor = '#c685ffff') {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        const targetHeight = this.scale.height / 8;

        this.video = this.add.video(centerX, centerY, videoKey).play(true);
        const ratio = this.video.width / this.video.height;
        this.video.setDisplaySize(targetHeight * ratio, targetHeight);

        this.add.text(centerX, 100, title, {
            fontFamily: 'Arial Black',
            fontSize: 72,
            color: titleColor,
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);
    }

    update(time, delta) {
        this.wand.update(time, delta);
        this.restartButton.update(this.wand);
    }

    showWizardWins() {
        this.createResultVideo('wizard-win', 'Tovenaar Wint!');
    }
    showSingleEscape() {
        this.createResultVideo('mini-win', 'Wezens Winnen!');
    }
    showBothEscape() {
        this.createResultVideo('mini-win', 'Wezens Winnen!');
    }
}
