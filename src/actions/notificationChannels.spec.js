import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './notificationChannels';
import smartHome from '../smartHome/smartHomeSingleton';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import api from '../apiSingleton';
import {
    NOTIFICATION_CHANNELS_LIST_MOCK,
    USER_NOTIFICATION_CHANNELS_LIST_MOCK
} from '../__mocks__/notificationChannelsMock';
import * as homieActions from './homie';

jest.mock('../apiSingleton');
jest.mock('../smartHome/smartHomeSingleton');
jest.mock('../utils/homie/dispatcherSingleton');
jest.mock('../utils/mapper/channels', () => {
    return {
        mapNotificationChannelEntityToNotificationChannel : jest.fn().mockImplementation(item => item)
    };
});
jest.mock('./homie');

const mockStore = configureMockStore([ thunk ]);

describe('notificationChannels actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({});
    });

    it('getNotificationChannels() success', async () => {
        const expectedChannels = [];

        const expectedActions = [
            { type: actions.GET_NOTIFICATION_CHANNELS, payload: { notificationChannels: expectedChannels } }
        ];

        api.notificationChannels.getChannelsList = jest.fn().mockReturnValue(Promise.resolve(expectedChannels));

        await store.dispatch(actions.getNotificationChannels());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('getUserNotificationChannels() success', async () => {
        smartHome.getEntities = jest.fn().mockReturnValue(Promise.resolve(getMockEntities()));

        const expectedChannels = [
            { id: '1', alias: 'test', configuration: {} },
            { id: '2', alias: 'test2', configuration: {} }
        ];
        const expectedActions = [
            { type: actions.GET_USER_NOTIFICATION_CHANNELS, payload: { userNotificationChannels: expectedChannels } }
        ];

        await store.dispatch(actions.getUserNotificationChannels());

        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('createUserNotificationChannel()', () => {
        it('success', async () => {
            const payload = { alias: 'test', configuration: {} };
            const expectedActions = [];

            await store.dispatch(actions.createUserNotificationChannel(payload));

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.createEntityRequest).toHaveBeenCalledWith(actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, payload);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });

            smartHome.createEntityRequest = jest.fn().mockReturnValue(Promise.reject(error));

            const payload = { id: '1', alias: 'test' };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            try {
                await store.dispatch(actions.createUserNotificationChannel(payload));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.createEntityRequest).toHaveBeenCalledWith(actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, payload);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('activateUserNotificationChannel()', () => {
        it('success', async () => {
            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', field: 'state', value: 'enabled' };

            await store.dispatch(actions.activateUserNotificationChannel('1'));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', field: 'state', value: 'enabled' };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            await store.dispatch(actions.activateUserNotificationChannel('1'));

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('deactivateUserNotificationChannel()', () => {
        it('success', async () => {
            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', field: 'state', value: 'disabled' };

            await store.dispatch(actions.deactivateUserNotificationChannel('1'));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', field: 'state', value: 'disabled' };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            await store.dispatch(actions.deactivateUserNotificationChannel('1'));

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('setUserNotificationChannelsSearchQuery()', () => {
        it('success', async () => {
            const searchQuery = 'some';
            const expectedActions = [ { type: actions.SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY, payload: { searchQuery } } ];

            await store.dispatch(actions.setUserNotificationChannelsSearchQuery(searchQuery));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('setUserNotificationChannelsSortOrder()', () => {
        it('success', async () => {
            const sortOrder = 'some';

            const expectedActions = [ { type: actions.SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER, payload: { sortOrder } } ];

            await store.dispatch(actions.setUserNotificationChannelsSortOrder(sortOrder));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('setUserNotificationChannelsCurrentPage()', () => {
        it('success', async () => {
            const currentPage = 'some';

            const expectedActions = [ { type: actions.SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE, payload: { currentPage } } ];

            await store.dispatch(actions.setUserNotificationChannelsCurrentPage(currentPage));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('updateUserNotificationChannel', () => {
        it('success', async () => {
            const payload = { alias: 'name', configuration: {} };
            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', value: payload };

            await store.dispatch(actions.updateUserNotificationChannel('1', payload));

            expect(attributeDispatcher.updateEntity).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            attributeDispatcher.updateEntity = jest.fn().mockReturnValue(Promise.reject(error));

            const payload = { alias: 'name', configuration: {} };
            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', value: payload };
            const expectedActions = [ { type: 'STUB_ERROR' } ];

            try {
                await store.dispatch(actions.updateUserNotificationChannel('1', payload));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(attributeDispatcher.updateEntity).toHaveBeenCalledWith(expected);
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    describe('sendTestMessageToUserNotificationChannel', () => {
        it('success', async () => {
            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', field: 'event', value: 'send' };

            await store.dispatch(actions.sendTestMessageToUserNotificationChannel('1'));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            spyOn(homieActions, 'handlePublishError').and.returnValue({ type: 'STUB_ERROR' });
            attributeDispatcher.setAsyncAttribute = jest.fn().mockReturnValue(Promise.reject(error));

            const expected = { type: actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, entityId: '1', field: 'event', value: 'send' };

            await store.dispatch(actions.sendTestMessageToUserNotificationChannel('1'));

            expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
        });
    });

    describe('deleteUserNotificationChannel()', () => {
        it('success', async () => {
            const payload = '1';
            await store.dispatch(actions.deleteUserNotificationChannel(payload));

            expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith(actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, payload);
        });

        it('failed', async () => {
            const error = { code: 'VALIDATION_ERROR' };
            smartHome.deleteEntityRequest = jest.fn().mockReturnValue(Promise.reject(error));

            const expectedActions = [ { type: "STUB_ERROR" } ];

            try {
                await store.dispatch(actions.deleteUserNotificationChannel('1'));
            } catch {}

            expect(store.getActions()).toEqual(expectedActions);
            expect(smartHome.deleteEntityRequest).toHaveBeenCalledWith(actions.NOTIFICATION_CHANNELS_ENTITY_TYPE, '1');
            expect(homieActions.handlePublishError).toHaveBeenCalledWith(error);
        });
    });

    it('onNewNotificationChannel()', async () => {
        const expectedActions = [
            { type : actions.ADD_USER_NOTIFICATION_CHANNEL, payload: { channel: { id: '1', alias: 'test', configuration: {} } } }
        ];

        await store.dispatch(actions.onNewNotificationChannel(getMockEntities()[0]));

        expect(store.getActions()).toEqual(expectedActions);
    });


    it('onDeleteUserNotificationChannel()', async () => {
        const expectedActions = [
            { type: actions.DELETE_USER_NOTIFICATION_CHANNEL, payload: { id: '1' } }
        ];

        await store.dispatch(actions.onDeleteUserNotificationChannel('1'));

        expect(store.getActions()).toEqual(expectedActions);
    });

    function setupSpies() {
        homieActions.handlePublishError = jest.fn().mockReturnValue({ type: 'STUB_ERROR' });
    }

    function getMockEntities() {
        return [
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                serialize          : () => ({ id: '1', alias: 'test', configuration: {} })
            },
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                serialize          : () => ({ id: '2', alias: 'test2', configuration: {} })
            }
        ];
    }
});

