import api                     from '../apiSingleton';
import {
    mapNotificationChannelEntityToNotificationChannel
}                              from '../utils/mapper/channels';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import { safeParseJSON }       from '../utils/json';
import smartHome               from '../smartHome/smartHomeSingleton';
import toastsMeta              from '../components/base/toast/meta';
import { callToast }           from '../components/base/toast/callToast';
import config                  from '../../config';
import { handlePublishError }  from  './homie';

export const GET_NOTIFICATION_CHANNELS = 'GET_NOTIFICATION_CHANNELS';
export const GET_USER_NOTIFICATION_CHANNELS = 'GET_USER_NOTIFICATION_CHANNELS';
export const ADD_USER_NOTIFICATION_CHANNEL = 'ADD_USER_NOTIFICATION_CHANNEL';
export const DELETE_USER_NOTIFICATION_CHANNEL = 'DELETE_USER_NOTIFICATION_CHANNEL';
export const UPDATE_USER_NOTIFICATION_CHANNEL = 'UPDATE_USER_NOTIFICATION_CHANNEL';
export const UPDATE_USER_NOTIFICATION_CHANNEL_ATTRIBUTE = 'UPDATE_USER_NOTIFICATION_CHANNEL_ATTRIBUTE';
export const SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY = 'SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY';
export const SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER = 'SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER';
export const SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE = 'SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE';
export const NOTIFICATION_CHANNELS_ENTITY_TYPE = 'NOTIFICATION_CHANNELS';

export function getNotificationChannels() {
    return async dispatch => {
        try {
            const notificationChannels = await api.notificationChannels.getChannelsList();

            const processChannels = notificationChannels.map(channel => {
                return ({ ...channel, icon: `${config.apiUrl}/${channel.icon}` });
            });

            dispatch({ type: GET_NOTIFICATION_CHANNELS, payload: { notificationChannels: processChannels } });
        } catch (error) {
            console.error(error);
        }
    };
}

export function getUserNotificationChannels() {
    return async dispatch => {
        try {
            const entities = await smartHome.getEntities(NOTIFICATION_CHANNELS_ENTITY_TYPE);

            const serializedEntities = [];

            for (const key in entities) {
                if (entities.hasOwnProperty(key)) {
                    const entity = entities[key];

                    entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));
                    // entity.onErrorPublish(params => dispatch(handleAttributeError(params)));

                    serializedEntities.push(entity.serialize());
                }
            }

            const userNotificationChannels = serializedEntities.map(mapNotificationChannelEntityToNotificationChannel);

            dispatch({ type: GET_USER_NOTIFICATION_CHANNELS, payload: { userNotificationChannels } });
        } catch (error) {
            console.log(error);
        }
    };
}

export function deleteUserNotificationChannel(channelId) {
    return async dispatch => {
        try {
            await smartHome.deleteEntityRequest(NOTIFICATION_CHANNELS_ENTITY_TYPE, channelId);
        } catch (error) {
            dispatch(handlePublishError(error));

            throw error;
        }
    };
}


export function onDeleteUserNotificationChannel(id) {
    return dispatch => {
        try {
            dispatch({
                type    : DELETE_USER_NOTIFICATION_CHANNEL,
                payload : { id }
            });
        } catch (error) {
            dispatch(handlePublishError(error));

            throw error;
        }
    };
}

export function createUserNotificationChannel(entity) {
    return async dispatch => {
        try {
            await smartHome.createEntityRequest(NOTIFICATION_CHANNELS_ENTITY_TYPE, entity);
        } catch (error) {
            dispatch(handlePublishError(error));

            throw error;
        }
    };
}

export function activateUserNotificationChannel(channelId) {
    return async dispatch => {
        try {
            await attributeDispatcher.setAsyncAttribute({
                type     : NOTIFICATION_CHANNELS_ENTITY_TYPE,
                field    : 'state',
                value    : 'enabled',
                entityId : channelId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
        }
    };
}

export function deactivateUserNotificationChannel(channelId) {
    return async dispatch => {
        try {
            await attributeDispatcher.setAsyncAttribute({
                type     : NOTIFICATION_CHANNELS_ENTITY_TYPE,
                field    : 'state',
                value    : 'disabled',
                entityId : channelId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
        }
    };
}

export function setUserNotificationChannelsSearchQuery(value) {
    return {
        type    : SET_USER_NOTIFICATION_CHANNELS_SEARCH_QUERY,
        payload : { searchQuery: value }
    };
}

export function setUserNotificationChannelsSortOrder(value) {
    return {
        type    : SET_USER_NOTIFICATION_CHANNELS_SORT_ORDER,
        payload : { sortOrder: value }
    };
}

export function setUserNotificationChannelsCurrentPage(value) {
    return {
        type    : SET_USER_NOTIFICATION_CHANNELS_CURRENT_PAGE,
        payload : { currentPage: value }
    };
}

export function updateUserNotificationChannel(id, fields) {
    return async dispatch => {
        try {
            await attributeDispatcher.updateEntity({
                type     : NOTIFICATION_CHANNELS_ENTITY_TYPE,
                value    : fields,
                entityId : id
            });
        } catch (err) {
            dispatch(handlePublishError(err));

            throw err;
        }
    };
}

export function sendTestMessageToUserNotificationChannel(id) {
    return async dispatch => {
        try {
            await attributeDispatcher.setAsyncAttribute({
                type     : NOTIFICATION_CHANNELS_ENTITY_TYPE,
                field    : 'event',
                value    : 'send',
                entityId : id
            });

            dispatch(showChannelNotification(id, 'message-send'));
        } catch (error) {
            dispatch(showChannelNotification(id, 'message-send-error'));
        }
    };
}

export function onNewNotificationChannel(entity) {
    return async dispatch => {
        entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));
        // entity.onErrorPublish(params => dispatch(handleAttributeError(params)));

        const serialized = entity.serialize();
        const channel = mapNotificationChannelEntityToNotificationChannel(serialized);

        dispatch({
            type    : ADD_USER_NOTIFICATION_CHANNEL,
            payload : { channel }
        });
    };
}

function handlePublishEvent({ field, value, entity }) {
    return async dispatch => {
        const entityId = entity.getId();

        const updatedValue = field === 'configuration'
            ? safeParseJSON(value)
            : value;

        const updated = mapNotificationChannelEntityToNotificationChannel({ [field]: updatedValue });

        if (Object.keys(updated).length) {
            dispatch({
                type    : UPDATE_USER_NOTIFICATION_CHANNEL_ATTRIBUTE,
                payload : {
                    id : entityId,
                    updated
                }
            });
        }
    };
}

/* function handleAttributeError({ value: { code, message, fields }, entity }) {
    const entityId = entity.getId();

    return handlePublishError({ code, message, fields, entityId });
} */

function showChannelNotification(id, value) {
    return async (dispatch, getState) => {    // eslint-disable-line
        const channel = getState().notificationChannels.userChannels.list?.find(item => item.id === id);

        if (!channel) return;

        let meta;
        let title;
        let message;

        switch (value) {
            case 'message-send':
                meta = toastsMeta.SEND_NOTIFICATION_CHANNEL_SUCCESS;
                title = 'Test message has been successfully sent';
                message = 'Please check your notification channel!';
                break;
            case 'message-send-error':
                meta = toastsMeta.SEND_NOTIFICATION_CHANNEL_ERROR;
                title = 'Error';
                message = 'Error with sending test message';
                break;
            default:
                return;
        }

        callToast({
            meta,
            title,
            message,
            toastOptions : {
                autoClose : 5000
            }
        });
    };
}
