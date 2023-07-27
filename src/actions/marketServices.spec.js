import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './marketServices';
import smartHome from '../smartHome/smartHomeSingleton';
import * as mapperService from '../utils/mapper/service.js';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import * as homieActions from './homie';

jest.mock('../smartHome/smartHomeSingleton');
jest.mock('../utils/mapper/service', () => {
    return {
        mapServiceTypeEntityToServiceType : jest.fn().mockImplementation(item => item),
        mapServiceTypeUpdateEntityToServiceTypeUpdate: jest.fn().mockImplementation(item => item)
    };
});
/* jest.mock('./interface', () => ({
    callToastNotification  : jest.fn(() => ({ type: 'STUB_NOTIFICATION' }))
})); */


jest.mock('../components/base/toast/callToast', () => ({
    callToast  : jest.fn(() => 'toastId')
}));

jest.mock('./homie');
jest.mock('../utils/homie/dispatcherSingleton');

const mockStore = configureMockStore([ thunk ]);

describe('marketServices actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({
            marketServices: {
                list:[
                    {
                        name:  'id1',
                        isProcessing:true,
                        label: 'label'
                    }
                ]
            },
            applicationInterface: {
                activeToasts:[]
            }
        });
    });

    it('subscribeAndGetMarketServices()', async () => {
        await store.dispatch(actions.subscribeAndGetMarketServices());

        const expectedActions = [
            { type: actions.GET_MARKET_SERVICES, payload: { services: [] } }
        ];

        expect(store.getActions()).toEqual(expectedActions);
        expect(smartHome.initializeEntityClass).toHaveBeenCalledWith('BRIDGE_TYPES');
    });

    it('getMarketServices() success', async () => {
        smartHome.getEntities = jest.fn().mockReturnValue(Promise.resolve(getMockEntities()));

        const expectedServices = [
            { id: '1', name: 'test' },
            { id: '2', name: 'test2' }
        ];
        const expectedActions = [
            { type: actions.GET_MARKET_SERVICES, payload: { services: expectedServices } }
        ];

        await store.dispatch(actions.getMarketServices());

        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('installMarketService()', () => {
        it('success', async () => {
            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'pull' };

            await store.dispatch(actions.installMarketService('1'));
            const expectedActions = [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "pulling",
                    },
                }
                ];
            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'pull' };
            const expectedActions = [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "pulling",
                    },
                },
                { type: 'STUB_ERROR' },
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: false,
                        processingLabel: "",
                    },
                }
                ];

            try {
                await store.dispatch(actions.installMarketService('1'));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('checkMarketServiceUpdate()', () => {
        it('success', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.resolve());

            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'check' };
            const expectedActions = [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "checking",
                    },
                }
            ];

            await store.dispatch(actions.checkMarketServiceUpdate('1'));

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);

        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'check' };
            const expectedActions = [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "checking",
                    },
                },                      
                { type: 'STUB_ERROR' },
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: false,
                        processingLabel: "",
                    },
                },    
            ];

            try {
                await store.dispatch(actions.checkMarketServiceUpdate('1'));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });


    it('handlePublishEvent() - no update', () => {
        const event ={
            field:'version',
            value: {"updateAvailable":false,"updated":false},
            entity: {
                getId:()=>'id1',
                serialize: ()=> ({ state: 'pulled'})
            }
        }
        store.dispatch(actions.handlePublishEvent(event));
        const expected =[{
            "payload": {
            "deviceName": "System",
            "id": "toastId",
            "message": "Service label is up-to-date.",
            "meta":  {
                "entityId": "id1",
                "type": "MARKET_EVENT",
            },
            "title": "No updates available",
            },
            "type": "CALL_TOAST_NOTIFICATION",
        },
        {
            "payload":  {
            "name": "id1",
            "updated":  {
                "version":  {
                "updateAvailable": false,
                "updated": false,
                },
            },
            },
            "type": "UPDATE_MARKET_SERVICE_ATTRIBUTE",
        },
        {
            "payload":  {
            "entityId": "id1",
            "isProcessing": false,
            "processingLabel": "",
            },
            "type": "CHANGE_CHECK_PROCCESSING",
        }]
        
        expect(store.getActions()).toEqual(expected);
    });



    it('handlePublishEvent() - update available', () => {
        const event ={
            field:'version',
            value: {"updateAvailable":true,"updated":false},
            entity: {
                getId:()=>'id1',
                serialize: ()=> ({ state: 'pulled'})
            }
        }
        store.dispatch(actions.handlePublishEvent(event));
        const expected =[{
            "payload": {
            "deviceName": "System",
            "id": "toastId",
            "message": "Service label has new updates and can be updated!",
            "meta":  {
                "entityId": "id1",
                "type": "MARKET_EVENT",
            },
            "title": "Update available",

            },
            "type": "CALL_TOAST_NOTIFICATION",
        },
        {
            "payload":  {
            "name": "id1",
            "updated":  {
                "version":  {
                "updateAvailable": true,
                "updated": false,
                },
            },
            },
            "type": "UPDATE_MARKET_SERVICE_ATTRIBUTE",
        },
        {
            "payload":  {
            "entityId": "id1",
            "isProcessing": false,
            "processingLabel": "",
            },
            "type": "CHANGE_CHECK_PROCCESSING",
        }]
        
        expect(store.getActions()).toEqual(expected);
    });

    describe('updateMarketService()', () => {
        it('success', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.resolve());
           
            const expectedActions = [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "updating",
                    },
                }
            ];
            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'pull' };

            await store.dispatch(actions.updateMarketService('1'));
            
            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'pull' };
            const expectedActions = [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "updating",
                    },
                },
                { type: 'STUB_ERROR' },
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: false,
                        processingLabel: "",
                    },
                }
            ];

            try {
                await store.dispatch(actions.updateMarketService('1'));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteMarketService()', () => {
        it('success', async () => {
            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'remove' };

            await store.dispatch(actions.deleteMarketService('1'));
            const expectedActions = [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "removing",
                    },
                },
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: false,
                        processingLabel: "",
                    },
                }
                ];

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: 'BRIDGE_TYPES', entityId: '1', field: 'event', value: 'remove' };
            const expectedActions =  [
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: true,
                        processingLabel: "removing",
                    },
                },
                { type: 'STUB_ERROR' },
                {
                    type: "CHANGE_CHECK_PROCCESSING",
                    payload : {
                        entityId: "1",
                        isProcessing: false,
                        processingLabel: "",
                    },
                }
                ];

            try {
                await store.dispatch(actions.deleteMarketService('1'));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    it('onNewBridgeTypeEntity()', async () => {
        const expectedActions = [
            { type : actions.ADD_MARKET_SERVICE, payload: { service: { id: '1', name: 'test' } } }
        ];

        await store.dispatch(actions.onNewBridgeTypeEntity(getMockEntities()[0]));

        expect(store.getActions()).toEqual(expectedActions);
    });

    function setupSpies() {
        homieActions.handlePublishError = jest.fn().mockReturnValue({ type: 'STUB_ERROR' });
        spyOn(actions, 'startProcessing');
        spyOn(actions, 'showMarketNotification');
     
        spyOn(mapperService, 'mapServiceTypeUpdateEntityToServiceTypeUpdate').and.callFake(item=>item);

    }

    function getMockEntities() {
        return [
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                serialize          : () => ({ id: '1', name: 'test' })
            },
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                serialize          : () => ({ id: '2', name: 'test2' })
            }
        ];
    }
});


