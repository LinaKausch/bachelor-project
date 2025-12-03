import StartGame from './game/main';
import { Serial } from './game/utils/Serial.js';

document.addEventListener('DOMContentLoaded', () => {

    StartGame('game-container');

    document.addEventListener("click", () => {
        Serial.start();
    }, { once: true });

});