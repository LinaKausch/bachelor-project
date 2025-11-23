export default class Counter {
    constructor(max = 2) {
        this.value = 0;
        this.max = max;
    }

    add() {
        if (this.value < this.max) this.value++;
    }

    get() {
        return this.value;
    }
}
