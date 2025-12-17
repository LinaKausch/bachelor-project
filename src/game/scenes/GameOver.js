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

        // MUSIC
        this.music = this.sound.add('winner', { loop: true, volume: 1 });
        this.music.play();

        //RESULT
        this.showResultScreen();
        this.setupWandInput();
        
        const buttonY = this.result === 'wizard' ? centerY - 100 : centerY + 200;
        
        this.restartButton = new Button(this, {
            x: centerX,
            y: buttonY,
            width: 400,
            label: 'START OPNIEUW',
            onClick: () => {
                this.music.stop();
                this.scene.start('Potions');
            }
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

    createResultVideo(videoKey) {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        const targetHeight = this.scale.height / 8;

        this.video = this.add.video(centerX, centerY, videoKey).play(true);
        const ratio = this.video.width / this.video.height;
        this.video.setDisplaySize(targetHeight * ratio, targetHeight);

    }

    update(time, delta) {
        this.wand.update(time, delta);
        this.restartButton.update(this.wand);
    }

    showWizardWins() {
        this.createResultVideo('wizard-win');
    }
    showSingleEscape() {
        this.createResultVideo('mini-win');
    }
    showBothEscape() {
        this.createResultVideo('mini-win');
    }
}
