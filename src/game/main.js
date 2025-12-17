import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { Idle } from './scenes/Idle';
import { Players } from './scenes/Players';
import { AnimationOne } from './scenes/AnimationOne';
import { Potions } from './scenes/Potions';
import { AnimationTwo } from './scenes/AnimationTwo';
import { Preloader } from './scenes/Preloader';
import { AUTO, Game } from 'phaser';
import { Input, GameState } from './utils/Input.js';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        Idle,
        Players,
        AnimationOne,
        Potions,
        AnimationTwo,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent) => {

    const game = new Game({ ...config, parent });

    const timeoutMs = 30000;
    const samplePeriodMs = 500;
    const maxSamples = Math.ceil(timeoutMs / samplePeriodMs);
    const samples = [];
    let stabilityStart = null;

    const isButtonsInactive = () => (Input.btn1 === 0 && Input.btn2 === 0 && (Input.z === 0));

    const pushSample = () => {
        samples.push({ x: Input.accX ?? 128, y: Input.accY ?? 128 });
        if (samples.length > maxSamples) samples.shift();
    };

    const variance = arr => {
        const n = arr.length;
        if (n === 0) return { vx: 0, vy: 0 };
        const meanX = arr.reduce((s, v) => s + v.x, 0) / n;
        const meanY = arr.reduce((s, v) => s + v.y, 0) / n;
        const vx = arr.reduce((s, v) => s + (v.x - meanX) * (v.x - meanX), 0) / n;
        const vy = arr.reduce((s, v) => s + (v.y - meanY) * (v.y - meanY), 0) / n;
        return { vx, vy };
    };

    setInterval(() => {

        if (game.scene.isActive('Idle')) {
            stabilityStart = null;
            samples.length = 0;
            return;
        }

        pushSample();

        const { vx, vy } = variance(samples);
        const threshold = 20;
        const stable =
            Math.sqrt(vx) < threshold &&
            Math.sqrt(vy) < threshold &&
            isButtonsInactive();

        const now = performance.now();

        if (stable) {
            if (stabilityStart == null) stabilityStart = now;

            if (now - stabilityStart >= timeoutMs) {


                if (!game.scene.isActive('Idle')) {
                    GameState.demoShown = false;
                    game.scene.getScenes(true).forEach(scene => {
                        if (scene.scene.key !== 'Idle') {
                            game.scene.stop(scene.scene.key);
                        }
                    });

                    game.scene.start('Idle');
                    console.log('[Inactivity] Triggered: returning to Idle');
                }

                samples.length = 0;
                stabilityStart = null;
            }

        } else {
            stabilityStart = null;
        }

    }, samplePeriodMs);


    window.addEventListener('keydown', e => {
        if (e.code !== 'KeyF') return;

        const scale = game.scale;

        if (!scale.isFullscreen) {
            scale.startFullscreen();
        } else {
            scale.stopFullscreen();
        }
    });

    return game;

}

export default StartGame;
