import * as actions from '../actions/simpleScenarioTypes';
import reducer from './simpleScenarioTypes';

describe('simpleScenarioTypes reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list       : [],
            isFetching : true,
            isUpdating : false
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    describe('GET_SIMPLE_SCENARIO_TYPES_REQUEST', () => {
        it('with empty list', () => {
            initialState.isFetching = false;

            const action = { type: actions.GET_SIMPLE_SCENARIO_TYPES_REQUEST };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([]);
            expect(result.isFetching).toBeTruthy();
            expect(result.isUpdating).toBeFalsy();
        });

        it('with filled list', () => {
            initialState.list = [ { test: 'test' } ];
            initialState.isFetching = false;

            const action = { type: actions.GET_SIMPLE_SCENARIO_TYPES_REQUEST };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([ { test: 'test' } ]);
            expect(result.isFetching).toBeFalsy();
            expect(result.isUpdating).toBeTruthy();
        });
    });

    it('GET_SIMPLE_SCENARIO_TYPES_SUCCESS', () => {
        const action = { type: actions.GET_SIMPLE_SCENARIO_TYPES_SUCCESS, payload: { scenarioTypes: [ { test: 'test' } ] } };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test' } ]);
        expect(result.isFetching).toBeFalsy();
        expect(result.isUpdating).toBeFalsy();
    });

    it('GET_SIMPLE_SCENARIO_TYPES_FAILURE', () => {
        initialState.list = [ { test: 'test' } ];

        const action = { type: actions.GET_SIMPLE_SCENARIO_TYPES_FAILURE };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test' } ]);
        expect(result.isFetching).toBeFalsy();
        expect(result.isUpdating).toBeFalsy();
    });
});
