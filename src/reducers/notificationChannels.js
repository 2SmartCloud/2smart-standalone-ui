import produce                      from 'immer';
import { NOTIFICATIONS_SORT_ORDER } from '../assets/constants/localStorage';
import { getData }                  from '../utils/localStorage';
import {
    GET_NOTIFICATION_CHANNELS,
    UPDATE_USER_NOTIFICATION_CHANNEL_ATTRIBUTE,
    GET_USER_NOTIFICATION_CHANNELS,
    ADD_USER_NOTIFICATION_CHANNEL,
    DELETE_USER_NOTIFICATION_CHANNEL,
    UPDATE_USER_NOTIFICATION_CHANNEL,
    SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY,
    SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER,
    SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE
} from '../actions/notificationChannels';

const INITIAL_STATE = {
    userChannels : {
        list        : [],
        isFetching  : true,
        searchQuery : '',
        sortOrder   : getData(NOTIFICATIONS_SORT_ORDER) || 'ASC',
        currentPage : 1
    },
    channels : {
        list       : [],
        isFetching : true
    }
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_NOTIFICATION_CHANNELS:
            draft.channels.list = action.payload.notificationChannels;
            draft.channels.isFetching = false;
            break;
        case GET_USER_NOTIFICATION_CHANNELS:
            draft.userChannels.list = action.payload.userNotificationChannels;
            draft.userChannels.isFetching = false;
            break;

        case ADD_USER_NOTIFICATION_CHANNEL: {
            const { channel } = action.payload;
            const index = draft.userChannels.list.findIndex(item => item.id === channel.id);

            if (index >= 0) {
                draft.userChannels.list[index] = channel;
            } else {
                draft.userChannels.list.push(channel);
            }
            break;
        }

        case UPDATE_USER_NOTIFICATION_CHANNEL: {
            const { id, updated } = action.payload;
            const index = draft.userChannels.list.findIndex(item => item.id === id);

            if (index >= 0) {
                draft.userChannels.list[index] = {
                    ...draft.userChannels.list[index],
                    ...updated
                };
            }
            break;
        }
        case UPDATE_USER_NOTIFICATION_CHANNEL_ATTRIBUTE: {
            const { id, updated } = action.payload;
            const index = draft.userChannels.list.findIndex(item => item.id === id);

            if (index >= 0) {
                draft.userChannels.list[index] = {
                    ...draft.userChannels.list[index],
                    ...updated
                };
            }
            break;
        }
        case DELETE_USER_NOTIFICATION_CHANNEL:
            draft.userChannels.list = draft.userChannels.list.filter(item => item.id !== action.payload.id);
            break;

        case SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY:
            draft.userChannels.searchQuery = action.payload.searchQuery;
            break;

        case SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER:
            draft.userChannels.sortOrder = action.payload.sortOrder;
            break;

        case SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE:
            draft.userChannels.currentPage = action.payload.currentPage;
            break;

        default:
            break;
    }
}, INITIAL_STATE);
