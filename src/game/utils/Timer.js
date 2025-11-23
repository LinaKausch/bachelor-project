export default class Timer {
    consturctor(duration = 60) {
        this.duration = duration;
        this.elapsed = 0;
        this.running = false;
    }

    start() {
        this.elapsed = 0;
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    update(dt) {
        if (!this.running) return;
        this.elapsed += dt;
        if (this.elapsed >= this.duration) {
            this.running = false;
            this.onComplete?.();
        }
    }

    getTimeLeft() {
        return Math.max(this.duration - this.elapsed, 0);
    }
}