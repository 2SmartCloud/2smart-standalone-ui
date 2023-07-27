import * as actions                 from '../actions/notificationChannels';
import reducer                      from './notificationChannels';
import { NOTIFICATIONS_SORT_ORDER } from '../assets/constants/localStorage';
import { getData }                  from '../utils/localStorage';

jest.mock('../utils/localStorage');

describe('marketServices reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            userChannels : {
                list        : [],
                isFetching  : true,
                searchQuery : '',
                sortOrder   : 'ASC',
                currentPage : 1
            },
            channels : {
                list       : [],
                isFetching : true
            }
        }
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('should call getData from localStorage on init', () => {
        reducer(undefined, {});

        expect(getData).toHaveBeenCalledWith(NOTIFICATIONS_SORT_ORDER);
    });

    it('GET_NOTIFICATION_CHANNELS', () => {
        const notificationChannels = [ ];
        const action = { type: actions.GET_NOTIFICATION_CHANNELS, payload: { notificationChannels } };
        const result = reducer(initialState, action);

        expect(result.channels.list).toEqual(notificationChannels);
        expect(result.channels.isFetching).toBeFalsy();
    });

    it('GET_USER_NOTIFICATION_CHANNELS', () => {
        const userNotificationChannels = [ ];
        const action = { type: actions.GET_USER_NOTIFICATION_CHANNELS, payload: { userNotificationChannels } };
        const result = reducer(initialState, action);

        expect(result.userChannels.list).toEqual(userNotificationChannels);
        expect(result.userChannels.isFetching).toBeFalsy();
    });

    it('ADD_USER_NOTIFICATION_CHANNEL', () => {
        initialState.userChannels.list = [ { id: '1', test: 'test' } ];
        const channel = { id: '2', test: 'test2' };
        const action = { type: actions.ADD_USER_NOTIFICATION_CHANNEL, payload: { channel } };
        const result = reducer(initialState, action);
        const expected = [ { id: '1', test: 'test' }, { id: '2', test: 'test2' } ];

        expect(result.userChannels.list).toEqual(expected);
    });

    it('UPDATE_USER_NOTIFICATION_CHANNEL', () => {
        initialState.userChannels.list = [ { id: '1', test: 'test' }, { id: '2', test: 'test' } ];
        const action = { type: actions.UPDATE_USER_NOTIFICATION_CHANNEL, payload: { id: '1', updated: { test: 'test2', test2: 'test2' } } };
        const result = reducer(initialState, action);
        const expected = [ { id: '1', test: 'test2', test2: 'test2' }, { id: '2', test: 'test' } ];

        expect(result.userChannels.list).toEqual(expected);
    });

    it('UPDATE_USER_NOTIFICATION_CHANNEL_ATTRIBUTE', () => {
        initialState.userChannels.list = [ { id: '1', test: 'test' }, { id: '2', test: 'test' } ];
        const action = { type: actions.UPDATE_USER_NOTIFICATION_CHANNEL_ATTRIBUTE, payload: { id: '1', updated: { test: 'test2', test2: 'test2' } } };
        const result = reducer(initialState, action);
        const expected = [ { id: '1', test: 'test2', test2: 'test2' }, { id: '2', test: 'test' } ];

        expect(result.userChannels.list).toEqual(expected);
    });

    it('DELETE_USER_NOTIFICATION_CHANNEL', () => {
        initialState.userChannels.list = [ { id: '1', test: 'test' }, { id: '2', test: 'test' } ];
        const action = { type: actions.DELETE_USER_NOTIFICATION_CHANNEL, payload: { id: '1' } };
        const result = reducer(initialState, action);
        const expected = [ { id: '2', test: 'test' } ];

        expect(result.userChannels.list).toEqual(expected);
    });

    it('SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY', () => {
        const action = { type: actions.SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY, payload: { searchQuery: 'test query' } };
        const result = reducer(initialState, action);

        expect(result.userChannels.searchQuery).toEqual('test query');
    });

    it('SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER', () => {
        const action = { type: actions.SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER, payload: { sortOrder: 'DESC' } };
        const result = reducer(initialState, action);

        expect(result.userChannels.sortOrder).toEqual('DESC');
    });

    it('SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE', () => {
        const action = { type: actions.SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE, payload: { currentPage: 3 } };
        const result = reducer(initialState, action);

        expect(result.userChannels.currentPage).toEqual(3);
    });
});
