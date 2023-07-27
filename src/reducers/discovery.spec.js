import * as actions from '../actions/discovery';
import reducer from './discovery';

describe('Discoveries reducer', () => {
    let initialState;

    const previousDiscoveries={
        'deviceId1':{
            name:'discovery',
            status:'isNew'
        },
        'deviceId2':{
            acceptedAt:'12345',
            name: 'Discovery 2',
            status:'isPending'
        }
    }

    beforeEach(() => {
        initialState = {
            discoveries        : {},
            isLoading   : false,
            isFetching  : true
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('GET_DISCOVERIES', () => {
        initialState.discoveries = previousDiscoveries;
        const newDiscoveries= {
            'deviceIdNew':{
                name: 'Discovery NAme',
                status:'isNew'
            }
        }
        const action = { 
            type: actions.GET_DISCOVERIES,
            payload: { 
                discoveries: newDiscoveries
            } 
        };
        const result = reducer(initialState, action);

        expect(result.discoveries).toEqual(newDiscoveries);
        expect(result.isFetching).toBeFalsy();
    });

    it('ADD_NEW_DISCOVERY', () => {
        initialState.discoveries = previousDiscoveries;
        
        const newDiscoveries= {
                id:'deviceIdNew',
                name: 'Discovery NAme',
                status:'isNew'
        }
        const action = { 
            type: actions.ADD_NEW_DISCOVERY,
            discovery: newDiscoveries
        };
        const result = reducer(initialState, action);
        const expected ={
            'deviceId1':{
                name:'discovery',
                status:'isNew'
            },
            'deviceId2':{
                acceptedAt:'12345',
                name: 'Discovery 2',
                status:'isPending'
            },
            'deviceIdNew':{
                id:'deviceIdNew',
                name: 'Discovery NAme',
                status:'isNew'
            }
        }

        expect(result.discoveries).toEqual(expected);
    });

    it('ACCEPT_DISCOVERY', () => {
        initialState.discoveries = previousDiscoveries;

        const action = {
            type: actions.ACCEPT_DISCOVERY,
            payload: { 
                discovery:{
                    id: 'deviceId1',
                    acceptedAt: '1582199482259'
                }
            }
        };
        const result = reducer(initialState, action);
        const expected = {
            'deviceId1':{
                name:'discovery',
                status:'isNew',
                id: 'deviceId1',
                acceptedAt: '1582199482259'
            },
            'deviceId2':{
                acceptedAt:'12345',
                name: 'Discovery 2',
                status:'isPending'
            }
        }

        expect(result.discoveries).toEqual(expected);
    });


    it('DELETE_DISCOVERY', () => {
        initialState.discoveries = previousDiscoveries;

        const action = {
            type: actions.DELETE_DISCOVERY,
            payload: { id: 'deviceId1' }
        };
        const result = reducer(initialState, action);
        const expected = {
            'deviceId2':{
                acceptedAt:'12345',
                name: 'Discovery 2',
                status:'isPending'
            }
        }

        expect(result.discoveries).toEqual(expected);
    });


    it('CHANGE_DISCOVERY_STATUS', () => {
        initialState.discoveries = previousDiscoveries;

        const action = {
            type: actions.CHANGE_DISCOVERY_STATUS,
            status: 'isPendding',
            id:'deviceId1'
        };
        const result = reducer(initialState, action);
        const expected = {
            'deviceId1':{
                name:'discovery',
                status:'isPendding'
            },
            'deviceId2':{
                acceptedAt:'12345',
                name: 'Discovery 2',
                status:'isPending'
            }
        }

        expect(result.discoveries).toEqual(expected);
    });


    it('START_DELETE_LOADING', () => {
        initialState.discoveries = previousDiscoveries;

        const action = {
            type: actions.START_DELETE_LOADING
        };
        const result = reducer(initialState, action);
    
        expect(result.isLoading).toEqual(true);
    });

    it('STOP_DELETE_LOADING', () => {
        initialState.discoveries = previousDiscoveries;

        const action = {
            type: actions.STOP_DELETE_LOADING
        };
        const result = reducer(initialState, action);
    
        expect(result.isLoading).toEqual(false);
    });
});
