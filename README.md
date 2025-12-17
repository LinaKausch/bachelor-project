# MISTIQUE MINIS GAME

Mistique Minis is a game created by three Digital Design and Development students as a bachelor project for ***JEF (Jeugdfilmfestival Antwerpen)***. The game was originally designed as an **audiovisual installation** for the festival and
is built to be played on a **1920×1080 screen** using physical controllers.

![Gameplay screenshot](./installation.png)

## Game Overview

Mistique Minis is a **2D multiplayer game** built with **Phaser** and **Vite**.
The game is packaged using Electron to run as a standalone desktop application
for a stable full-screen installation setup.

Players take on different roles:
- **Wizard** – controlled via a Wii Nunchuck
- **Creatures (Flapke & Snufke)** – controlled via Arduino-based inputs (joysticks and buttons)

The game supports **2 or 3 players** and focuses on hiding, avoiding, and quick reactions.

 ## Gameplay

### Roles & Objectives
- **Wizard**: Catch all real creature players using spells
- **Creatures**: Avoid the wizard and blend in with NPC creatures

### Game Flow
1. The wizard starts the game in the **Idle** scene
2. The Wizard choose the number of participants
3. A first part of animated story introducing the game
4. Creature players select a potion within **20 seconds**
5. Second part of animated story + countdown
6. Main game starts
7. The game ends when:
   - Time runs out (Creatures win), or
   - All creatures are caught (Wizard wins)
8. If the button play again pressed in GameOver scene it takes players to the potions scene
9. If the game is not interacted for some time it restarts and shows Idle screen again.


### Game Scenes

| Scenes | Description |
|--------|-------------|
| `Idle.js` | Starts the game, made mainly as a title screen invinting to play. |
| `Players.js` | Choose how many players going to play 2 or 3. |
| `Potions.js` | Choose 'personalisation' which is secretly a way to stand out. |
| `Game.js` | Game itself, creatures avoids wizard spells by controlling with joystick and button and wizard tries catching them by controling with Nunchuck accelerometer. |
| `GameOver.js` | Shows who won with possible 2 outcomes either Creatures or Wizard |

## Controls and Hardware 

### Technical Setup

- **Game Engine**: [Phaser](https://phaser.io/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Desktop Wrapper**: [Electron](https://www.electronjs.org/) 
- **Language**: JavaScript
- **Input**: Arduino type chip
- **Resolution**: 1920×1080 (fixed for installation use)

### Controls 

The game is controlled using [Arduino](https://www.arduino.cc/)-based inputs via Serial.

- 2 arcade joysticks (for each creature player)
- 2 arcade buttons + LED lights (for each creature player)
- Wii Nunchuck (Accelerometer + Z button)

### Phaser
- Managing scenes (Idle, Players, Potions, Game, GameOver)
- Animating characters via spritesheets
- Rendering visuals
- Handeling physics and movements

## Made by

- **Kristina Lednicka** - UX/UI
- **Sebastiaan Putman** - Visuals & Animation
- **Lina Kausch** - Development
