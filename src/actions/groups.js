import smartHome from '../smartHome/smartHomeSingleton';
import { mapGroupEntityToGroup, mapGroupEntityUpdateToGroup } from '../utils/mapper/groups';
import { handlePublishError } from './homie';

export const GET_GROUP_ENTITIES = 'GET_GROUP_ENTITIES';
export const ADD_GROUP_ENTITY = 'ADD_GROUP_ENTITY';
export const DELETE_GROUP_ENTITY = 'DELETE_GROUP_ENTITY';
export const UPDATE_GROUP = 'UPDATE_GROUP';

export const CHANGE_GROUP_VALUE_PROCESSING = 'CHANGE_GROUP_VALUE_PROCESSING';
export const SET_GROUP_VALUE_ERROR = 'SET_GROUP_VALUE_ERROR';
export const REMOVE_GROUP_VALUE_ERROR = 'REMOVE_GROUP_VALUE_ERROR';


export function getGroupsEntities() {
    return async dispatch => {
        try {
            const entities = await smartHome.getEntities('GROUP_OF_PROPERTIES');
            const serializedGroups = [];

            for (const key in entities) {
                if (entities.hasOwnProperty(key)) {
                    const entity = entities[key];

                    entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

                    serializedGroups.push(entity.serialize());
                }
            }

            const groups = serializedGroups.map(mapGroupEntityToGroup);

            dispatch({
                type    : GET_GROUP_ENTITIES,
                payload : { groups }
            });
        } catch (e) {
            console.log(e);
        }
    };
}

export function handlePublishEvent({ field, value, entity = null }) {
    return dispatch => {
        const entityId = entity.getId();
        const updated = mapGroupEntityUpdateToGroup({ [field]: value });

        dispatch(stopGroupValueProcessing(entityId));
        if (Object.keys(updated).length) {
            dispatch({
                type    : UPDATE_GROUP,
                payload : {
                    id : entityId,
                    updated
                }
            });
        }
    };
}

export function onNewGroupEntity(entity) {
    return (dispatch) => {
        entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

        const serializedEntity = entity.serialize();
        const group = mapGroupEntityToGroup(serializedEntity);

        dispatch({
            type    : ADD_GROUP_ENTITY,
            payload : { group }
        });
    };
}

export function createGroupEntity(payload) {
    return async dispatch => {
        const type = 'GROUP_OF_PROPERTIES';

        try {
            await smartHome.createEntityRequest(type, payload);
        } catch (error) {
            if (error.code !== 'EXISTS') {
                dispatch(handlePublishError(error));
            } else throw error;
        }
    };
}

export function deleteGroupEntity(entityId) {
    return async dispatch => {
        const type = 'GROUP_OF_PROPERTIES';

        try {
            await smartHome.deleteEntityRequest(type, entityId);
        } catch (error) {
            dispatch(handlePublishError(error));
            throw error;
        }
    };
}


export function startGroupValueProcessing(id) {
    return {
        type    : CHANGE_GROUP_VALUE_PROCESSING,
        payload : {
            status : true,
            id
        }
    };
}

export function stopGroupValueProcessing(id) {
    return {
        type    : CHANGE_GROUP_VALUE_PROCESSING,
        payload : {
            status : false,
            id
        }
    };
}

export function setGroupValueError(id, error) {
    return {
        type    : SET_GROUP_VALUE_ERROR,
        payload : {
            error,
            id
        }
    };
}

export function removeGroupValueError(id) {
    return {
        type    : REMOVE_GROUP_VALUE_ERROR,
        payload : {
            id
        }
    };
}

export function onDeleteGroupEntity(id) {
    return dispatch => {
        dispatch({
            type    : DELETE_GROUP_ENTITY,
            payload : { id }
        });
    };
}

