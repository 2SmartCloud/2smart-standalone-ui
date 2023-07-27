import api                     from '../../apiSingleton';
import {
    mapExtension,
    mapExtensionEntity,
    mapExtensionEntityUpdate
}                              from '../../utils/mapper/extensions';
import smartHome               from '../../smartHome/smartHomeSingleton';
import { attributeDispatcher } from '../../utils/homie/dispatcherSingleton';
import { dumpExtension }       from '../../utils/dump/extensions';
import toastsMeta              from '../../components/base/toast/meta';
import {
    callToastNotification,
    callValErrNotification
}                              from '../interface';


export const GET_EXTENSIONS_REQUEST       = 'GET_EXTENSIONS_REQUEST';
export const GET_EXTENSIONS_SUCCESS       = 'GET_EXTENSIONS_SUCCESS';
export const GET_EXTENSIONS_FAILURE       = 'GET_EXTENSIONS_FAILURE';

export const GET_SINGLE_EXTENSION_REQUEST = 'GET_SINGLE_EXTENSION_REQUEST';
export const GET_SINGLE_EXTENSION_SUCCESS = 'GET_SINGLE_EXTENSION_SUCCESS';
export const GET_SINGLE_EXTENSION_FAILURE = 'GET_SINGLE_EXTENSION_FAILURE';

export const SET_EXTENSIONS_SEARCH_QUERY  = 'SET_EXTENSIONS_SEARCH_QUERY';
export const SET_EXTENSIONS_SORT_ORDER    = 'SET_EXTENSIONS_SORT_ORDER';
export const SET_EXTENSIONS_CURRENT_PAGE  = 'SET_EXTENSIONS_CURRENT_PAGE';
export const GET_EXTENSION_ENTITIES       = 'GET_EXTENSION_ENTITIES';
export const ADD_EXTENSION_ENTITY         = 'ADD_EXTENSION_ENTITY';
export const DELETE_EXTENSION_ENTITY      = 'DELETE_EXTENSION_ENTITY';
export const UPDATE_EXTENSION_ENTITY      = 'UPDATE_EXTENSION_ENTITY';
export const CHANGE_EXTENSION_PROCCESSING = 'CHANGE_EXTENSION_PROCCESSING';

export const EXTENSION_ENTITY_TYPE = 'EXTENSION';


const ERROR_CODE_MAP = {
    INSTALL_ERROR : {
        message : 'Some error occurred during install process',
        title   : 'Extension install error',
        meta    : 'EXTENSION_INSTALL_ERROR'
    },
    UNINSTALL_ERROR : {
        message : 'Some error occurred during uninstall process',
        title   : 'Extension uninstall error',
        meta    : 'EXTENSION_UNINSTALL_ERROR'

    },
    UPDATE_ERROR : {
        message : 'Some error occurred during update',
        title   : 'Extension update error',
        meta    : 'EXTENSION_UPDATE_ERROR'

    },
    CHECK_UPDATES_ERROR : {
        message : 'Some error occurred during check process',
        title   : 'Extension check error',
        meta    : 'EXTENSION_CHECK_ERROR'
    },
    TIMEOUT : {
        title   : 'Timeout error',
        message : 'Something went wrong. Please try again later.',
        meta    : 'TIMEOUT'
    }
};

const STOP_PROCESSING_STATUSES = [ 'installed', 'update-available', 'up-to-date' ];


export function getExtensions() {
    return async dispatch => {
        dispatch({ type: GET_EXTENSIONS_REQUEST });

        try {
            const extensions = await api.extensions.list();
            const mappedExtension = extensions.map(mapExtension);

            dispatch({
                type    : GET_EXTENSIONS_SUCCESS,
                payload : { extensions: mappedExtension }
            });
        } catch (err) {
            console.log(err);
            dispatch({ type: GET_EXTENSIONS_FAILURE });
        }
    };
}


export function getSingleExtension(name) {
    return async dispatch => {
        dispatch({ type: GET_SINGLE_EXTENSION_REQUEST });

        try {
            const id = encodeURIComponent(name);
            const extension = await api.extensions.show(id);
            const mappedExtension = mapExtension(extension);

            dispatch({
                type    : GET_SINGLE_EXTENSION_SUCCESS,
                payload : { extension: mappedExtension }
            });
        } catch (err) {
            console.log(err);
            dispatch({ type: GET_SINGLE_EXTENSION_FAILURE });
        }
    };
}


export function getInstalledExtensions() {
    return async dispatch => {
        try {
            const entities = await smartHome.getEntities(EXTENSION_ENTITY_TYPE);
            const serializedEntities = [];

            for (const key in entities) {
                if (entities.hasOwnProperty(key)) {
                    const entity = entities[key];
                    const entityId = entity.getId();

                    entity.onAttributePublish(params => dispatch(handlePublishAttribute(params)));
                    entity.onErrorPublish(error => dispatch(handleEntityError(error, entityId)));


                    serializedEntities.push(entity.serialize());
                }
            }
            const extensions = serializedEntities.map(mapExtensionEntity);

            dispatch({
                type    : GET_EXTENSION_ENTITIES,
                payload : { extensions }
            });
        } catch (err) {
            console.log(err);
        }
    };
}

function handleEntityError(error, entityId) {
    return dispatch => {
        if (error.value && typeof error.value === 'object') dispatch(onErrorPublish(error.value, entityId));
        else dispatch(onErrorPublish(error, entityId));
    };
}

function onErrorPublish(err, entityId) {
    return (dispatch) => {
        entityId && dispatch(stopProcessing({ entityId }));
        const error = ERROR_CODE_MAP[err.code];

        if (error) {
            const { meta, title, message } = error;

            dispatch(callValErrNotification({ meta, title, message }));
        }
    };
}

