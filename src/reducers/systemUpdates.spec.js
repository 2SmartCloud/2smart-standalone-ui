import * as actions from '../actions/systemUpdates';
import reducer      from './systemUpdates';

describe('systemUpdates reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            status          : null,
            lastUpdate      : null,
            availableUpdate : null,
            runningActions  : [],
            isLoading       : true
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('CHECK_SYSTEM_UPDATES_REQUEST', () => {
        const action = { type: actions.CHECK_SYSTEM_UPDATES_REQUEST };
        const result = reducer(initialState, action);

        expect(result.isLoading).toEqual(true);
    });

    it('CHECK_SYSTEM_UPDATES_SUCCESS', () => {
        const systemUpdates = {
            status          : 'status',
            lastUpdate      : 'lastUpdate',
            availableUpdate : 'availableUpdate'
        }
        const action = { type: actions.CHECK_SYSTEM_UPDATES_SUCCESS, payload: { systemUpdates } };
        const result = reducer(initialState, action);

        expect(result.isLoading).toEqual(false);
        expect(result.status).toEqual(systemUpdates.status);
        expect(result.lastUpdate).toEqual(systemUpdates.lastUpdate);
        expect(result.availableUpdate).toEqual(systemUpdates.availableUpdate);
    });

    it('CHECK_SYSTEM_UPDATES_ERROR', () => {
        const action = { type: actions.CHECK_SYSTEM_UPDATES_ERROR };
        const result = reducer({ ...initialState, isLoading: true }, action);

        expect(result.isLoading).toEqual(false);
    });

    it('RUN_ACTION_START', () => {
        const action = { type: actions.RUN_ACTION_START, payload: { actionType: 'someAction' } };
        const result = reducer(initialState, action);

        expect(result.runningActions).toEqual([ 'someAction' ]);
    });

    it('RUN_ACTION_END', () => {
        const action = { type: actions.RUN_ACTION_END, payload: { actionType: 'someAction' } };
        const result = reducer({ ...initialState, runningActions: [ 'someAction' ] }, action);

        expect(result.runningActions).toEqual([ ]);
    });
});
