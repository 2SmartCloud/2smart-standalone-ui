import * as actions from '../actions/groups';
import reducer from './groups';

describe('Groups reducer', () => {
    let initialState;
    const previousList = [ {
        id        : '1',
        rootTopic : 'groups-of-properties/1',
        label     : 'First group'
    } ];

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

    it('GET_GROUP_ENTITIES', () => {
        initialState.list = previousList;
        const action = {
            type    : actions.GET_GROUP_ENTITIES,
            payload : {
                groups : [ {
                    id        : '2',
                    rootTopic : 'groups-of-properties/2',
                    label     : 'Second group'
                } ]
            }
        };
        const result = reducer(initialState, action);

        expect(result.list).toEqual([ {
            id        : '2',
            rootTopic : 'groups-of-properties/2',
            label     : 'Second group'
        } ]);
        expect(result.isFetching).toBeFalsy();
    });

    it('ADD_GROUP_ENTITY', () => {
        initialState.list = previousList;
        const action = {
            type    : actions.ADD_GROUP_ENTITY,
            payload : {
                group : {
                    id        : '2',
                    rootTopic : 'groups-of-properties/2',
                    label     : 'Second group'
                }
            }
        };
        const result = reducer(initialState, action);
        const expected = [ {
            id        : '1',
            rootTopic : 'groups-of-properties/1',
            label     : 'First group'
        }, {
            id        : '2',
            rootTopic : 'groups-of-properties/2',
            label     : 'Second group'
        }
        ];

        expect(result.list).toEqual(expected);
    });

    it('DELETE_GROUP_ENTITY', () => {
        initialState.list = [
            {
                id        : '1',
                rootTopic : 'groups-of-properties/1',
                label     : 'First group'
            }, {
                id        : '2',
                rootTopic : 'groups-of-properties/2',
                label     : 'Second group'
            }
        ];
        const action = {
            type    : actions.DELETE_GROUP_ENTITY,
            payload : { id: '1' }
        };
        const result = reducer(initialState, action);
        const expected = [ {
            id        : '2',
            rootTopic : 'groups-of-properties/2',
            label     : 'Second group'
        } ];

        expect(result.list).toEqual(expected);
    });

    it('CHANGE_GROUP_VALUE_PROCESSING', () => {
        initialState.list = [
            {
                id        : '1',
                rootTopic : 'groups-of-properties/1',
                label     : 'First group'
            }, {
                id        : '2',
                rootTopic : 'groups-of-properties/2',
                label     : 'Second group'
            }
        ];
        const action = {
            type    : actions.CHANGE_GROUP_VALUE_PROCESSING,
            payload : { id: '1', status: true }
        };
        const result = reducer(initialState, action);
        const expected = [
            {
                id                : '1',
                rootTopic         : 'groups-of-properties/1',
                label             : 'First group',
                isValueProcessing : true
            }, {
                id        : '2',
                rootTopic : 'groups-of-properties/2',
                label     : 'Second group'
            }
        ];

        expect(result.list).toEqual(expected);
    });

    it('SET_GROUP_VALUE_ERROR', () => {
        initialState.list = [
            {
                id        : '1',
                rootTopic : 'groups-of-properties/1',
                label     : 'First group'
            }, {
                id        : '2',
                rootTopic : 'groups-of-properties/2',
                label     : 'Second group'
            }
        ];
        const error = { message: 'validation' };
        const action = {
            type    : actions.SET_GROUP_VALUE_ERROR,
            payload : { id: '1', error }
        };
        const result = reducer(initialState, action);
        const expected = [
            {
                id         : '1',
                rootTopic  : 'groups-of-properties/1',
                label      : 'First group',
                valueError : {
                    error,
                    isExist : true
                },
                isValueProcessing : false
            }, {
                id        : '2',
                rootTopic : 'groups-of-properties/2',
                label     : 'Second group'
            }
        ];

        expect(result.list).toEqual(expected);
    });


    it('REMOVE_GROUP_VALUE_ERROR', () => {
        initialState.list = [
            {
                id         : '1',
                rootTopic  : 'groups-of-properties/1',
                label      : 'First group',
                valueError : {
                    error,
                    isExist : true
                }
            }, {
                id        : '2',
                rootTopic : 'groups-of-properties/2',
                label     : 'Second group'
            }
        ];
        const error = { message: 'validation' };
        const action = {
            type    : actions.REMOVE_GROUP_VALUE_ERROR,
            payload : { id: '1' }
        };
        const result = reducer(initialState, action);
        const expected = [
            {
                id         : '1',
                rootTopic  : 'groups-of-properties/1',
                label      : 'First group',
                valueError : { }
            }, {
                id        : '2',
                rootTopic : 'groups-of-properties/2',
                label     : 'Second group'
            }
        ];

        expect(result.list).toEqual(expected);
    });
});
