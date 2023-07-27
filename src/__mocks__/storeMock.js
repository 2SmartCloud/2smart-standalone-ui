export default function getMockStore(getState) {
    return {
        dispatch  : jest.fn(),
        subscribe : jest.fn(),
        getState  : getState || jest.fn()
    };
}
