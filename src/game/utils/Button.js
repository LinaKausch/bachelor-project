import Phaser from 'phaser';
import { Input } from '../utils/Input.js';

export default class Button {
    constructor(scene, {
        x,
        y,
        width = 300,
        height = 90,
        label = 'BUTTON',
        data = null,
        onClick
    }) {
        this.scene = scene;
        this.onClick = onClick;
        this.data = data;
        this.prevZ = 0;

        // BACKGROUND
        this.bg = scene.add.graphics();
        this.bg.fillStyle(0xdedcff, 1);
        this.bg.fillRoundedRect(
            x - width / 2,
            y - height / 2,
            width,
            height,
            30
        );
        this.bg.lineStyle(6, 0x000000);
        this.bg.strokeRoundedRect(
            x - width / 2,
            y - height / 2,
            width,
            height,
            30
        );

        // TEXT
        this.text = scene.add.text(x, y, label, {
            fontFamily: '"Nunito", sans-serif',
            fontSize: 40,
            fontStyle: 'bold',
            color: '#000000'
        }).setOrigin(0.5);

        // INTERACTION ZONE
        this.zone = scene.add.zone(x, y, width, height)
            .setOrigin(0.5)
            .setInteractive();

        this.hovered = false;
    }

    update(wand) {
        const wandCircle = new Phaser.Geom.Circle(wand.x, wand.y, 20);
        const bounds = this.zone.getBounds();

        const over = Phaser.Geom.Intersects.CircleToRectangle(
            wandCircle,
            bounds
        );

        // Hover feedback
        // if (over && !this.hovered) {
        //     this.hovered = true;
        //     this.bg.setAlpha(0.8);
        // }

        // if (!over && this.hovered) {
        //     this.hovered = false;
        //     this.bg.setAlpha(1);
        // }

        // Z press detection
        const z = Input.z ?? 0;
        if (over && z === 1 && this.prevZ === 0) {
            this.onClick?.();
        }

        this.prevZ = z;
    }

    destroy() {
        this.bg.destroy();
        this.text.destroy();
        this.zone.destroy();
    }
}
