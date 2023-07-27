import * as actions             from '../actions/scenarios';
import reducer                  from './scenarios';
import { SCENARIOS_SORT_ORDER } from '../assets/constants/localStorage';
import { getData }              from '../utils/localStorage';

jest.mock('../utils/localStorage');

describe('scenarios reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list        : [],
            isFetching  : true,
            isUpdating  : false,
            searchQuery : '',
            sortOrder   : 'NAME_ASC',
            currentPage : 1
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('should call getData from localStorage on init', () => {
        reducer(undefined, {});

        expect(getData).toHaveBeenCalledWith(SCENARIOS_SORT_ORDER);
    });

    describe('GET_SCENARIOS_REQUEST', () => {
        it('with empty list', () => {
            initialState.isFetching = false;

            const action = { type: actions.GET_SCENARIOS_REQUEST };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([]);
            expect(result.isFetching).toBeTruthy();
            expect(result.isUpdating).toBeFalsy();
        });

        it('with filled list', () => {
            initialState.list = [ { test: 'test' } ];
            initialState.isFetching = false;

            const action = { type: actions.GET_SCENARIOS_REQUEST };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([ { test: 'test' } ]);
            expect(result.isFetching).toBeFalsy();
            expect(result.isUpdating).toBeTruthy();
        });
    });

    it('GET_SCENARIOS_SUCCESS', () => {
        const action = { type: actions.GET_SCENARIOS_SUCCESS, payload: { scenarios: [ { test: 'test' } ] } };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test' } ]);
        expect(result.isFetching).toBeFalsy();
        expect(result.isUpdating).toBeFalsy();
    });

    it('GET_SCENARIOS_FAILURE', () => {
        initialState.list = [ { test: 'test' } ];

        const action = { type: actions.GET_SCENARIOS_FAILURE };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test' } ]);
        expect(result.isFetching).toBeFalsy();
        expect(result.isUpdating).toBeFalsy();
    });

    it('SET_SCENARIOS_SEARCH_QUERY', () => {
        const action = { type: actions.SET_SCENARIOS_SEARCH_QUERY, payload: { searchQuery: 'test query' } };
        const result = reducer(initialState, action);

        expect(result.searchQuery).toEqual('test query');
    });

    it('SET_SCENARIOS_SORT_ORDER', () => {
        const action = { type: actions.SET_SCENARIOS_SORT_ORDER, payload: { sortOrder: 'DESC' } };
        const result = reducer(initialState, action);

        expect(result.sortOrder).toEqual('DESC');
    });

    it('SET_SCENARIOS_CURRENT_PAGE', () => {
        const action = { type: actions.SET_SCENARIOS_CURRENT_PAGE, payload: { currentPage: 3 } };
        const result = reducer(initialState, action);

        expect(result.currentPage).toEqual(3);
    });
});
