import * as actions             from '../actions/notifications';
import reducer                  from './notifications';

jest.mock('../utils/localStorage');

describe('notifications reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list       : [],
            isFetching : true
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    describe('GET_NOTIFICATIONS', () => {
        it('with empty list', () => {
            const action = { type: actions.GET_NOTIFICATIONS, notifications: [] };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([]);
            expect(result.isFetching).toBeFalsy();
        });

        it('with filled list', () => {
            const action = { type: actions.GET_NOTIFICATIONS, notifications: [ { id: 'test' } ] };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([ { id: 'test' } ]);
            expect(result.isFetching).toBeFalsy();
        });
    });

    it('ADD_NOTIFICATION', () => {
        const action = { type: actions.ADD_NOTIFICATION, payload: { notification: { id: 'test' } } };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { id: 'test' } ]);
    });

    it('UPDATE_NOTIFICATION', () => {
        initialState.list = [ { id: 'test2', name: 'some1' }] ;
        const action      = { type: actions.UPDATE_NOTIFICATION, payload: {
            id      : 'test2',
            updated : { id : 'test2', name : 'some2' }
        } };
        const result      = reducer(initialState, action);

        expect(result.list).toEqual([ { id: 'test2', name: 'some2' } ]);
    });
});
