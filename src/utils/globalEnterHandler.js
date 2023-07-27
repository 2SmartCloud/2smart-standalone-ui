/**
 * Global ENTER handling helper
 * while ENTER keydown event fired, calls latest registered handler function
 * event is captured on the capturing phase, further capturing prevented
 */
class GlobalEnterHandler {
    constructor() {
        document.addEventListener('keydown', this._enterHandler);

        this._stack = [];
    }

    register(handler) {
        this._stack.push(handler);
        // console.log('GEH: registered', this._stack.length);
    }

    unregister(handler) {
        this._stack = this._stack.filter(item => item !== handler);
        // console.log('GEH: unregistered', this._stack.length);
    }

    _enterHandler = e => {
        const { keyCode } = e;

        if (keyCode === 13) {
            const handler = this._stack[this._stack.length - 1];

            if (handler) {
                e.stopPropagation();

                // console.log('GEH: global esc fired', this._stack.length);
                handler(e);
            }
        }
    }
}

const globalEnterHandler = new GlobalEnterHandler();

export default globalEnterHandler;
