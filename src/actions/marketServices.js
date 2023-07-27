import {
    mapServiceTypeEntityToServiceType,
    mapServiceTypeUpdateEntityToServiceTypeUpdate
} from '../utils/mapper/service';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import smartHome from '../smartHome/smartHomeSingleton';
import toastsMeta from '../components/base/toast/meta';
import { callToastNotification } from './interface';
import { handlePublishError } from './homie';

export const GET_MARKET_SERVICES = 'GET_MARKET_SERVICES';
export const ADD_MARKET_SERVICE = 'ADD_MARKET_SERVICE';
export const UPDATE_MARKET_SERVICE_ATTRIBUTE = 'UPDATE_MARKET_SERVICE_ATTRIBUTE';
export const SET_MARKET_SERVICES_SEARCH_QUERY = 'SET_MARKET_SERVICES_SEARCH_QUERY';
export const SET_MARKET_SERVICES_SORT_ORDER = 'SET_MARKET_SERVICES_SORT_ORDER';
export const SET_MARKET_SERVICES_CURRENT_PAGE = 'SET_MARKET_SERVICES_CURRENT_PAGE';

export const CHANGE_CHECK_PROCCESSING = 'CHANGE_CHECK_PROCCESSING';

export const MARKET_SERVICES_ENTITY_TYPE = 'BRIDGE_TYPES';

// export function subscribeToMarketServices() {
//     return () => {
//         return smartHome.initializeEntityClass(MARKET_SERVICES_ENTITY_TYPE);
//     };
// }

export function subscribeWithIntervalAndGetMarketServices() {
    return dispatch => {
        try {
            dispatch(subscribeAndGetMarketServices());
        } catch (error) {
            console.error(error);
            // repeat every 1 second on error
            const oneSecond = 1e3;

            if (this.timeout) clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                dispatch(subscribeWithIntervalAndGetMarketServices());
            }, oneSecond);
        }
    };
}


export function subscribeAndGetMarketServices() {
    return async dispatch => {
        try {
            await smartHome.initializeEntityClass(MARKET_SERVICES_ENTITY_TYPE);

            dispatch(getMarketServices());
        } catch (e) {
            console.log(e);
        }
    };
}


export function getMarketServices() {
    return async dispatch => {
        try {
            const entities = await smartHome.getEntities(MARKET_SERVICES_ENTITY_TYPE);
            const serializedEntities = [];

            for (const key in entities) {
                if (entities.hasOwnProperty(key)) {
                    const entity = entities[key];

                    entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

                    serializedEntities.push(entity.serialize());
                }
            }
            const services = serializedEntities.map(mapServiceTypeEntityToServiceType);

            dispatch({ type: GET_MARKET_SERVICES, payload: { services } });
        } catch (e) {
            console.log(e);
        }
    };
}

