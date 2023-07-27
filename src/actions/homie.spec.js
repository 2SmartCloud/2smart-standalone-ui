import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import * as actions from './homie';
import * as groupsActions from './groups';

import * as interfaceActions from './interface';


jest.mock('../utils/homie/dispatcherSingleton');

const mockStore = configureMockStore([ thunk ]);

describe('homie actions', () => {
    let store;

    beforeEach(() => {
        jest.clearAllMocks();

        setupSpies();

        store = mockStore({});
    });

    describe('handlePublishError()', () => {
        it('should dispatch notification action with required payload for entity', async () => {
            const error = { code: 'ERROR', message: 'Error message', entityId: 'entityId' };
            const expectedActions = [
                {
                    type    : 'STUB_CALL_NOTIFICATION',
                    payload : {
                        meta    : { code: 'ERROR', message: 'Error message', entityId: 'entityId' },
                        title   : 'Error',
                        message : 'Error message'
                    }
                }
            ];

            await store.dispatch(actions.handlePublishError(error));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should dispatch notification action with required payload for attribute', async () => {
            const error = {
                code       : 'ERROR',
                message    : 'Error message',
                deviceId   : 'deviceId',
                nodeId     : 'nodeId',
                propertyId : 'propertyId'
            };

            const expectedActions = [
                {
                    type    : 'STUB_CALL_NOTIFICATION',
                    payload : {
                        meta : {
                            deviceId   : 'deviceId',
                            nodeId     : 'nodeId',
                            propertyId : 'propertyId' },
                        title   : 'Error',
                        message : 'Error message'
                    }
                }
            ];

            await store.dispatch(actions.handlePublishError(error));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should dispatch notification action for ERROR code if no fields was given', async () => {
            const error = { code: 'VALIDATION', message: 'Validation message', entityId: 'entityId' };
            const expectedActions = [
                {
                    type    : 'STUB_CALL_NOTIFICATION',
                    payload : {
                        meta    : { code: 'VALIDATION', message: 'Validation message', entityId: 'entityId' },
                        title   : 'Validation error',
                        message : 'Validation message'
                    }
                }
            ];

            await store.dispatch(actions.handlePublishError(error));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should do nothing if error has VALIDATION code and fields object provided', async () => {
            const error = { code: 'VALIDATION', message: 'Validation message', fields: { field: 'REQUIRED' } };

            await store.dispatch(actions.handlePublishError(error));

            expect(store.getActions()).toHaveLength(0);
        });
    });

    describe('setAsyncAttributeDispatcher() for attributes', () => {
        it('success', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.resolve());


            const baseParams = { hardwareType: 'device', propertyType: 'options', deviceId: 'deviceId',  nodeId: null, propertyId: 'option1', field: 'value' };
            const expected = [
                {
                    type            : actions.CHANGE_ATRIBUTE_PROCESSING_STATUS,
                    ...baseParams,
                    prcessingStatus : true

                }
            ];
            const params = { ...baseParams, value: '', type: 'DEVICE_OPTION' };

            await store.dispatch(actions.setAsyncAttributeDispatcher(params));

            expect(store.getActions()).toEqual(expected);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(params);
        });

        it('error', async () => {
            const error = { code: 'VALIDATION_ERROR', message: 'validation' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const baseParams = { hardwareType: 'device', propertyType: 'options', deviceId: 'deviceId', nodeId: null, propertyId: 'option1', field: 'value' };
            const expected = [
                {
                    type            : actions.CHANGE_ATRIBUTE_PROCESSING_STATUS,
                    ...baseParams,
                    prcessingStatus : true

                },
                {
                    type  : actions.ADD_ATTRIBUTE_ERROR,
                    error : {
                        value : 'validation',
                        ...baseParams
                    }
                },
                {
                    type    : 'STUB_CALL_NOTIFICATION',
                    payload : {
                        meta : {
                            deviceId   : 'deviceId',
                            nodeId     : null,
                            propertyId : 'option1' },
                        message : 'validation',
                        title   : 'Validation error'
                    }
                }
            ];
            const params = { ...baseParams, value: '', type: 'DEVICE_OPTION' };

            await store.dispatch(actions.setAsyncAttributeDispatcher(params));

            expect(store.getActions()).toEqual(expected);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(params);
        });
    });


    describe('setAsyncAttributeDispatcher() for groups', () => {
        it('success', async () => {
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.resolve());

            const baseParams = { hardwareType: 'group', propertyType: 'group', type: 'GROUP_OF_PROPERTIES', deviceId: 'groupId',  nodeId: null, propertyId: null, field: 'value' };
            const expected = [
                {
                    type    : groupsActions.CHANGE_GROUP_VALUE_PROCESSING,
                    payload : {
                        status : true,
                        id     : 'groupId'
                    }

                }
            ];
            const params = { ...baseParams, value: '', type: 'GROUP_OF_PROPERTIES'};

            await store.dispatch(actions.setAsyncAttributeDispatcher(params));

            expect(store.getActions()).toEqual(expected);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(params);
        });

        it('error', async () => {
            const error = { code: 'VALIDATION_ERROR', message: 'validation' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const baseParams = { hardwareType: 'group', propertyType: 'group', type: 'GROUP_OF_PROPERTIES', deviceId: 'groupId',  nodeId: null, propertyId: null, field: 'value' };

            const expected = [
                {
                    type    : groupsActions.CHANGE_GROUP_VALUE_PROCESSING,
                    payload : {
                        status : true,
                        id     : 'groupId'
                    }
                },
                {
                    type    : groupsActions.SET_GROUP_VALUE_ERROR,
                    payload : {
                        id : 'groupId',
                        error
                    }
                },
                {
                    type    : 'STUB_CALL_NOTIFICATION',
                    payload : {
                        meta : {
                            deviceId   : 'groupId',
                            nodeId     : null,
                            propertyId : null },
                        message : 'validation',
                        title   : 'Validation error'
                    }
                }
            ];
            const params = { ...baseParams, value: '', type: 'GROUP_OF_PROPERTIES' };

            await store.dispatch(actions.setAsyncAttributeDispatcher(params));

            expect(store.getActions()).toEqual(expected);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(params);
        });
    });


    describe('handleAttributeError() ', () => {
        it('for groups', async () => {
            const baseParams = { hardwareType: 'group', propertyType: 'group', deviceId: 'groupId',  nodeId: null, propertyId: null, field: 'value' };
            const error = { code: 'VALIDATION_ERROR', message: 'validation' };

            const expected = [
                {
                    type    : groupsActions.SET_GROUP_VALUE_ERROR,
                    payload : {
                        id : 'groupId',
                        error
                    }
                },
                {
                    type    : 'STUB_CALL_NOTIFICATION',
                    payload : {
                        meta : {
                            deviceId   : 'groupId',
                            nodeId     : null,
                            propertyId : null },
                        message : 'validation',
                        title   : 'Validation error'
                    }
                }
            ];

            await store.dispatch(actions.handleAttributeError({ ...baseParams, ...error }));

            expect(store.getActions()).toEqual(expected);
        });

        it('for attribute', async () => {
            const error = { code: 'VALIDATION_ERROR', message: 'validation' };

            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const baseParams = { hardwareType: 'device', propertyType: 'options', deviceId: 'deviceId', nodeId: null, propertyId: 'option1', field: 'value' };
            const expected = [
                {
                    type  : actions.ADD_ATTRIBUTE_ERROR,
                    error : {
                        value : 'validation',
                        ...baseParams
                    }
                },
                {
                    type    : 'STUB_CALL_NOTIFICATION',
                    payload : {
                        meta : {
                            deviceId   : 'deviceId',
                            nodeId     : null,
                            propertyId : 'option1' },
                        message : 'validation',
                        title   : 'Validation error'
                    }
                }
            ];
            const params = { ...baseParams, ...error };

            await store.dispatch(actions.handleAttributeError(params));

            expect(store.getActions()).toEqual(expected);
        });
    });


    function setupSpies() {
        spyOn(interfaceActions, 'callValErrNotification').and
            .callFake(payload => ({ type: 'STUB_CALL_NOTIFICATION', payload }));
    }
});
