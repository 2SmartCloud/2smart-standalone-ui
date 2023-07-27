import smartHome from '../smartHome/smartHomeSingleton';
import {
    mapBridgeEntityTOToService,
    mapBridgeEntityUpdateTOToServiceUpdate
} from '../utils/mapper/service';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import { handlePublishError } from './homie';

export const GET_BRIDGE_ENTITIES = 'GET_BRIDGE_ENTITIES';
export const ADD_BRIDGE_ENTITY = 'ADD_BRIDGE_ENTITY';
export const UPDATE_BRIDGE_ATTRIBUTE = 'UPDATE_BRIDGE_ATTRIBUTE';
export const DELETE_BRIDGE_ENTITY = 'DELETE_BRIDGE_ENTITY';
export const SET_USER_SERVICES_SEARCH_QUERY = 'SET_USER_SERVICES_SEARCH_QUERY';
export const SET_USER_SERVICES_SORT_ORDER = 'SET_USER_SERVICES_SORT_ORDER';
export const SET_USER_SERVICES_CURRENT_PAGE = 'SET_USER_SERVICES_CURRENT_PAGE';

export const USER_SERVICES_ENTITY_TYPE = 'BRIDGE';

export function getBridgeEntities() {
    return async dispatch => {
        try {
            const entities = await smartHome.getEntities(USER_SERVICES_ENTITY_TYPE);
            const serializedEntities = [];

            for (const key in entities) {
                if (entities.hasOwnProperty(key)) {
                    const entity = entities[key];

                    entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

                    serializedEntities.push(entity.serialize());
                }
            }

            const services = serializedEntities.map(mapBridgeEntityTOToService);

            dispatch({
                type    : GET_BRIDGE_ENTITIES,
                payload : { services }
            });
        } catch (e) {
            console.log(e);
        }
    };
}

export function createBridgeEntity(payload) {
    return async dispatch => {
        try {
            await smartHome.createEntityRequest(USER_SERVICES_ENTITY_TYPE, payload);
        } catch (error) {
            dispatch(handlePublishError(error));

            throw error;
        }
    };
}

export function deleteBridgeEntity(entityId) {
    return async dispatch => {
        try {
            await smartHome.deleteEntityRequest(USER_SERVICES_ENTITY_TYPE, entityId);
        } catch (error) {
            dispatch(handlePublishError(error));

            throw error;
        }
    };
}

export function updateBridgeEntity(entityId, payload) {
    return async dispatch => {
        try {
            await attributeDispatcher.setAsyncAttribute({
                type  : USER_SERVICES_ENTITY_TYPE,
                field : 'configuration',
                value : payload,
                entityId
            });
        } catch (err) {
            dispatch(handlePublishError(err));

            throw err;
        }
    };
}

export function activateUserService(entityId) {
    return async dispatch => {
        try {
            await attributeDispatcher.setAsyncAttribute({
                type  : USER_SERVICES_ENTITY_TYPE,
                field : 'event',
                value : 'start',
                entityId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
        }
    };
}

export function deactivateUserService(entityId) {
    return async dispatch => {
        try {
            await attributeDispatcher.setAsyncAttribute({
                type  : USER_SERVICES_ENTITY_TYPE,
                field : 'event',
                value : 'stop',
                entityId
            });
        } catch (err) {
            dispatch(handlePublishError(err));
        }
    };
}

export function onNewBridgeEntity(entity) {
    return (dispatch) => {
        entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

        const serialized = entity.serialize();
        const service = mapBridgeEntityTOToService(serialized);

        dispatch({
            type    : ADD_BRIDGE_ENTITY,
            payload : { service }
        });
    };
}

export function onDeleteBridgeEntity(id) {
    return dispatch => {
        dispatch({
            type    : DELETE_BRIDGE_ENTITY,
            payload : { id }
        });
    };
}

function handlePublishEvent({ field, value, entity }) {
    return dispatch => {
        const entityId = entity.getId();

        const updated = mapBridgeEntityUpdateTOToServiceUpdate({ [field]: value });

        if (Object.keys(updated).length) {
            dispatch({
                type    : UPDATE_BRIDGE_ATTRIBUTE,
                payload : {
                    id : entityId,
                    updated
                }
            });
        }
    };
}

export function setSearchQuery(value) {
    return {
        type    : SET_USER_SERVICES_SEARCH_QUERY,
        payload : { searchQuery: value }
    };
}

export function setSortOrder(value) {
    return {
        type    : SET_USER_SERVICES_SORT_ORDER,
        payload : { sortOrder: value }
    };
}

export function setCurrentPage(value) {
    return {
        type    : SET_USER_SERVICES_CURRENT_PAGE,
        payload : { currentPage: value }
    };
}
