const DARK_BLUE = 0x5791FF;
const LIGHT_BLUE = 0x9bbcff;

export const colorOn = (player) => {
    const scene = player.scene;

    let t = 0;
    const speed = 2.0;

    const updateColor = (time, delta) => {
        t += delta / 1000 * speed;
        const mix = (Math.sin(t) + 1) / 2;

        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.ValueToColor(DARK_BLUE),
            Phaser.Display.Color.ValueToColor(LIGHT_BLUE),
            1,
            mix
        );

        const tint = Phaser.Display.Color.GetColor(color.r, color.g, color.b);

        player.setTint(
            tint,
            tint,
            tint,
            tint
        );
    };

    player._colorUpdate = updateColor;
    scene.events.on('update', updateColor);
};


export const colorOff = (player) => {
    const scene = player.scene;

    if (player._colorUpdate) {
        scene.events.off("update", player._colorUpdate);
        player._colorUpdate = null;
        player.clearTint();
    }
};
