import * as localStorageUtils from './localStorage';

Object.defineProperty(window, 'localStorage', {
    setItem: jest.fn(),
    getItem: jest.fn()
});

describe('localStorage utils', () => {
    xit('saveData() should save data in localStorage', () => {
        const key = 'key';

        localStorageUtils.saveData(key, { data: 'someData' });

        expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    xit('getData() should return data from localStorage', () => {
        const key = 'key';

        localStorageUtils.getData(key);

        expect(window.localStorage.getItem).toHaveBeenCalled();
    });
});
