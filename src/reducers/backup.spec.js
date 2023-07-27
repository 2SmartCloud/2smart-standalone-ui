import * as actions from '../actions/backup';
import reducer from './backup';

describe('backup reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list        : [],
            isFetching  : true,
            isCreating  : false,
            isUpdating  : false,
            restoring   : undefined,
            isRestored  : false,
            isRestoring : false,
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    describe('GET_BACKUP_LIST_REQUEST', () => {
        it('with empty list', () => {
            initialState.isFetching = false;

            const action = { type: actions.GET_BACKUP_LIST_REQUEST };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([]);
            expect(result.isFetching).toBeTruthy();
            expect(result.isUpdating).toBeFalsy();
        });

        it('with filled list', () => {
            initialState.list = [ { test: 'test' } ];
            initialState.isFetching = false;

            const action = { type: actions.GET_BACKUP_LIST_REQUEST };
            const result = reducer(initialState, action);

            expect(result.list).toEqual([ { test: 'test' } ]);
            expect(result.isFetching).toBeFalsy();
            expect(result.isUpdating).toBeTruthy();
        });
    });

    it('GET_BACKUP_LIST_SUCCESS', () => {
        const action = { type: actions.GET_BACKUP_LIST_SUCCESS, payload: { list: [ { test: 'test' } ] } };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test' } ]);
        expect(result.isFetching).toBeFalsy();
        expect(result.isUpdating).toBeFalsy();

    });

    it('GET_BACKUP_LIST_FAILURE', () => {
        initialState.list = [ { test: 'test' } ];

        const action = { type: actions.GET_BACKUP_LIST_FAILURE };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ { test: 'test' } ]);
        expect(result.isFetching).toBeFalsy();
        expect(result.isUpdating).toBeFalsy();

    });

    it('RESTORE_BACKUP_REQUEST', () => {
        const action = { type: actions.RESTORE_BACKUP_REQUEST, payload: { name: 'dump' } };
        const result = reducer(initialState, action);

        expect(result.restoring).toBe('dump');
        expect(result.isRestored).toBeFalsy();
    });

    it('RESTORE_BACKUP_SUCCESS', () => {
        initialState.restoring = 'dump';

        const action = { type: actions.RESTORE_BACKUP_SUCCESS };
        const result = reducer(initialState, action);

        expect(result.restoring).toBeUndefined();
        expect(result.isRestored).toBeTruthy();
    });

    it('RESTORE_BACKUP_FAILURE', () => {
        initialState.restoring = 'dump';

        const action = { type: actions.RESTORE_BACKUP_FAILURE };
        const result = reducer(initialState, action);

        expect(result.restoring).toBeUndefined();
    });

    it('START_BACKUP_CREATE', () => {
        const action = { type: actions.START_BACKUP_CREATE };
        const result = reducer(initialState, action);

        expect(result.isCreating).toBeTruthy();
    });

    it('STOP_BACKUP_CREATE', () => {
        const action = { type: actions.STOP_BACKUP_CREATE };
        const result = reducer(initialState, action);

        expect(result.isCreating).toBeFalsy();
    });
});
