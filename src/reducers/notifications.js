import produce                      from 'immer';
import {
    GET_NOTIFICATIONS,
    UPDATE_NOTIFICATION,
    ADD_NOTIFICATION,
    DELETE_NOTIFICATION,
    UPDATE_NOTIFICATIONS_IS_READ,
    UPDATE_NOTIFICATIONS_STATE
} from '../actions/notifications';

const INITIAL_STATE = {
    list       : [],
    isFetching : true
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_NOTIFICATIONS:
            draft.list = action.notifications;
            draft.isFetching = false;
            break;

        case DELETE_NOTIFICATION:
            draft.list = draft.list.filter(item => item.id !== action?.payload?.id);
            break;

        case ADD_NOTIFICATION: {
            const { notification } = action.payload;
            const index = draft.list.findIndex(item => item.id === notification.id);

            if (index >= 0) {
                draft.list[index] = notification;
            } else {
                draft.list.push(notification);
            }
            break;
        }

        case UPDATE_NOTIFICATION: {
            const { id, updated } = action.payload;
            const index = draft.list.findIndex(item => item.id === id);

            if (index >= 0) {
                draft.list[index] = {
                    ...draft.list[index],
                    ...updated
                };
            }
            break;
        }

        case UPDATE_NOTIFICATIONS_STATE: {
            const { updateSchema } = action.payload;
            const { notifications = {} } = updateSchema;

            for (const notificationId of Object.keys(notifications)) {
                const entity = notifications[notificationId];
                const index = draft.list.findIndex(item => item.id === notificationId);

                if (index >= 0) {
                    draft.list[index] = {
                        ...draft.list[index],
                        ...entity
                    };
                } else {
                    draft.list.push(entity);
                }
            }
            break;
        }

        case UPDATE_NOTIFICATIONS_IS_READ: {
            const { list, isRead } = action;

            list.forEach(listItem => {
                const index = draft.list.findIndex(item => item?.id === listItem?.id);

                if (index >= 0) {
                    draft.list[index] = {
                        ...draft.list[index],
                        isRead
                    };
                }
            });

            break;
        }
        default:
            break;
    }
}, INITIAL_STATE);
