// export const color = (player) => {
//     const scene = player.scene;

//     scene.tweens.addCounter({
//         from: 0,
//         to: 255,
//         duration: 1000,
//         repeat: -1,
//         yoyo: true,
//         onUpdate: tween => {
//             const value = Math.floor(tween.getValue());
//             player.setTint(Phaser.Display.Color.GetColor(value, 255 - value, 150));
//         }
//     });
// };






export const colorOn = (player) => {
    const scene = player.scene;

    let h = 0;
    const speed = 0.15;

    const updateColor = (time, delta) => {
        h += speed * (delta / 1000);
        if (h >= 1) h -= 1;

        const tl = hueToColor((h + 0.00) % 1);
        const tr = hueToColor((h + 0.33) % 1);
        const bl = hueToColor((h + 0.66) % 1);
        const br = hueToColor((h + 0.99) % 1);

        player.setTint(tl, tr, bl, br);
    };

    player._colorUpdate = updateColor;
    scene.events.on("update", updateColor);
};

const hueToColor = (hue) => {
    const { r, g, b } = Phaser.Display.Color.HSVToRGB(hue, 0.6, 1);
    return Phaser.Display.Color.GetColor(r, g, b);
};

export const colorOff = (player) => {
    const scene = player.scene;

    if (player._colorUpdate) {
        scene.events.off("update", player._colorUpdate);
        player._colorUpdate = null;
        player.clearTint();
    }
};








// export const color = (player) => {
//     const scene = player.scene;

//     let h = 0;

//     const speed = 0.55;

//     scene.events.on('update', (time, delta) => {
//   
//         h += speed * (delta / 1000);

//        
//         h = h % 1;

//     
//         const tl = hueToColor((h + 0.00) % 1);
//         const tr = hueToColor((h + 0.25) % 1);
//         const bl = hueToColor((h + 0.50) % 1);
//         const br = hueToColor((h + 0.75) % 1);

//         player.setTint(tl, tr, bl, br);
//     });
// };
// const hueToColor = (h) => {
//     const { r, g, b } = Phaser.Display.Color.HSVToRGB(h, 1, 1);
//     return Phaser.Display.Color.GetColor(r, g, b);
// };