export function installMarketService(entityId) {
    return async dispatch => {
        try {
            dispatch(startProcessing(entityId, 'pulling'));

            await attributeDispatcher.setAsyncAttribute({
                type  : MARKET_SERVICES_ENTITY_TYPE,
                field : 'event',
                value : 'pull',
                entityId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
            dispatch(stopProcessing(entityId));
        }
    };
}

export function startProcessing(entityId, processingLabel) {
    return ({
        type    : CHANGE_CHECK_PROCCESSING,
        payload : {
            entityId,
            processingLabel,
            isProcessing : true
        }
    });
}

export function stopProcessing(entityId) {
    return ({
        type    : CHANGE_CHECK_PROCCESSING,
        payload : {
            entityId,
            processingLabel : '',
            isProcessing    : false
        }
    });
}

export function checkMarketServiceUpdate(entityId) {
    return async dispatch => {
        try {
            dispatch(startProcessing(entityId, 'checking'));
            await attributeDispatcher.setAsyncAttribute({
                type  : MARKET_SERVICES_ENTITY_TYPE,
                field : 'event',
                value : 'check',
                entityId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
            dispatch(stopProcessing(entityId));
        }
    };
}

export function updateMarketService(entityId) {
    return async dispatch => {
        try {
            dispatch(startProcessing(entityId, 'updating'));

            await attributeDispatcher.setAsyncAttribute({
                type  : MARKET_SERVICES_ENTITY_TYPE,
                field : 'event',
                value : 'pull',
                entityId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
            dispatch(stopProcessing(entityId));
        }
    };
}

export function deleteMarketService(entityId) {
    return async dispatch => {
        try {
            dispatch(startProcessing(entityId, 'removing'));

            await attributeDispatcher.setAsyncAttribute({
                type  : MARKET_SERVICES_ENTITY_TYPE,
                field : 'event',
                value : 'remove',
                entityId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
            dispatch(stopProcessing(entityId));
        }
    };
}

export function onNewBridgeTypeEntity(entity) {
    return (dispatch) => {
        entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

        const serialized = entity.serialize();
        const service = mapServiceTypeEntityToServiceType(serialized);

        dispatch({
            type    : ADD_MARKET_SERVICE,
            payload : { service }
        });
    };
}

export function handlePublishEvent({ field, value, entity }) {
    return (dispatch, getState) => {
        const entityId = entity.getId();

        const serialized = entity.serialize();
        const updated = mapServiceTypeUpdateEntityToServiceTypeUpdate({ [field]: value });
        const service = getState().marketServices.list?.find(item => item.name === entityId);

        const isStatusChecked = field === 'version';
        const isUpdatingError = updated?.version?.updateError;
        const isServiceProcessing = service && service.isProcessing;

        const isConnectionErrorShown = isStatusChecked
            && (serialized.state === 'pulled' || serialized.state ===  'removed')
            &&  isUpdatingError && isServiceProcessing;

        const isSuccessNotificationShown = isServiceProcessing && serialized.state === 'pulled' && isStatusChecked && !updated?.version?.updateError;

        if (isSuccessNotificationShown) {
            if (updated.version?.updateAvailable) {
                dispatch(showMarketNotification(entityId, service.label, 'has-update'));
            } else if (updated.version?.updated) {
                dispatch(showMarketNotification(entityId, service.label, 'pulled'));
            } else {
                dispatch(showMarketNotification(entityId, service.label, 'no-update'));
            }
        }

        if (Object.keys(updated).length) {
            dispatch({
                type    : UPDATE_MARKET_SERVICE_ATTRIBUTE,
                payload : {
                    name : entityId,
                    updated
                }
            });
        }

        if (isConnectionErrorShown) {
            dispatch(handlePublishError(updated.version?.updateError));
        }

        if (isStatusChecked) {
            dispatch(stopProcessing(entityId));
        }
    };
}

/* function handleAttributeError({ value: { code, message, fields }, entity }) {
    const entityId = entity.getId();

    return handlePublishError({ code, message, fields, entityId });
} */

export function showMarketNotification(entityId, label, value) {
    return dispatch => {
        const meta = { type: toastsMeta.MARKET_EVENT, entityId };
        let title;
        let message;

        switch (value) {
            case 'pulled':
                title = 'Download completed';
                message = `Service ${label} has been successfully installed!`;
                break;
            case 'has-update':
                title = 'Update available';
                message = `Service ${label} has new updates and can be updated!`;
                break;
            case 'no-update':
                title = 'No updates available';
                message = `Service ${label} is up-to-date.`;
                break;
            default:
                return;
        }

        dispatch(callToastNotification({
            meta,
            title,
            message
        }));
    };
}

export function setMarketSearchQuery(value) {
    return {
        type    : SET_MARKET_SERVICES_SEARCH_QUERY,
        payload : { searchQuery: value }
    };
}

export function setMarketSortOrder(value) {
    return {
        type    : SET_MARKET_SERVICES_SORT_ORDER,
        payload : { sortOrder: value }
    };
}

export function setMarketCurrentPage(value) {
    return {
        type    : SET_MARKET_SERVICES_CURRENT_PAGE,
        payload : { currentPage: value }
    };
}
