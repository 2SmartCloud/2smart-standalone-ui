import * as actions                   from '../actions/userServices';
import reducer                        from './userServices';
import { USER_SERVICES_SORT_ORDER }   from '../assets/constants/localStorage';
import { getData }                    from '../utils/localStorage';

jest.mock('../utils/localStorage');

describe('userServices reducer', () => {
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

        expect(getData).toHaveBeenCalledWith(USER_SERVICES_SORT_ORDER);
    });

    it('GET_BRIDGE_ENTITIES', () => {
        initialState.list = [ { test: 'test' } ];
        const action = { type: actions.GET_BRIDGE_ENTITIES, payload: { services: [ { test: 'test2' } ] } };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test2' } ]);
        expect(result.isFetching).toBeFalsy();
    });

    it('ADD_BRIDGE_ENTITY', () => {
        initialState.list = [ { id: '1', test: 'test' } ];
        const action = { type: actions.ADD_BRIDGE_ENTITY, payload: { service: { id: '2', test: 'test2' } } };
        const result = reducer(initialState, action);
        const expected = [ { id: '1', test: 'test' }, { id: '2', test: 'test2' } ];

        expect(result.list).toEqual(expected);
    });

    it('UPDATE_BRIDGE_ATTRIBUTE', () => {
        initialState.list = [ { id: '1', test: 'test' }, { id: '2', test: 'test' } ];
        const action = { type: actions.UPDATE_BRIDGE_ATTRIBUTE, payload: { id: '1', updated: { test: 'test2', test2: 'test2' } } };
        const result = reducer(initialState, action);
        const expected = [ { id: '1', test: 'test2', test2: 'test2' }, { id: '2', test: 'test' } ];

        expect(result.list).toEqual(expected);
    });

    it('DELETE_BRIDGE_ENTITY', () => {
        initialState.list = [ { id: '1', test: 'test' }, { id: '2', test: 'test' } ];
        const action = { type: actions.DELETE_BRIDGE_ENTITY, payload: { id: '1' } };
        const result = reducer(initialState, action);
        const expected = [ { id: '2', test: 'test' } ];

        expect(result.list).toEqual(expected);
    });

    it('SET_USER_SERVICES_SEARCH_QUERY', () => {
        const action = { type: actions.SET_USER_SERVICES_SEARCH_QUERY, payload: { searchQuery: 'test query' } };
        const result = reducer(initialState, action);

        expect(result.searchQuery).toEqual('test query');
    });

    it('SET_USER_SERVICES_SORT_ORDER', () => {
        const action = { type: actions.SET_USER_SERVICES_SORT_ORDER, payload: { sortOrder: 'DESC' } };
        const result = reducer(initialState, action);

        expect(result.sortOrder).toEqual('DESC');
    });

    it('SET_USER_SERVICES_CURRENT_PAGE', () => {
        const action = { type: actions.SET_USER_SERVICES_CURRENT_PAGE, payload: { currentPage: 3 } };
        const result = reducer(initialState, action);

        expect(result.currentPage).toEqual(3);
    });
});
