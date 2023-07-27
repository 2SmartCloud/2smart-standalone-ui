import smartHome from '../smartHome/smartHomeSingleton';
import { mapAliasEntityToAlias, mapAliasEntityUpdateToAlias } from '../utils/mapper/alias';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import {  HOMIE_ERROR_MAP, getHomieErrorMessage } from '../utils/homie/errors';
import { callValErrNotification } from './interface';
import { handlePublishError } from './homie';

export const GET_ALIAS_ENTITIES = 'GET_ALIAS_ENTITIES';
export const ADD_ALIAS_ENTITY = 'ADD_ALIAS_ENTITY';
export const DELETE_ALIAS_ENTITY = 'DELETE_ALIAS_ENTITY';
export const UPDATE_ALIAS = 'UPDATE_ALIAS';
export const ALIAS_ENTITY_TYPE = 'TOPICS_ALIASES';

export const ERROR_MESSAGES = {
    'WRONG_FORMAT' : 'Latin lowercase letters only, numbers, symbols "." and "space"',
    'REQUIRED'     : 'Name is required'
};

export function getAliases() {
    return async dispatch => {
        try {
            const entities = await smartHome.getEntities(ALIAS_ENTITY_TYPE);

            const serializedEntities = [];

            for (const key in entities) {
                if (entities.hasOwnProperty(key)) {
                    const entity = entities[key];

                    entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

                    serializedEntities.push(entity.serialize());
                }
            }
            const aliases = serializedEntities.map(mapAliasEntityToAlias);


            dispatch({
                type    : GET_ALIAS_ENTITIES,
                payload : { aliases }
            });
        } catch (err) {
            console.log(err);
        }
    };
}


export function createAliasEntity(payload) {
    return async () => {
        const type = ALIAS_ENTITY_TYPE;

        try {
            await smartHome.createEntityRequest(type, payload);
        } catch (error) {
            throw error;
        }
    };
}

export function onAliasError(error, id) {
    return dispatch => {
        const { code,  fields, message } = error;
        const meta = { deviceId: null, nodeId: null, propertyId: id };
        const errorMessage =  (code === HOMIE_ERROR_MAP.VALIDATION)
            ?  ERROR_MESSAGES[fields.name] || 'Validation error'
            :  message;


        dispatch(callValErrNotification({
            meta,
            title   : code ? getHomieErrorMessage(code) : 'Unknown error',
            message : errorMessage || 'Something went wrong. Please try again later.'
        }));
    };
}


export function changeAliasName(payload) {
    return async () => {
        const { name, entityId } = payload;

        try {
            await attributeDispatcher.setAsyncAttribute({
                type  : ALIAS_ENTITY_TYPE,
                field : 'name',
                value : name,
                entityId
            });
        } catch (err) {
            throw err;
        }
    };
}

export function handlePublishEvent({ field, value, entity = null }) {
    return dispatch => {
        const entityId = entity.getId();
        const updated = mapAliasEntityUpdateToAlias({ [field]: value });

        if (Object.keys(updated).length) {
            dispatch({
                type    : UPDATE_ALIAS,
                payload : {
                    id : entityId,
                    updated
                }
            });
        }
    };
}

export function onNewAliasEntity(entity) {
    return (dispatch) => {
        const serializedEntity = entity.serialize();
        const alias = mapAliasEntityToAlias(serializedEntity);

        entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));

        dispatch({
            type    : ADD_ALIAS_ENTITY,
            payload : { alias }
        });
    };
}

export function deleteAliasEntity({ entityId }) {
    return async dispatch => {
        const type = ALIAS_ENTITY_TYPE;

        try {
            await smartHome.deleteEntityRequest(type, entityId);
        } catch (error) {
            dispatch(handlePublishError(error));
            throw error;
        }
    };
}

export function onDeleteAliasEntity(id) {
    return {
        type    : DELETE_ALIAS_ENTITY,
        payload : { id }
    };
}
