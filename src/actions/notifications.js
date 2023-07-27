import smartHome                   from '../smartHome/smartHomeSingleton';
import config                      from '../../config';
import store                       from '../store';

import { attributeDispatcher }     from '../utils/homie/dispatcherSingleton';
import {
    mapNotificationEntityToNotification
}                                  from '../utils/mapper/notifications';
import EventCache                  from '../utils/homie/EventCache';

export const NOTIFICATION_ENTITY_TYPE = 'NOTIFICATION';

export const GET_NOTIFICATIONS            = 'GET_NOTIFICATIONS';
export const UPDATE_NOTIFICATION          = 'UPDATE_NOTIFICATION';
export const DELETE_NOTIFICATION          = 'DELETE_NOTIFICATION';
export const UPDATE_NOTIFICATIONS_IS_READ = 'UPDATE_NOTIFICATIONS_IS_READ';
export const ADD_NOTIFICATION             = 'ADD_NOTIFICATION';
export const UPDATE_NOTIFICATIONS_STATE   = 'UPDATE_NOTIFICATIONS_STATE';

export const notificationsEventCache = new EventCache({
    debounceTime : 100,
    cacheSize    : +config.mqttCacheLimit,
    handler      : updateSchema => store.dispatch(updateNotificationsState(updateSchema))
});


export function getNotifications() {
    return async dispatch => {
        const entities = await smartHome.getEntities(NOTIFICATION_ENTITY_TYPE);

        const serializedEntities = [];

        for (const key in entities) {
            if (entities.hasOwnProperty(key)) {
                const entity = entities[key];

                entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));
                // entity.onErrorPublish(params => dispatch(handleAttributeError(params)));

                serializedEntities.push(entity.serialize());
            }
        }

        dispatch({
            type          : GET_NOTIFICATIONS,
            notifications : serializedEntities
        });
    };
}

export function handlePublishEvent({ field, value, entity }) {
    return async () => {
        const entityId = entity.getId();
        const updated = mapNotificationEntityToNotification({ [field]: value });

        if (Object.keys(updated).length) {
            notificationsEventCache.push({
                type : 'UPDATE_EVENT',
                data : {
                    type : 'NOTIFICATION',
                    id   : entityId,
                    updated
                }
            });
        }
    };
}

export function onNewNotification(entity) {
    return async dispatch => {
        entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));
        // entity.onErrorPublish(params => dispatch(handleAttributeError(params)));

        const serialized = entity.serialize();
        const notification = mapNotificationEntityToNotification(serialized);

        // showBrowserNotify(notification);

        notificationsEventCache.push({
            type : 'ADD_EVENT',
            data : {
                type : 'NOTIFICATION',
                item : notification
            }
        });
    };
}

export function onNotificationDelete(id) {
    return (dispatch) => {
        dispatch({
            type    : DELETE_NOTIFICATION,
            payload : { id }
        });

        notificationsEventCache.push({
            type : 'DELETE_EVENT',
            data : {
                type : 'NOTIFICATION',
                id
            }
        });
    };
}


// function showBrowserNotify(data) {
//     if (!data) return;

//     const { message, id } = data || {};

//     if (!('Notification' in window)) {
//         console.error('This browser does not support desktop notification');
//     } else if (Notification.permission === 'granted') {
//         new Notification(message, { tag: `${id}` }); // eslint-disable-line no-new
//     } else if (Notification.permission !== 'denied') {
//         Notification.requestPermission().then((permission) => { // eslint-disable-line more/no-then
//             if (permission === 'granted') {
//                 new Notification(message, { tag: `${id}` }); // eslint-disable-line  no-new
//             }
//         });
//     }
// }

export function updateNotificationsIsRead({ list = [], isRead } = {}) {
    return async (dispatch) => {
        try {
            const all = Promise.all(list?.map(itemId => {
                return attributeDispatcher.setAsyncAttribute({
                    type     : NOTIFICATION_ENTITY_TYPE,
                    field    : 'isRead',
                    value    : isRead,
                    entityId : itemId
                });
            }) || []);

            dispatch({
                type : UPDATE_NOTIFICATIONS_IS_READ,
                list,
                isRead
            });

            return all;
        } catch (error) {
            console.error(error);
        }
    };
}


function updateNotificationsState(updateSchema) {
    // console.log('### Update Notifications State state', updateSchema);
    return dispatch => {
        dispatch({
            type    : UPDATE_NOTIFICATIONS_STATE,
            payload : { updateSchema }
        });
    };
}
