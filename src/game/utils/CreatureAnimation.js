export const creatureAnimation = (scene) => {
    scene.anims.create({
        key: 'fly-right',
        frames: scene.anims.generateFrameNumbers('fly', { start: 5, end: 8 }),
        frameRate: 30,
        repeat: 0,
    });

    scene.anims.create({
        key: 'fly-left',
        frames: scene.anims.generateFrameNumbers('fly', { start: 3, end: 0 }),
        frameRate: 30,
        repeat: 0,
    });

    scene.anims.create({
        key: 'fly-idle',
        frames: [{ key: 'fly', frame: 4 }],
        frameRate: 0,
    });
}
