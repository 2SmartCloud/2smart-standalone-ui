import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import api from '../apiSingleton';
import * as actions from './simpleScenarioTypes';

jest.mock('../apiSingleton');
jest.mock('../utils/mapper/service', () => {
    return {
        mapScenarioTypeTOToScenarioType : jest.fn().mockImplementation(item => item)
    };
});

const mockStore = configureMockStore([ thunk ]);

describe('marketServices actions', () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
    });

    describe('getSimpleScenarioTypes()', () => {
        it('success', async () => {
            const mockTypes = [{ test: 'test' }];

            api.simpleScenarioTypes.list = jest.fn().mockReturnValue(Promise.resolve(mockTypes));

            const expectedActions = [
                { type: actions.GET_SIMPLE_SCENARIO_TYPES_REQUEST },
                { type: actions.GET_SIMPLE_SCENARIO_TYPES_SUCCESS, payload: { scenarioTypes: mockTypes } }
            ];

            await store.dispatch(actions.getSimpleScenarioTypes());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.simpleScenarioTypes.list = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [
                { type: actions.GET_SIMPLE_SCENARIO_TYPES_REQUEST },
                { type: actions.GET_SIMPLE_SCENARIO_TYPES_FAILURE }
            ];

            await store.dispatch(actions.getSimpleScenarioTypes());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});


