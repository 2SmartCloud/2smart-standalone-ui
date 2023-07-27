import configureMockStore      from 'redux-mock-store'
import thunk                   from 'redux-thunk'
import * as actions            from './systemUpdates';
import toastsMeta              from '../components/base/toast/meta';
import * as toasts             from '../components/base/toast/callToast';
import {
    ENTITY_ID,
    SYSTEM_UPDATES_ENTITY_TYPE
}                              from './systemUpdates';
import smartHome               from '../smartHome/smartHomeSingleton';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import * as homieActions       from './homie';

jest.mock('../smartHome/smartHomeSingleton');
jest.mock('../utils/homie/dispatcherSingleton');
jest.mock('../components/base/toast/callToast')
jest.mock('./homie');

const mockStore = configureMockStore([ thunk ]);

describe('systemUpdtaes actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({});
    });

    describe('getSystemUpdates()', () => {
        it('success', async () => {
            smartHome.getEntities = jest.fn().mockReturnValue(Promise.resolve(getMockEntities()));

            const expected = {
                id              : 'services',
                entityTopic     : 'entityTopic',
                status          : 'status',
                event           : 'event',
                lastUpdate      : '24.08.2020',
                availableUpdate : '24.08.2020'
            };
            const expectedActions = [ {
                type: actions.CHECK_SYSTEM_UPDATES_REQUEST
            }, {
                type: actions.CHECK_SYSTEM_UPDATES_SUCCESS,
                payload: { systemUpdates: expected }
            } ];

            await store.dispatch(actions.getSystemUpdates());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            smartHome.getEntities = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [ {
                type: actions.CHECK_SYSTEM_UPDATES_REQUEST
            }, {
                type: actions.CHECK_SYSTEM_UPDATES_ERROR
            } ];

            await store.dispatch(actions.getSystemUpdates());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('checkSystemUpdates()', () => {
        it('success', async () => {
            const expectedActions = [ {
                    type    : actions.RUN_ACTION_START,
                    payload : { actionType: 'checkUpdates' }
            } ];

            await store.dispatch(actions.checkSystemUpdates());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'check',
                entityId : ENTITY_ID
            };
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        xit('failed', async () => {
            smartHome.checkSystemUpdates = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [ {
                type    : actions.RUN_ACTION_START,
                payload : { actionType: 'checkUpdates' }
            }, {
                type:  actions.RUN_ACTION_END,
                payload : { actionType: 'checkUpdates' }
            } ];

            await store.dispatch(actions.checkSystemUpdates());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'check',
                entityId : ENTITY_ID
            };
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });
    });

    describe('downloadUpdates()', () => {
        it('success', async () => {
            const expectedActions = [ {
                    type    : actions.RUN_ACTION_START,
                    payload : { actionType: 'downloadUpdates' }
            }, {
                type:  actions.RUN_ACTION_END,
                payload : { actionType: 'downloadUpdates' }
            } ];
            await store.dispatch(actions.downloadUpdates());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'download',
                entityId : ENTITY_ID
            };

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            // expect(callToast).toHaveBeenCalledWith({
            //     meta    : toastsMeta.SYSTEM_UPDATES_DOWNLOAD_SUCCESS,
            //     title   : 'System updates has been loaded',
            //     message : 'You can apply updates'
            // });
        });

        it('failed', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [ {
                type    : actions.RUN_ACTION_START,
                    payload : { actionType: 'downloadUpdates' }
            },{
                payload:{
                    id: 'id',
                    message: "Please try again later",
                    meta: "SYSTEM_UPDATES_DOWNLOAD_ERROR",
                    title: "System update hasn't been loaded",
                },
                type: "CALL_TOAST_NOTIFICATION",
            }, {
                type:  actions.RUN_ACTION_END,
                payload : { actionType: 'downloadUpdates' }
            } ];
            await store.dispatch(actions.downloadUpdates());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'download',
                entityId : ENTITY_ID
            };
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(toasts.callValErr).toHaveBeenCalledWith({
                meta    : toastsMeta.SYSTEM_UPDATES_DOWNLOAD_ERROR,
                message : 'Please try again later',
                title   : 'System update hasn\'t been loaded'
            });
        });
    });

    describe('applyUpdates()', () => {
        it('success', async () => {
            const expectedActions = [ {
                    type    : actions.RUN_ACTION_START,
                    payload : { actionType: 'applyUpdates' }
            }, {
                type:  actions.RUN_ACTION_END,
                payload : { actionType: 'applyUpdates' }
            } ];

            await store.dispatch(actions.applyUpdates());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'update',
                entityId : ENTITY_ID
            };

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [ {
                type    : actions.RUN_ACTION_START,
                    payload : { actionType: 'applyUpdates' }
            }, {
                type:  actions.RUN_ACTION_END,
                payload : { actionType: 'applyUpdates' }
            } ];

            await store.dispatch(actions.applyUpdates());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'update',
                entityId : ENTITY_ID
            };
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });
    });

    describe('restartApplication()', () => {
        it('success', async () => {
            const expectedActions = [ {
                    type    : actions.RUN_ACTION_START,
                    payload : { actionType: 'restart' }
            }, {
                type:  actions.RUN_ACTION_END,
                payload : { actionType: 'restart' }
            } ];

            await store.dispatch(actions.restartApplication());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'restart',
                entityId : ENTITY_ID
            };

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [ {
                type    : actions.RUN_ACTION_START,
                    payload : { actionType: 'restart' }
            }, {
                type:  actions.RUN_ACTION_END,
                payload : { actionType: 'restart' }
            } ];

            await store.dispatch(actions.restartApplication());

            expect(store.getActions()).toEqual(expectedActions);

            const expected = {
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'restart',
                entityId : ENTITY_ID
            };
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });
    });

    function setupSpies() {
        homieActions.handlePublishError = jest.fn().mockReturnValue({ type: 'STUB_ERROR' });
        toasts.callValErr=jest.fn().mockReturnValue('id')
    }

    function getMockEntities() {
        return {
            [ENTITY_ID]: {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                serialize          : () => ({
                    id                 : 'services',
                    entityTopic        : 'entityTopic',
                    status             : 'status',
                    event              : 'event',
                    'last-update'      : 1598227556657,
                    'available-update' : 1598227556657
                })
            }
        };
    }
});

