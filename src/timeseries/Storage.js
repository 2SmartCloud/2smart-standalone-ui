class Storage {
    constructor() {
        this.ts = {};
        this.lastTs = {};
        this.listeners = {};
        this.rotation = {};
    }

    pushTs(id, chunk) {
        const rotation = this.rotation[id] || 4;

        if (this.ts[id]) {
            if (this.ts[id].length > rotation - 1) {
                this.ts[id].splice(0, this.ts[id].length - rotation + 1);
            }
            this.ts[id].push(chunk);
        } else {
            this.ts[id] = [ chunk ];
        }
        this.lastTs[id] = chunk;
    }

    setRotation(id, rotation) {
        this.rotation[id] = rotation;
    }

    getTs(id) {
        return this.ts[id] || [];
    }

    getLastTs(id) {
        return this.lastTs[id] || {};
    }

    listen(id, cb, interval) {
        cb(this.getTs(id)); //eslint-disable-line
        const listener = setInterval(() => {
            cb(this.getTs(id));
        }, interval * 1000);

        this.listeners[id] = listener;
    }

    dropTs(id) {
        this.ts[id] = [];
    }

    unsubscribe(id) {
        clearInterval(this.listeners[id]);
    }
}

const tsStorage = new Storage();

export default tsStorage;
