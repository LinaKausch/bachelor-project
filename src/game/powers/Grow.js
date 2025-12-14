export const growOn = (player) => {
    const scene = player.scene;

    const scale = 0.7;
    const duration = 1500;
    if (!player._originalSize) {
        player._originalSize = { x: player.scaleX, y: player.scaleY };
    }

    if (player._growTween) {
        player._growTween.stop();
    }

    player._growTween = scene.tweens.add({
        targets: player,
        scaleX: player._originalSize.x * scale,
        scaleY: player._originalSize.y * scale,
        duration,
        yoyo: true,
        repeat: -1,
    });
}

export const growOff = (player) => {
    const scene = player.scene;

    if (player._growTween) {
        player._growTween.stop();
        player._growTween = null;
    }

    if (player._originalSize) {
        player.setScale(player._originalSize.x, player._originalSize.y);
    }
};