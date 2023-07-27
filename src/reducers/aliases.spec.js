import * as actions from '../actions/alias';
import reducer from './aliases';
import {
    GET_ALIAS_ENTITIES,
    ADD_ALIAS_ENTITY,
    DELETE_ALIAS_ENTITY,
    UPDATE_ALIAS
} from '../actions/alias';

import {ALIASES} from '../__mocks__/aliasesMock';

describe('backup reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list        : [],
            isFetching  : false
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('GET_ALIAS_ENTITIES', () => {
        initialState.isFetching = false;

        initialState.list = [ALIASES[0]];
        const action = { 
            type: actions.GET_ALIAS_ENTITIES,
            payload: { 
                aliases:ALIASES[1]
            } 
        };
        const result = reducer(initialState, action);

        expect(result.list).toEqual(ALIASES[1]);
        expect(result.isFetching).toBeFalsy();
    });

    it('ADD_ALIAS_ENTITY', () => {
        initialState.list = [ALIASES[0], ALIASES[1]];
        const action = { 
            type: actions.ADD_ALIAS_ENTITY,
            payload: {
                alias:ALIASES[2]
            }
        };
        const result = reducer(initialState, action);

        expect(result.list).toEqual(ALIASES);
    });

    it('DELETE_ALIAS_ENTITY', () => {
        initialState.list = ALIASES;
        const action = {
            type: actions.DELETE_ALIAS_ENTITY,
            payload: { id: 'id1' }
        };
        const result = reducer(initialState, action);


        expect(result.list).toEqual([ALIASES[1],ALIASES[2]]);
    });
});
