// export default class PlayerCounter {
//     constructor(scene, players) {
//         this.scene = scene;
//         this.players = players;

//         this.container = scene.add.container(0, 0).setDepth(100);

//         const startX = scene.scale.width / 2 - (players === 2 ? 150 : 75);
//         const y = 50;

//         for (let i = 0; i < players; i++) {
//             const x = startX + i * 150;

//             const portrait = scene.add.circle(x, y, 40, 0x4a6fa5);
//             portrait.setStrokeStyle(6, 0xffffff);


//             // const face = scene.add.image(x, y, "playerFace");
//             // face.setScale(0.3);

//             const badge = scene.add.circle(x, y + 58, 18, 0x4a6fa5);
//             badge.setStrokeStyle(4, 0xffffff);

//             const label = scene.add.text(x, y + 58, `P${i + 1}`, {
//                 fontFamily: "Arial Black",
//                 fontSize: "20px",
//                 color: "#ffffff"
//             }).setOrigin(0.5);

//             this.container.add(portrait);
//             // this.container.add(face);
//             this.container.add(badge);
//             this.container.add(label);
//         }
//     }
// }


export default class PlayerCounter {
    constructor(scene, players) {
        this.scene = scene;
        this.players = players;

        this.container = scene.add.container(0, 0).setDepth(100);

        this.cooldowns = []; // will store cooldown bars + data

        const startX = scene.scale.width / 2 - (players === 2 ? 150 : 75);
        const y = 20;

        for (let i = 0; i < players; i++) {
            const x = startX + i * 150;

            // Portrait
            const portrait = scene.add.circle(x, y, 50, 0x4a6fa5);
            portrait.setStrokeStyle(6, 0xffffff);
            this.container.add(portrait);

            // Badge
            const badge = scene.add.circle(x, y + 58, 22, 0x4a6fa5);
            badge.setStrokeStyle(4, 0xffffff);
            this.container.add(badge);

            const label = scene.add.text(x, y + 58, `P${i + 1}`, {
                fontFamily: "Arial Black",
                fontSize: "20px",
                color: "#ffffff"
            }).setOrigin(0.5);
            this.container.add(label);



            const barY = y + 115;
            const barWidth = 120;
            const barHeight = 12;

            const barBg = scene.add.graphics();
            barBg.lineStyle(4, 0xffffff);
            barBg.strokeRoundedRect(x - barWidth / 2, barY, barWidth, barHeight, 6);
            this.container.add(barBg);

            const barFill = scene.add.graphics();
            this.container.add(barFill);

            const statusText = scene.add.text(x, barY + 32, "Potion Ready", {
                fontFamily: "Arial",
                fontSize: "16px",
                color: "#ffffff"
            }).setOrigin(0.5);
            this.container.add(statusText);

            this.cooldowns.push({
                barFill,
                barWidth,
                barHeight,
                statusText,
                cooldown: 0,      
                maxCooldown: 10    
            });
        }
    }

    update(delta) {
        for (let cd of this.cooldowns) {
            if (cd.cooldown > 0) {
                cd.cooldown -= delta;

                const percent = Phaser.Math.Clamp(1 - cd.cooldown / cd.maxCooldown, 0, 1);

                cd.barFill.clear();
                cd.barFill.fillStyle(0x4a6fa5);
                cd.barFill.fillRoundedRect(
                    cd.statusText.x - cd.barWidth / 2,
                    cd.statusText.y - 32,
                    cd.barWidth * percent,
                    cd.barHeight,
                    6
                );

                cd.statusText.setText("Potion Disabled");
            } else {
                cd.cooldown = 0;
            }
        }
    }
}
