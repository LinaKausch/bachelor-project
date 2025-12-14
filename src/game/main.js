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

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
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

    const game =new Game({ ...config, parent });

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
