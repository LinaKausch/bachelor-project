export const glowOn = (player) => {
    const scene = player.scene;

    if (player.glowFX) {
        player.preFX.remove(player.glowFX);
        player.glowFX = null;
    }

    player.glowFX = player.preFX.addGlow(0xC2AFE5, 3, false, 0.6, 5);

    if (player._glowTween) {
        player._glowTween.stop();
    }

    scene.tweens.add({
        targets: player.glowFX,
        outerStrength: 1,
        duration: 1000,
        yoyo: true,
        repeat: -1,
    });
};

export const glowOff = (player) => {
    const scene = player.scene;
    if (player._glowTween) {
        player._glowTween.stop();
        player._glowTween = null;
    }

    if (player.glowFX) {
        player.preFX.remove(player.glowFX);
        player.glowFX = null;
    }
}