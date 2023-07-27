import * as actions          from '../actions/marketServices';
import reducer               from './marketServices';
import { MARKET_SORT_ORDER } from '../assets/constants/localStorage';
import { getData }           from '../utils/localStorage';

jest.mock('../utils/localStorage');

describe('marketServices reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list        : [],
            isFetching  : true,
            searchQuery : '',
            sortOrder   : 'ASC',
            currentPage : 1
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('should call getData from localStorage on init', () => {
        reducer(undefined, {});

        expect(getData).toHaveBeenCalledWith(MARKET_SORT_ORDER);
    });

    it('GET_MARKET_SERVICES', () => {
        const action = { type: actions.GET_MARKET_SERVICES, payload: { services: [ { test: 'test' } ] } };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test' } ]);
        expect(result.isFetching).toBeFalsy();
    });

    it('ADD_MARKET_SERVICE', () => {
        initialState.list = [ { name: '1', test: 'test' } ];
        const action = { type: actions.ADD_MARKET_SERVICE, payload: { service: { name: '2', test: 'test2' } } };
        const result = reducer(initialState, action);
        const expected = [ { name: '1', test: 'test' }, { name: '2', test: 'test2' } ];

        expect(result.list).toEqual(expected);
    });

    it('UPDATE_MARKET_SERVICE_ATTRIBUTE', () => {
        initialState.list = [ { name: '1', test: 'test' }, { name: '2', test: 'test' } ];
        const action = { type: actions.UPDATE_MARKET_SERVICE_ATTRIBUTE, payload: { name: '1', updated: { test: 'test2', test2: 'test2' } } };
        const result = reducer(initialState, action);
        const expected = [ { name: '1', test: 'test2', test2: 'test2' }, { name: '2', test: 'test' } ];

        expect(result.list).toEqual(expected);
    });

    it('SET_MARKET_SERVICES_SEARCH_QUERY', () => {
        const action = { type: actions.SET_MARKET_SERVICES_SEARCH_QUERY, payload: { searchQuery: 'test query' } };
        const result = reducer(initialState, action);

        expect(result.searchQuery).toEqual('test query');
    });

    it('SET_MARKET_SERVICES_SORT_ORDER', () => {
        const action = { type: actions.SET_MARKET_SERVICES_SORT_ORDER, payload: { sortOrder: 'DESC' } };
        const result = reducer(initialState, action);

        expect(result.sortOrder).toEqual('DESC');
    });

    it('SET_MARKET_SERVICES_CURRENT_PAGE', () => {
        const action = { type: actions.SET_MARKET_SERVICES_CURRENT_PAGE, payload: { currentPage: 3 } };
        const result = reducer(initialState, action);

        expect(result.currentPage).toEqual(3);
    });
});
