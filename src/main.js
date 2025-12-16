import StartGame from './game/main';
import { Serial } from './game/utils/Serial.js';

document.addEventListener('DOMContentLoaded', () => {

    StartGame('game-container');

    if (window.arduino) {
        Serial.start();
        return;
    }

    // Browser → user gesture required
    document.addEventListener("click", () => {
        Serial.start();
    }, { once: true });
});
