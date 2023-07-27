import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './userServices';
import smartHome from '../smartHome/smartHomeSingleton';
import * as mapperService from '../utils/mapper/service';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import * as homieActions from './homie';

jest.mock('./homie');
jest.mock('../utils/homie/dispatcherSingleton');

const mockStore = configureMockStore([ thunk ]);

describe('userServices actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({});
    });

    it('getBridgeEntities()', async () => {
        const expectedServices = [
            { id: '1', name: 'test' },
            { id: '2', name: 'test2' }
        ];
        const expectedActions = [
            { type: actions.GET_BRIDGE_ENTITIES, payload: { services: expectedServices } }
        ];

        await store.dispatch(actions.getBridgeEntities());

        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('createBridgeEntity()', () => {
        it('success', async () => {
            const payload = { id: '1', test: 'test' };
            const expectedActions = [];

            await store.dispatch(actions.createBridgeEntity(payload));

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.createEntityRequest).toHaveBeenCalledWith('BRIDGE', payload);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            smartHome.createEntityRequest.and.returnValue(Promise.reject(error));

            const payload = { id: '1', test: 'test' };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            try {
                await store.dispatch(actions.createBridgeEntity(payload));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.createEntityRequest).toHaveBeenCalledWith('BRIDGE', payload);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteBridgeEntity()', () => {
        it('success', async () => {
            const payload = '1';
            const expectedActions = [];

            await store.dispatch(actions.deleteBridgeEntity(payload));

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith('BRIDGE', payload);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            smartHome.deleteEntityRequest.and.returnValue(Promise.reject(error));

            const payload = { id: '1', test: 'test' };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            try {
                await store.dispatch(actions.deleteBridgeEntity(payload));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith('BRIDGE', payload);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('updateBridgeEntity()', () => {
        it('success', async () => {
            const payload = { test: 'test', test2: 'test2' };
            const expected = { type: 'BRIDGE', entityId: '1', field: 'configuration', value: payload };

            await store.dispatch(actions.updateBridgeEntity('1', payload));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const payload = { test: 'test', test2: 'test2' };
            const expected = { type: 'BRIDGE', entityId: '1', field: 'configuration', value: payload };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            try {
                await store.dispatch(actions.updateBridgeEntity('1', payload));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('activateUserService()', () => {
        it('success', async () => {
            const expected = { type: 'BRIDGE', entityId: '1', field: 'event', value: 'start' };

            await store.dispatch(actions.activateUserService('1'));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: 'BRIDGE', entityId: '1', field: 'event', value: 'start' };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            await store.dispatch(actions.activateUserService('1'));

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('deactivateUserService()', () => {
        it('success', async () => {
            const expected = { type: 'BRIDGE', entityId: '1', field: 'event', value: 'stop' };

            await store.dispatch(actions.deactivateUserService('1'));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: 'BRIDGE', entityId: '1', field: 'event', value: 'stop' };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            await store.dispatch(actions.deactivateUserService('1'));

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    it('onNewBridgeEntity()', async () => {
        const expectedActions = [
            { type: actions.ADD_BRIDGE_ENTITY, payload: { service: { id: '1', name: 'test' } } }
        ];

        await store.dispatch(actions.onNewBridgeEntity(getMockEntities()[0]));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('onDeleteBridgeEntity()', async () => {
        const expectedActions = [
            { type: actions.DELETE_BRIDGE_ENTITY, payload: { id: '1' } }
        ];

        await store.dispatch(actions.onDeleteBridgeEntity('1'));

        expect(store.getActions()).toEqual(expectedActions);
    });

    function setupSpies() {
        attributeDispatcher.setAsyncAttribute.mockReset();

        spyOn(smartHome, 'getEntities').and.returnValue(Promise.resolve(getMockEntities()));
        spyOn(smartHome, 'createEntityRequest').and.stub();
        spyOn(smartHome, 'deleteEntityRequest').and.stub();
        spyOn(mapperService, 'mapBridgeEntityTOToService').and.callFake(item => item);
    }

    function getMockEntities() {
        return [
            {
                onAttributePublish : () => {},
                serialize          : () => ({ id: '1', name: 'test' })
            },
            {
                onAttributePublish : () => {},
                serialize          : () => ({ id: '2', name: 'test2' })
            }
        ];
    }
});
