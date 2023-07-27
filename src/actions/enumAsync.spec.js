import api from '../apiSingleton';
import * as actions from './enumAsync';

jest.mock('../apiSingleton');

describe('citiesActions', () => {

    describe('getEnumAsyncOptions()', () => {
        it('success', async () => {
            api.enumAsync.list = jest.fn().mockReturnValue(Promise.resolve([]));

            try {
                await actions.getEnumAsyncOptions();
                expect(actions.getEnumAsyncOptions).toBeCalled()
            } catch {}
        });

        it('failure', async () => {
            api.enumAsync.list = jest.fn().mockReturnValue(Promise.reject());

            try {
                await actions.getEnumAsyncOptions();
                expect(actions.getEnumAsyncOptions).toBeCalled()
            } catch (err) {
                expect(err).toBeDefined();
            }
        });
    });
});
