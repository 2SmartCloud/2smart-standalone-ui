import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import api from '../apiSingleton';
import * as actions from './scenarios';

jest.mock('../apiSingleton');

const mockStore = configureMockStore([ thunk ]);

describe('scenarios actions', () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
    });

    describe('getScenarios()', () => {
        it('success', async () => {
            const expectedScenarios = [{ test: 'test' }];
            const expectedActions = [
                { type: actions.GET_SCENARIOS_REQUEST },
                { type: actions.GET_SCENARIOS_SUCCESS, payload: { scenarios: expectedScenarios } }
            ];

            api.scenarios.list = jest.fn().mockReturnValue(Promise.resolve(expectedScenarios));

            await store.dispatch(actions.getScenarios());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            const expectedActions = [
                { type: actions.GET_SCENARIOS_REQUEST },
                { type: actions.GET_SCENARIOS_FAILURE }
            ];

            api.scenarios.list = jest.fn().mockReturnValue(Promise.reject());

            await store.dispatch(actions.getScenarios());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('createScenario()', () => {
        it('success', async () => {
            api.scenarios.create = jest.fn().mockReturnValue(Promise.resolve());
            api.scenarios.list = jest.fn().mockReturnValue(Promise.resolve([]));

            const payload = { test: 'test2' };
            const expectedActions = [
                { type: actions.GET_SCENARIOS_REQUEST },
                { type: actions.GET_SCENARIOS_SUCCESS, payload: { scenarios: [] } }
            ];

            try {
                await store.dispatch(actions.createScenario(payload));
            } catch {}

            expect(api.scenarios.create).toHaveBeenCalledWith(payload);
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.scenarios.create = jest.fn().mockReturnValue(Promise.reject(new Error()));

            try {
                await store.dispatch(actions.createScenario());
            } catch (err) {
                expect(err).toBeDefined();
            }

            expect(store.getActions()).toEqual([]);
        });
    });

    describe('updateScenario()', () => {
        it('success', async () => {
            api.scenarios.update = jest.fn().mockReturnValue(Promise.resolve());
            api.scenarios.list = jest.fn().mockReturnValue(Promise.resolve([]));

            const payload = { test: 'test2' };
            const expectedActions = [
                { type: actions.GET_SCENARIOS_REQUEST },
                { type: actions.GET_SCENARIOS_SUCCESS, payload: { scenarios: [] } }
            ];

            try {
                await store.dispatch(actions.updateScenario('1', payload));
            } catch {}

            expect(api.scenarios.update).toHaveBeenCalledWith('1', payload);
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.scenarios.update = jest.fn().mockReturnValue(Promise.reject(new Error()));

            try {
                await store.dispatch(actions.updateScenario());
            } catch (err) {
                expect(err).toBeDefined();
            }

            expect(store.getActions()).toEqual([]);
        });
    });

    describe('deleteScenario()', () => {
        it('success', async () => {
            api.scenarios.delete = jest.fn().mockReturnValue(Promise.resolve());
            api.scenarios.list = jest.fn().mockReturnValue(Promise.resolve([]));

            const expectedActions = [
                { type: actions.GET_SCENARIOS_REQUEST },
                { type: actions.GET_SCENARIOS_SUCCESS, payload: { scenarios: [] } }
            ];

            try {
                await store.dispatch(actions.deleteScenario('1'));
            } catch {}

            expect(api.scenarios.delete).toHaveBeenCalledWith('1');
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.scenarios.delete = jest.fn().mockReturnValue(Promise.reject(new Error()));

            try {
                await store.dispatch(actions.deleteScenario());
            } catch (err) {
                expect(err).toBeDefined();
            }

            expect(store.getActions()).toEqual([]);
        });
    });
});
