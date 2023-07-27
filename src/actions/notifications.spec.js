import configureMockStore      from 'redux-mock-store'
import thunk                   from 'redux-thunk'
import * as actions            from './notifications';
import smartHome               from '../smartHome/smartHomeSingleton';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import * as homieActions       from './homie';

jest.mock('../apiSingleton');
jest.mock('../smartHome/smartHomeSingleton');
jest.mock('../utils/homie/dispatcherSingleton');
jest.mock('../utils/mapper/notifications', () => {
    return {
        mapNotificationEntityToNotification : jest.fn().mockImplementation(item => item)
    };
});
jest.mock('./homie');

const mockStore = configureMockStore([ thunk ]);

describe('notifications actions', () => {
    let store;

    beforeEach(() => {
        setupSpies();

        store = mockStore({});
    });

    it('getNotifications() success', async () => {
        smartHome.getEntities = jest.fn().mockReturnValue(Promise.resolve(getMockEntities()));

        const notifications = [
            { id: '1', message: 'test' },
            { id: '2', message: 'test2' }
        ];
        const expectedActions = [
            { type: actions.GET_NOTIFICATIONS, notifications }
        ];

        await store.dispatch(actions.getNotifications());

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('updateNotificationsIsRead() success', async () => {
        jest.useFakeTimers();
        const expected = {
            type     : actions.NOTIFICATION_ENTITY_TYPE,
            entityId : '1',
            value    : true,
            field    : 'isRead'
        };

        await store.dispatch(actions.updateNotificationsIsRead({ list: [ '1' ], isRead: true }));

        jest.advanceTimersByTime(10);

        expect(attributeDispatcher.setAsyncAttribute).toHaveBeenCalledWith(expected);
    });

    function setupSpies() {
        homieActions.handlePublishError = jest.fn().mockReturnValue({ type: 'STUB_ERROR' });
    }

    function getMockEntities() {
        return [
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                serialize          : () => ({ id: '1', message: 'test' })
            },
            {
                onAttributePublish : () => {},
                onErrorPublish     : () => {},
                serialize          : () => ({ id: '2', message: 'test2' })
            }
        ];
    }
});
