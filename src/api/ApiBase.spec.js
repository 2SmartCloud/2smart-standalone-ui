import ApiBase from './ApiBase'
import * as errorActions from '../actions/error';

jest.mock('../actions/error');

describe('ApiBase', () => {
    let instance;

    beforeEach(() => {
        window.fetch = jest.fn();

        instance = new ApiBase({url: 'http://localhost'});
    });

    describe('fetch()', () => {
        it('success response', async () => {
            window.fetch.mockResolvedValue({
                status : 200,
                json   : jest.fn().mockResolvedValue({ status: 1, foo: 'bar' })
            });

            const result = await instance.fetch();

            expect(result).toEqual({ status: 1, foo: 'bar' });
            expect(errorActions.dispatchHandleSuccessResponse).toHaveBeenCalled();
        });

        it('network error', async () => {
            window.fetch.mockResolvedValue({
                status : 502,
            });

            try {
                await instance.fetch();
            } catch {}

            expect(errorActions.dispatchHandleErrorCode).toHaveBeenCalledWith('NETWORK_ERROR')
        });
    });
});
