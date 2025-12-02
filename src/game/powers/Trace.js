export const traceOn = (player) => {
    const scene = player.scene;

    if (player._traceEmitter) return;

    let px = player.x;
    let py = player.y;

    player._traceUpdate = () => {
        px = player.x;
        py = player.y;
    };

    scene.events.on("update", player._traceUpdate);
    player._traceEmitter = scene.add.particles(0, 0, 'spark', {
        x: {
            onEmit: () => px,
            onUpdate: (particle, key, t, value) => value
        },
        y: {
            onEmit: () => py,
            onUpdate: (particle, key, t, value) => value + (t * 10)
        },
        speed: 60,
        scale: { start: 0.07, end: 0 },
        lifespan: 700,
        frequency: 30,
        blendMode: 'SCREEN'
    });

    player._traceEmitter.setDepth(player.depth - 1);
};

export const traceOff = (player) => {
    const scene = player.scene;

    if (player._traceEmitter) {
        player._traceEmitter.stop();
        player._traceEmitter.destroy();
        player._traceEmitter = null;
    }

    if (player._traceUpdate) {
        scene.events.off("update", player._traceUpdate);
        player._traceUpdate = null;
    }
};