export  function createExtensionEntity(extensionData) {
    return  async (dispatch) => {
        const dumppedExtension = dumpExtension(extensionData);

        try {
            dispatch(startProcessing({ processingLabel: 'installing', name: dumppedExtension.name }));

            const { entityId } =  await smartHome.createEntityRequest(
                EXTENSION_ENTITY_TYPE,
                dumppedExtension,
                dumppedExtension.name
            );

            const entity = smartHome.getEntityById(EXTENSION_ENTITY_TYPE, entityId);

            dispatch(startProcessing({  entityId, processingLabel: 'installing' }));

            entity.setAttribute('event', 'install');
        } catch (error) {
            dispatch(onErrorPublish(error));
        } finally {
            dispatch(stopProcessing({  name: dumppedExtension.name }));
        }
    };
}

export function onNewExtensionAdded(entity) {
    return async (dispatch) => {
        const entityId = entity.getId();

        try {
            entity.onAttributePublish(params => dispatch(handlePublishAttribute(params)));
            entity.onErrorPublish(error => dispatch(handleEntityError(error, entityId)));


            const serializedEntity = entity.serialize();
            const extension = mapExtensionEntity(serializedEntity);

            dispatch({
                type    : ADD_EXTENSION_ENTITY,
                payload : { extension }

            });
        } catch (err) {
            dispatch(onErrorPublish(err, entityId));
        }
    };
}

export function checkExtensionUpdate(entityId) {
    return async dispatch => {
        try {
            dispatch(startProcessing({ entityId, processingLabel: 'checking' }));
            await attributeDispatcher.setAsyncAttribute({
                type  : EXTENSION_ENTITY_TYPE,
                field : 'event',
                value : 'check',
                entityId
            });
        } catch (err) {
            dispatch(onErrorPublish(err, entityId));
        }
    };
}


export function updateExtension(entityId) {
    return async dispatch => {
        try {
            dispatch(startProcessing({ entityId, processingLabel: 'updating' }));

            await attributeDispatcher.setAsyncAttribute({
                type  : EXTENSION_ENTITY_TYPE,
                field : 'event',
                value : 'update',
                entityId
            });
        } catch (err) {
            dispatch(onErrorPublish(err, entityId));
        }
    };
}


export function deleteExtension(entityId, name = '') {
    return async dispatch => {
        try {
            dispatch(startProcessing({ entityId, processingLabel: 'uninstalling' }));

            await attributeDispatcher.setAsyncAttribute({
                type  : EXTENSION_ENTITY_TYPE,
                field : 'event',
                value : 'uninstall',
                entityId
            });
            dispatch(getSingleExtension(name));
        } catch (err) {
            dispatch(onErrorPublish(err, entityId));
        }
    };
}

export function onExtensionDelete(id) {
    return dispatch => {
        dispatch({
            type    : DELETE_EXTENSION_ENTITY,
            payload : { id }
        });
    };
}

export function handlePublishAttribute({ field, value, entity = null }) {
    return (dispatch, getState) => {
        const entityId = entity.getId();
        const updated = mapExtensionEntityUpdate({ [field]: value });

        const extension = getState().extensions.installedEntities.list?.find(item => item.id === entityId);
        const isStateChanged = field === 'state';
        const isExtensionProcessing = extension && extension.isProcessing;
        const isStopProcessing = STOP_PROCESSING_STATUSES.includes(value);

        const isSuccessNotificationShown = isExtensionProcessing && isStateChanged && isStopProcessing;

        if (isSuccessNotificationShown) {
            dispatch(showExtensionNotification(entityId, extension.title, value));
        }

        if (isStopProcessing) {
            dispatch(stopProcessing({ entityId }));
        }
        if (Object.keys(updated).length) {
            dispatch({
                type    : UPDATE_EXTENSION_ENTITY,
                payload : {
                    id : entityId,
                    updated
                }
            });
        }
    };
}

function showExtensionNotification(entityId, name, state) {
    return dispatch => {
        const meta = { type: toastsMeta.EXTENSION_EVENT, entityId };
        let title;
        let message;

        switch (state) {
            case 'installed':
                title = 'Download completed';
                message = `Extension ${name} has been successfully installed!`;
                break;
            case 'update-available':
                title = 'Update available';
                message = `Extension ${name} has new updates and can be updated!`;
                break;
            case 'up-to-date':
                title = 'No updates available';
                message = `Extension ${name} is up-to-date.`;
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

export function setExtensionsSearchQuery(value) {
    return {
        type    : SET_EXTENSIONS_SEARCH_QUERY,
        payload : { searchQuery: value }
    };
}

export function setExtensionsSortOrder(value) {
    return {
        type    : SET_EXTENSIONS_SORT_ORDER,
        payload : { sortOrder: value }
    };
}

export function setExtensionsCurrentPage(value) {
    return {
        type    : SET_EXTENSIONS_CURRENT_PAGE,
        payload : { currentPage: value }
    };
}

export function startProcessing({
    entityId,
    processingLabel,
    name
}) {
    return ({
        type    : CHANGE_EXTENSION_PROCCESSING,
        payload : {
            entityId,
            processingLabel,
            name,
            isProcessing : true
        }
    });
}

export function stopProcessing({
    entityId,
    name
}) {
    return ({
        type    : CHANGE_EXTENSION_PROCCESSING,
        payload : {
            entityId,
            name,
            processingLabel : '',
            isProcessing    : false
        }
    });
}
