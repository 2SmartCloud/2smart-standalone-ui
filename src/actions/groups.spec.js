import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { GROUPS_LIST } from '../__mocks__/groupsListMock';
import smartHome from '../smartHome/smartHomeSingleton';
import * as mapperService from '../utils/mapper/groups';

import * as actions from './groups';
import * as homieActions from './homie';


const mockStore = configureMockStore([ thunk ]);

describe('groups actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({});
    });

    it('getGroupsEntities()', async () => {
        const groupsList = [
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

        const expectedActions = [
            { type: actions.GET_GROUP_ENTITIES, payload: { groups: groupsList } }
        ];

        await store.dispatch(actions.getGroupsEntities());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('onNewGroupEntity()', async () => {
        const newGroup = {
            id        : '1',
            rootTopic : 'groups-of-properties/1',
            label     : 'First group'
        };
        const expectedActions = [
            { type: actions.ADD_GROUP_ENTITY, payload: { group: newGroup } }
        ];

        await store.dispatch(actions.onNewGroupEntity(getMockEntities()[0]));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('createGroupEntity() success', async () => {
        const payload = {
            id        : '1',
            rootTopic : 'groups-of-properties/1',
            label     : 'First group'
        };

        const expectedActions = [];

        await store.dispatch(actions.createGroupEntity(payload));

        expect(store.getActions()).toEqual(expectedActions);
        expect(smartHome.createEntityRequest).toHaveBeenCalledWith('GROUP_OF_PROPERTIES', payload);
    });

    it('createGroupEntity() failed', async () => {
        const error = { code: 'VALIDATION_ERROR' };

        spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
        smartHome.createEntityRequest.and.returnValue(Promise.reject(error));

        const payload = { id: '1', test: 'test' };
        const expectedActions = [ { type: 'STUB_ERROR' } ];

        await store.dispatch(actions.createGroupEntity(payload));

        expect(store.getActions()).toEqual(expectedActions);
        expect(smartHome.createEntityRequest).toHaveBeenCalledWith('GROUP_OF_PROPERTIES', payload);
        expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
    });

    it('deleteGroupEntity() success', async () => {
        const entityId = '1';
        const expectedActions = [];

        await store.dispatch(actions.deleteGroupEntity(entityId));

        expect(store.getActions()).toEqual(expectedActions);
        expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith('GROUP_OF_PROPERTIES', entityId);
    });

    it('deleteGroupEntity() failed', async () => {
        const error = { code: 'VALIDATION_ERROR' };

        spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });

        const entityId = '1';
        const expectedActions = [ { type: 'STUB_ERROR' } ];

        try {
            await store.dispatch(actions.deleteGroupEntity(entityId));

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith('GROUP_OF_PROPERTIES', entityId);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        } catch {}
    });


    it('onDeleteGroupEntity()', async () => {
        const expectedActions = [
            { type: actions.DELETE_GROUP_ENTITY, payload: { id: '1' } }
        ];

        await store.dispatch(actions.onDeleteGroupEntity('1'));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('handlePublishEvent()', () => {
        const expected = [
            {
                type    : 'CHANGE_GROUP_VALUE_PROCESSING',
                payload : {
                    id     : 'groupId',
                    status : false
                }
            }, {
                type    : 'UPDATE_GROUP',
                payload : {
                    id      : 'groupId',
                    updated : {
                        value : 'newValue'
                    }
                }
            } ];

        store.dispatch(actions.handlePublishEvent({ field: 'value', value: 'newValue', entity: { getId: () => 'groupId' } }));

        expect(store.getActions()).toEqual(expected);
    });

    it('startGroupValueProcessing', () => {
        const entityId = '1';
        const expected = [
            {
                type    : 'CHANGE_GROUP_VALUE_PROCESSING',
                payload : {
                    id     : '1',
                    status : true
                }
            } ];

        store.dispatch(actions.startGroupValueProcessing(entityId));

        expect(store.getActions()).toEqual(expected);
    });

    it('stopGroupValueProcessing', () => {
        const entityId = '1';
        const expected = [
            {
                type    : 'CHANGE_GROUP_VALUE_PROCESSING',
                payload : {
                    id     : '1',
                    status : false
                }
            } ];

        store.dispatch(actions.stopGroupValueProcessing(entityId));

        expect(store.getActions()).toEqual(expected);
    });

    it('setGroupValueError', () => {
        const entityId = '1';
        const expected = [
            {
                type    : 'SET_GROUP_VALUE_ERROR',
                payload : {
                    id    : '1',
                    error : { code: 'errorCode' }
                }
            } ];

        store.dispatch(actions.setGroupValueError(entityId, { code: 'errorCode' }));

        expect(store.getActions()).toEqual(expected);
    });

    it('removeGroupValueError', () => {
        const entityId = '1';
        const expected = [
            {
                type    : 'REMOVE_GROUP_VALUE_ERROR',
                payload : {
                    id : '1'
                }
            } ];

        store.dispatch(actions.removeGroupValueError(entityId, { code: 'errorCode' }));

        expect(store.getActions()).toEqual(expected);
    });

    function setupSpies() {
        spyOn(smartHome, 'getEntities').and.returnValue(Promise.resolve(getMockEntities()));
        spyOn(smartHome, 'createEntityRequest').and.stub();
        spyOn(smartHome, 'deleteEntityRequest').and.stub();
        spyOn(mapperService, 'mapGroupEntityToGroup').and.callFake(item => item);
    }

    function getMockEntities() {
        return [
            {
                getId              : () => {},
                onAttributePublish : () => {},
                serialize          : () => ({
                    id        : '1',
                    rootTopic : 'groups-of-properties/1',
                    label     : 'First group'
                })
            },
            {
                onAttributePublish : () => {},
                serialize          : () => ({
                    id        : '2',
                    rootTopic : 'groups-of-properties/2',
                    label     : 'Second group'
                })
            }
        ];
    }
});
