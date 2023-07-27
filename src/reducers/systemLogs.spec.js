import * as actions from '../actions/systemLogs';
import reducer from './systemLogs';

describe('systemLogs reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list          : [],
            total         : 0,
            initFetched   : false,
            hasEntries    : false,
            isFetching    : true,
            searchQuery   : undefined,
            logLevel      : undefined,
            sortOrder     : 'desc',
            limit         : undefined,
            requestsCount : 0
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('GET_SYSTEM_LOGS_REQUEST', () => {
        initialState.isFetching = false;

        const action = { type: actions.GET_SYSTEM_LOGS_REQUEST };
        const result = reducer(initialState, action);

        expect(result.isFetching).toBeTruthy();
        expect(result.requestsCount).toBe(1);
    });

    describe('GET_SYSTEM_LOGS_SUCCESS', () => {
        it('first request', () => {
            initialState.requestsCount = 1;

            const action = { type: actions.GET_SYSTEM_LOGS_SUCCESS, payload: { list: [ { test: 'test' } ], total: 1 } };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([ { test: 'test' } ]);
            expect(result.total).toBe(1);
            expect(result.initFetched).toBeTruthy();
            expect(result.hasEntries).toBeTruthy();
            expect(result.isFetching).toBeFalsy();
        });

        it('single request', () => {
            initialState.requestsCount = 1;
            initialState.isFetching = true;

            const action = { type: actions.GET_SYSTEM_LOGS_SUCCESS, payload: { list: [ { test: 'test' } ], total: 1 } };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([ { test: 'test' } ]);
            expect(result.total).toBe(1);
            expect(result.isFetching).toBeFalsy();
        });

        it('multiple requests', () => {
            initialState.requestsCount = 3;
            initialState.isFetching = true;

            const action = { type: actions.GET_SYSTEM_LOGS_SUCCESS, payload: { list: [ { test: 'test' } ], total: 1 } };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([ { test: 'test' } ]);
            expect(result.total).toBe(1);
            expect(result.isFetching).toBeTruthy();
        });
    });

    describe('GET_SYSTEM_LOGS_FAILURE', () => {
        it('single request', () => {
            initialState.requestsCount = 1;
            initialState.isFetching = true;

            const action = { type: actions.GET_SYSTEM_LOGS_FAILURE };
            const result = reducer(initialState, action);

            expect(result.isFetching).toBeFalsy();
        });

        it('multiple requests', () => {
            initialState.requestsCount = 3;
            initialState.isFetching = true;

            const action = { type: actions.GET_SYSTEM_LOGS_FAILURE };
            const result = reducer(initialState, action);

            expect(result.isFetching).toBeTruthy();
        });
    });

    it('SET_SYSTEM_LOGS_SEARCH_QUERY', () => {
        const action = { type: actions.SET_SYSTEM_LOGS_SEARCH_QUERY, payload: { searchQuery: 'test' } };
        const result = reducer(initialState, action);

        expect(result.searchQuery).toBe('test');
    });

    it('SET_SYSTEM_LOGS_SORT_ORDER', () => {
        const action = { type: actions.SET_SYSTEM_LOGS_SORT_ORDER, payload: { sortOrder: 'asc' } };
        const result = reducer(initialState, action);

        expect(result.sortOrder).toBe('asc');
    });

    it('SET_SYSTEM_LOGS_LEVEL', () => {
        const action = { type: actions.SET_SYSTEM_LOGS_LEVEL, payload: { logLevel: 'error' } };
        const result = reducer(initialState, action);

        expect(result.logLevel).toBe('error');
    });

    it('SET_SYSTEM_LOGS_LIMIT', () => {
        const action = { type: actions.SET_SYSTEM_LOGS_LIMIT, payload: { limit: 50 } };
        const result = reducer(initialState, action);

        expect(result.limit).toBe(50);
    });
});
