const DARK_BLUE = 0x5791FF;
const LIGHT_BLUE = 0x9bbcff;

export const colorOn = (player) => {
    const scene = player.scene;

    let t = 0;
    const speed = 2.0;

    const updateColor = (time, delta) => {
        t += delta / 1000 * speed;

        // 0 → 1 → 0
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



// export const colorOn = (player) => {
//     const scene = player.scene;

//     let t = 0;
//     const speed = 1;

//     const updateColor = (time, delta) => {
//         t += speed * (delta / 1000);

//         const tl = blueWave((t + 0.00) % 1);
//         const tr = blueWave((t + 0.20) % 1);
//         const bl = blueWave((t + 0.40) % 1);
//         const br = blueWave((t + 0.60) % 1);

//         player.setTint(tl, tr, bl, br);
//     };

//     player._colorUpdate = updateColor;
//     scene.events.on("update", updateColor);
// };

// const blueWave = (phase) => {
//     const v = (Math.sin(phase * Math.PI * 2) + 1) / 2;

//     const baseR = 5;
//     const baseG = 80;
//     const baseB = 140;

//     const ampR = 6;   
//     const ampG = 100;  
//     const ampB = 95;   

//     const r = Math.max(0, Math.min(255, Math.round(baseR + v * ampR)));
//     const g = Math.max(0, Math.min(255, Math.round(baseG + v * ampG)));
//     const b = Math.max(0, Math.min(255, Math.round(baseB + v * ampB)));

//     return Phaser.Display.Color.GetColor(r, g, b);
// };

// export const colorOff = (player) => {
//     const scene = player.scene;

//     if (player._colorUpdate) {
//         scene.events.off("update", player._colorUpdate);
//         player._colorUpdate = null;
//         player.clearTint();
//     }
// };




// export const colorOn = (player) => {
//     const scene = player.scene;

//     let h = 0;
//     const speed = 0.15;

//     const updateColor = (time, delta) => {
//         h += speed * (delta / 1000);
//         if (h >= 1) h -= 1;

//         const tl = hueToColor((h + 0.00) % 1);
//         const tr = hueToColor((h + 0.33) % 1);
//         const bl = hueToColor((h + 0.66) % 1);
//         const br = hueToColor((h + 0.99) % 1);
//         // const tl = hueToColor(h);
//         // const tr = hueToColor(h + 0.02);
//         // const bl = hueToColor(h - 0.02);
//         // const br = hueToColor(h + 0.04);

//         player.setTint(tl, tr, bl, br);
//     };

//     player._colorUpdate = updateColor;
//     scene.events.on("update", updateColor);
// };

// const hueToColor = (hue) => {
//     const { r, g, b } = Phaser.Display.Color.HSVToRGB(hue, 0.6, 1);
//     return Phaser.Display.Color.GetColor(r, g, b);
// };

// export const colorOff = (player) => {
//     const scene = player.scene;

//     if (player._colorUpdate) {
//         scene.events.off("update", player._colorUpdate);
//         player._colorUpdate = null;
//         player.clearTint();
//     }
// };



