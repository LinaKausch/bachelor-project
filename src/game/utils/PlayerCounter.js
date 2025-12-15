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

        this.cooldowns = [];

        const startX = scene.scale.width / 2 - (players === 2 ? 150 : 75);
        const y = 90;

        for (let i = 0; i < players; i++) {
            const x = startX + i * 150;


            const face = scene.add.image(x, y, `profile${i + 1}`);
            face.setOrigin(0.5);
            face.setScale(1.1);
            face.setDepth(21);

            const back = scene.add.image(x, y, 'prof-bg');
            back.setOrigin(0.5);
            back.setScale(1.1);
            back.setDepth(20);
            const width = back.displayWidth;
            const height = back.displayHeight;


            // Mask graphics
            const maskGfx = scene.add.graphics();
            maskGfx.setVisible(false);
            

            const mask = maskGfx.createGeometryMask();
            back.setMask(mask);
            maskGfx.clear();
            maskGfx.fillStyle(0xffffff);
            maskGfx.fillRect(
                x - width / 2,
                y - height / 2,
                width,
                height
            );
            

            // const statusText = scene.add.text(x, barY + 32, "Potion Ready", {
            //     fontFamily: "Arial",
            //     fontSize: "16px",
            //     color: "#ffffff"
            // }).setOrigin(0.5);
            // this.container.add(statusText);
            this.cooldowns.push({
                back,
                maskGfx,
                x,
                y,
                width,
                fullHeight: height,
                level: 1,
                state: 'ready',
                drainTotal: 0,
                rechargeTotal: 0
            });


        }
    }

    update(delta) {
        for (let cd of this.cooldowns) {

            if (cd.state === 'draining') {
                cd.level -= delta / cd.drainTotal;

                if (cd.level <= 0) {
                    cd.level = 0;
                    cd.state = 'recharging';
                }
            }

            else if (cd.state === 'recharging') {
                cd.level += delta / cd.rechargeTotal;

                if (cd.level >= 1) {
                    cd.level = 1;
                    cd.state = 'ready';
                }
            }

            cd.maskGfx.clear();
            cd.maskGfx.fillStyle(0xffffff);

            const visibleHeight = cd.fullHeight * cd.level;
            const top = cd.y + cd.fullHeight / 2 - visibleHeight;

            cd.maskGfx.fillRect(
                cd.x - cd.width / 2,
                top,
                cd.width,
                visibleHeight
            );
        }
    }


    startCooldown(index, drainSeconds = 10, rechargeSeconds = 5) {
        const cd = this.cooldowns[index];
        if (!cd || cd.state !== 'ready') return;

        cd.state = 'draining';
        cd.drainTotal = drainSeconds;
        cd.rechargeTotal = rechargeSeconds;
        cd.level = 1;
    }


    // update(delta) {
    //     for (let cd of this.cooldowns) {

    //         if (cd.state === 'draining') {
    //             cd.drainRemaining -= delta;
    //             cd.level = Phaser.Math.Clamp(cd.drainRemaining / cd.drainTotal, 0, 1);

    //             if (cd.drainRemaining <= 0) {
    //                 cd.state = 'recharging';
    //             }
    //         }

    //         else if (cd.state === 'recharging') {
    //             cd.rechargeRemaining -= delta;
    //             cd.level = 1 - Phaser.Math.Clamp(cd.rechargeRemaining / cd.rechargeTotal, 0, 1);

    //             if (cd.rechargeRemaining <= 0) {
    //                 cd.state = 'ready';
    //                 cd.level = 1;
    //             }
    //         }

      
    //         cd.maskGfx.clear();
    //         cd.maskGfx.fillStyle(0xffffff);


    //         const startAngle = -Math.PI / 2;
    //         const endAngle = startAngle + Math.PI * 2 * cd.level;

    //         cd.maskGfx.beginPath();
    //         cd.maskGfx.moveTo(cd.x, cd.y);
    //         cd.maskGfx.arc(cd.x, cd.y, cd.radius, startAngle, endAngle, false);
    //         cd.maskGfx.closePath();
    //         cd.maskGfx.fillPath();

    //     }
    // }


    // update(delta) {
    //     for (let cd of this.cooldowns) {
    //         // handle draining (bar goes down)
    //         if (cd.state === 'draining') {
    //             cd.drainRemaining = Math.max(0, cd.drainRemaining - delta);
    //             cd.level = cd.drainRemaining > 0 ? cd.drainRemaining / cd.drainTotal : 0;

    //             if (cd.drainRemaining <= 0) {
    //                 cd.state = 'recharging';
    //                 cd.rechargeRemaining = cd.rechargeTotal;
    //             }
    //         }

    //         // handle recharging (bar goes up)
    //         if (cd.state === 'recharging') {
    //             cd.rechargeRemaining = Math.max(0, cd.rechargeRemaining - delta);

    //             cd.level = cd.rechargeTotal > 0
    //                 ? 1 - (cd.rechargeRemaining / cd.rechargeTotal)
    //                 : 1;

    //             if (cd.rechargeRemaining <= 0) {
    //                 cd.state = 'ready';
    //                 cd.level = 1;
    //             }
    //         }

    //         // draw fill from left edge based on level
    //         cd.barFill.clear();
    //         cd.barFill.fillStyle(0x4a6fa5);
    //         const fillW = cd.barWidth * Phaser.Math.Clamp(cd.level, 0, 1);
    //         const fillX = cd.x - cd.barWidth / 2;
    //         const fillY = cd.barY;
    //         if (fillW > 0) {
    //             cd.barFill.fillRoundedRect(
    //                 fillX,
    //                 fillY,
    //                 fillW,
    //                 cd.barHeight,
    //                 6
    //             );
    //         }
    //     }
    // }

    // startCooldown(index, drainSeconds = 10, rechargeSeconds = 5) {
    //     const cd = this.cooldowns[index];
    //     if (!cd || cd.state !== 'ready') return;

    //     cd.state = 'draining';

    //     cd.drainTotal = drainSeconds;
    //     cd.drainRemaining = drainSeconds;

    //     cd.rechargeTotal = rechargeSeconds;
    //     cd.rechargeRemaining = rechargeSeconds;

    //     cd.level = 1; // start full, then drain
    // }

}
