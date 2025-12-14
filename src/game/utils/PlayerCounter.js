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
            portrait.setStrokeStyle(2, 0xffffff);
            this.container.add(portrait);

            // Badge
            const badge = scene.add.circle(x, y + 58, 22, 0x4a6fa5);
            badge.setStrokeStyle(2, 0xffffff);
            this.container.add(badge);

            const label = scene.add.text(x, y + 58, `P${i + 1}`, {
                fontFamily: "Arial Black",
                fontSize: "20px",
                color: "#ffffff"
            }).setOrigin(0.5);
            this.container.add(label);


            const barY = y + 95;
            const barWidth = 120;
            const barHeight = 12;

            const barBg = scene.add.graphics();
            barBg.lineStyle(2, 0xffffff);
            barBg.strokeRoundedRect(x - barWidth / 2, barY, barWidth, barHeight, 6);
            this.container.add(barBg);

            const barFill = scene.add.graphics();
            this.container.add(barFill);

            // const statusText = scene.add.text(x, barY + 32, "Potion Ready", {
            //     fontFamily: "Arial",
            //     fontSize: "16px",
            //     color: "#ffffff"
            // }).setOrigin(0.5);
            // this.container.add(statusText);

            this.cooldowns.push({
                barFill,
                barWidth,
                barHeight,
                // store coordinates for drawing
                x,
                barY,
                // level: 1 = full/ready, 0 = empty
                level: 1,
                // state: 'ready' | 'draining' | 'recharging'
                state: 'ready',
                // timing parameters (seconds)
                drainTotal: 0,
                drainRemaining: 0,
                rechargeTotal: 0,
                rechargeRemaining: 0
            });
        }
    }

    update(delta) {
        for (let cd of this.cooldowns) {
            // handle draining (bar goes down)
            if (cd.state === 'draining') {
                cd.drainRemaining = Math.max(0, cd.drainRemaining - delta);
                cd.level = cd.drainRemaining > 0 ? cd.drainRemaining / cd.drainTotal : 0;

                if (cd.drainRemaining <= 0) {
                    cd.state = 'recharging';
                    cd.rechargeRemaining = cd.rechargeTotal;
                }
            }

            // handle recharging (bar goes up)
            if (cd.state === 'recharging') {
                cd.rechargeRemaining = Math.max(0, cd.rechargeRemaining - delta);

                cd.level = cd.rechargeTotal > 0
                    ? 1 - (cd.rechargeRemaining / cd.rechargeTotal)
                    : 1;

                if (cd.rechargeRemaining <= 0) {
                    cd.state = 'ready';
                    cd.level = 1;
                }
            }

            // draw fill from left edge based on level
            cd.barFill.clear();
            cd.barFill.fillStyle(0x4a6fa5);
            const fillW = cd.barWidth * Phaser.Math.Clamp(cd.level, 0, 1);
            const fillX = cd.x - cd.barWidth / 2;
            const fillY = cd.barY;
            if (fillW > 0) {
                cd.barFill.fillRoundedRect(
                    fillX,
                    fillY,
                    fillW,
                    cd.barHeight,
                    6
                );
            }
        }
    }

    startCooldown(index, drainSeconds = 10, rechargeSeconds = 5) {
        const cd = this.cooldowns[index];
        if (!cd) return;
        cd.state = 'draining';
        cd.drainTotal = drainSeconds;
        cd.drainRemaining = drainSeconds;
        cd.rechargeTotal = rechargeSeconds;
        cd.rechargeRemaining = 0;
        cd.level = 1;
    }
}
