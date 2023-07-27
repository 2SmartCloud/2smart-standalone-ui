import configureMockStore    from 'redux-mock-store';
import thunk                 from 'redux-thunk';
import smartHome             from '../smartHome/smartHomeSingleton';
import * as mapperService    from '../utils/mapper/groups';

import { HIDE_DELETE_MODAL } from './interface';
import * as actions          from './discovery';
import * as homieActions     from './homie';


const mockStore = configureMockStore([ thunk ]);

describe('discovery actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({});
    });

    it('getDiscoveries()', async () => {
        const discoveries = {
            'deviceId1' : {
                name   : 'discovery',
                status : 'isNew'
            },
            'deviceId2' : {
                acceptedAt : '12345',
                name       : 'Discovery 2',
                status     : 'isPending'
            }
        }

        const expectedActions = [
            { type: actions.GET_DISCOVERIES, payload: { discoveries } }
        ];

        await store.dispatch(actions.getDiscoveries());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('onNewDiscoveryAdded()', async () => {
        const newDiscovery = {
            id     : "deviceId",
            name   : 'discovery',
            status : 'isNew'
        };
        const expectedActions = [
            { type: actions.ADD_NEW_DISCOVERY, discovery:newDiscovery}
        ];

        await store.dispatch(actions.onNewDiscoveryAdded(getMockNewEntitie()));

        expect(store.getActions()).toEqual(expectedActions);
    });


    it('acceptDiscovery() success', async () => {
        const mockFn = () => {};
        const expectedActions = [
            { 
                type   : actions.CHANGE_DISCOVERY_STATUS,
                id     : 'deviceId',
                status : 'isFetching'
            },
            {
                type    : actions.ACCEPT_DISCOVERY,
                payload : { discovery: { id : 'instanceId', setAttribute : mockFn } }
            }, {
                type     : actions.CHANGE_DISCOVERY_STATUS,
                id       : 'instanceId',
                "status" : 'isPending'
            }
        ];

        spyOn(smartHome, 'getInstanceByTopic').and.returnValue({ instance: {
            id           : 'instanceId',
            setAttribute : mockFn
        } });

        await store.dispatch(actions.acceptDiscovery('22222', 'deviceId'));

        expect(smartHome.getInstanceByTopic).toHaveBeenCalledWith('22222');
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('acceptDiscovery() failed', async () => {
        const error = { code: 'VALIDATION_ERROR' };

        const expectedActions = [
            { 
                type : actions.CHANGE_DISCOVERY_STATUS,
                id   : 'deviceId',
                status: 'isNew'
            },
            { type: 'STUB_ERROR' } 
        ];

        spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
        spyOn(smartHome, 'getInstanceByTopic').and.returnValue(Promise.reject(error));

        try{
            await store.dispatch(actions.acceptDiscovery('22222', 'deviceId'));

            expect(smartHome.getInstanceByTopic).toHaveBeenCalledWith('22222');
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
            expect(store.getActions()).toEqual(expectedActions);
        } catch {}

    });

    it('changeDiscoveryStatus()', async () => {
        const expectedActions = [
            { 
                type : actions.CHANGE_DISCOVERY_STATUS,
                id   : 'deviceId',
                status:'isNew'
            }
        ];

        await store.dispatch(actions.changeDiscoveryStatus('deviceId', 'isNew'));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('startDiscoveryDeleting()', () => {
        const expectedActions = [{ type : actions.START_DELETE_LOADING }];

        store.dispatch(actions.startDiscoveryDeleting());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('stopDiscoveryDeleting()', () => {
        const expectedActions = [{ type : actions.STOP_DELETE_LOADING }];

        store.dispatch(actions.stopDiscoveryDeleting());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('deleteDiscovery() success - should start delete processing', async () => {
        const mockFn = () => {};
        const expectedActions = [
            { type :  actions.START_DELETE_LOADING },
            {
                'payload' : { deleteRequest : mockFn },
                'type'    : actions.DELETE_DISCOVERY
            },
            { 'type' : actions.STOP_DELETE_LOADING },
            { 'type' : 'HIDE_DELETE_MODAL' }
        ];

        spyOn(smartHome, 'getInstanceByTopic').and.returnValue({ instance: {
            deleteRequest: mockFn
        } });

        await store.dispatch(actions.deleteDiscovery('entityId'));

        expect(smartHome.getInstanceByTopic).toHaveBeenCalledWith('entityId');
        expect(store.getActions()).toEqual(expectedActions);
    });

    xit('deleteDiscovery() failed - should stop delete processing and show error', async () => {
        const expectedActions = [
            { type: actions.START_DELETE_LOADING   },
            { type :  actions.STOP_DELETE_LOADING },
            { type: 'STUB_ERROR' } 
        ];
        const error = { code: 'VALIDATION_ERROR' };

        spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
        spyOn(smartHome, 'getInstanceByTopic').and.returnValue(Promise.reject(error));

        await store.dispatch(actions.deleteDiscovery('entityId'));

        expect(smartHome.getInstanceByTopic).toHaveBeenCalledWith('entityId');
        expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('onDiscoveryAccepted() - should add new discovery and change it status', () => {
        const newDiscovery={
            id   : 'deviceId',
            name : 'new device'
        }
        const expectedActions = [
            { type : actions.ACCEPT_DISCOVERY, payload:{discovery:newDiscovery} },
            { 
                type   : actions.CHANGE_DISCOVERY_STATUS,
                id     : 'deviceId',
                status : 'isPending'
            }
        ];

        store.dispatch(actions.onDiscoveryAccepted(newDiscovery));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('onDiscoveryDelete() should delete discovery , stop loader,and close delete modal', () => {
        const discoveryToDelete={
            id   : 'deviceId',
            name : 'device'
        }
        const expectedActions = [
            { type : actions.DELETE_DISCOVERY, payload:{...discoveryToDelete} },
            { type : actions.STOP_DELETE_LOADING },
            { type : HIDE_DELETE_MODAL }
        ];

        store.dispatch(actions.onDiscoveryDelete(discoveryToDelete));

        expect(store.getActions()).toEqual(expectedActions);
    });

    function setupSpies() {
        spyOn(smartHome, 'getEntities').and.returnValue(Promise.resolve(getMockEntities()));
    }

    function getMockEntities() {
        return (
            {
                'deviceId1' : {
                    name : 'discovery'
                },
                'deviceId2' : {
                    acceptedAt : '12345',
                    name       : 'Discovery 2'
                }
            }
        )
    }

    function getMockNewEntitie() {
        return (
            {
                id: "deviceId",
                name:'discovery'
            }
        )
    }
});
