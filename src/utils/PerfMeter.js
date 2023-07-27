export default class PerfMeter {
    constructor(name) {
        this.name = name;
    }

    start = () => {
        this._startTime = new Date().valueOf();
    }

    stop = () => {
        if (!this._startTime) return;

        const endTime = new Date().valueOf();
        const delta = endTime - this._startTime;

        console.log(`### Execution time for ${this.name}:`, delta);
    }
}
