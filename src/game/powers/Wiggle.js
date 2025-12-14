import WigglePipeline from '../shaders/WigglePipeline.js';

let _wigglePipe = null;

export const initWiggle = (scene) => {
    if (!scene || !scene.game || !scene.game.renderer) return;

    // If already initialized, do nothing
    if (_wigglePipe) return _wigglePipe;

    // Register the wiggle pipeline only when WebGL renderer is active.
    try {
        if (scene.game && scene.game.renderer && scene.game.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
            const pipeInstance = new WigglePipeline(scene.game);
            if (typeof scene.game.renderer.addPipeline === 'function') {
                _wigglePipe = scene.game.renderer.addPipeline('WigglePipeline', pipeInstance);
            } else if (scene.game.renderer.pipelines && typeof scene.game.renderer.pipelines.add === 'function') {
                _wigglePipe = scene.game.renderer.pipelines.add('WigglePipeline', pipeInstance);
            } else if (scene.game.renderer.pipelines && typeof scene.game.renderer.pipelines.register === 'function') {
                scene.game.renderer.pipelines.register('WigglePipeline', pipeInstance);
                _wigglePipe = pipeInstance;
            } else {
                console.warn('No supported pipeline registration API found. Wiggle pipeline not registered.');
            }
        } else {
            console.warn('WebGL renderer not available — skipping wiggle pipeline registration.');
        }
    } catch (err) {
        console.warn('Error initializing wiggle pipeline', err);
    }

    return _wigglePipe;
};

export const updateWiggle = (timeSec) => {
    if (!_wigglePipe) return;

    if (typeof _wigglePipe.setFloat1 === 'function') {
        _wigglePipe.setFloat1('time', timeSec);
    } else if (typeof _wigglePipe.set1f === 'function') {
        _wigglePipe.set1f('time', timeSec);
    } else if (typeof _wigglePipe.setFloatUniform === 'function') {
        _wigglePipe.setFloatUniform('time', timeSec);
    }
};

export const wiggleOn = (player) => {
    if (!player || !player.scene) return;

    if (player._wiggleOn) return;

    player._wiggleOn = true;

    player.setPipeline('WigglePipeline');
};

export const wiggleOff = (player) => {
    if (!player || !player.scene) return;

    if (!player._wiggleOn) return;

    player._wiggleOn = false;

    // Reset to default pipeline
    player.resetPipeline();
};
// export const wiggleOn = (player) => {
//     const scene = player.scene;

//     player._wiggleOn = true;

//     player.setPipeline('WigglePipeline');
// };

// export const wiggleOff = (player) => {
//     const scene = player.scene;

//     player._wiggleOn = false;

//     // Reset to default pipeline
//     player.resetPipeline();
// };