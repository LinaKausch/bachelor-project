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
            
            this.cooldowns.push({
                face,
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
                    this.scene.sound.play('antipower-on', { volume: 1 });
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

        this.scene.sound.play('antipower-off', { volume: 1 });
    }

    greyOutProfile(index) {
        const cd = this.cooldowns[index];
        if (!cd) return;
        
        cd.face.setTint(0x808080);
        cd.back.setTint(0x808080);
    }

}
