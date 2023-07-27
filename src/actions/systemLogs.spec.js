import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import api from '../apiSingleton';
import * as actions from './systemLogs';

jest.mock('../apiSingleton');
jest.mock('../utils/mapper/logs', () => {
    return {
        mapSystemLogTOToSystemLog : jest.fn().mockImplementation(item => item),
        mapSystemLogsQuery        : jest.fn().mockImplementation(item => item)
    };
});

const mockStore = configureMockStore([ thunk ]);

describe('systemLogs actions', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            systemLogs : {
                searchQuery : 'test',
                logLevel    : 'warning',
                limit       : actions.DEFAULT_LOGS_LIMIT
            }
        });

        api.systemLogs.list.mockReset();
    });

    describe('getSystemLogs()', () => {
        it('success', async () => {
            const mockLogs = [{ test: 'test' }, { test: 'test2' }];

            api.systemLogs.list = jest.fn().mockReturnValue(Promise.resolve({ list: mockLogs, total: 2 }));

            const expectedActions = [
                { type: actions.GET_SYSTEM_LOGS_REQUEST },
                { type: actions.GET_SYSTEM_LOGS_SUCCESS, payload: { list: mockLogs, total: 2 } }
            ];

            await store.dispatch(actions.getSystemLogs());

            expect(api.systemLogs.list).toHaveBeenCalledWith({ searchQuery: 'test', logLevel: 'warning', limit: actions.DEFAULT_LOGS_LIMIT });
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.systemLogs.list = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [
                { type: actions.GET_SYSTEM_LOGS_REQUEST },
                { type: actions.GET_SYSTEM_LOGS_FAILURE }
            ];

            await store.dispatch(actions.getSystemLogs());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('getMoreLogs()', () => {
        const expectedActions = [
            { type: actions.SET_SYSTEM_LOGS_LIMIT, payload: { limit: actions.DEFAULT_LOGS_LIMIT * 2 } },
            { type: actions.GET_SYSTEM_LOGS_REQUEST }
        ];

        store.dispatch(actions.getMoreLogs());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('setLogsSearchQuery()', () => {
        const expectedActions = [
            { type: actions.SET_SYSTEM_LOGS_SEARCH_QUERY, payload: { searchQuery: 'search' } },
            { type: actions.SET_SYSTEM_LOGS_LIMIT, payload: { limit: actions.DEFAULT_LOGS_LIMIT } },
            { type: actions.GET_SYSTEM_LOGS_REQUEST }
        ];

        jest.useFakeTimers();

        store.dispatch(actions.setLogsSearchQuery('search'));

        jest.runAllTimers();

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('setLogsSortOrder()', () => {
        const expectedActions = [
            { type: actions.SET_SYSTEM_LOGS_SORT_ORDER, payload: { sortOrder: 'asc' } },
            { type: actions.SET_SYSTEM_LOGS_LIMIT, payload: { limit: actions.DEFAULT_LOGS_LIMIT } },
            { type: actions.GET_SYSTEM_LOGS_REQUEST }
        ];

        jest.useFakeTimers();

        store.dispatch(actions.setLogsSortOrder('asc'));

        jest.runAllTimers();

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('setLogsLevel()', () => {
        const expectedActions = [
            { type: actions.SET_SYSTEM_LOGS_LEVEL, payload: { logLevel: 'info' } },
            { type: actions.SET_SYSTEM_LOGS_LIMIT, payload: { limit: actions.DEFAULT_LOGS_LIMIT } },
            { type: actions.GET_SYSTEM_LOGS_REQUEST }
        ];

        jest.useFakeTimers();

        store.dispatch(actions.setLogsLevel('info'));

        jest.runAllTimers();

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('setLogsLimit()', () => {
        const expectedActions = [
            { type: actions.SET_SYSTEM_LOGS_LIMIT, payload: { limit: 50 } },
        ];

        store.dispatch(actions.setLogsLimit(50));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('resetLogsLimit()', () => {
        const expectedActions = [
            { type: actions.SET_SYSTEM_LOGS_LIMIT, payload: { limit: actions.DEFAULT_LOGS_LIMIT } },
        ];

        store.dispatch(actions.resetLogsLimit());

        expect(store.getActions()).toEqual(expectedActions);
    });
});


