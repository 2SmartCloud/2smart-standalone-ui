import smartHome from '../smartHome/smartHomeSingleton';
// import { mapDiscoveryEntityToDiscovery } from '../utils/mapper/g';
import { handlePublishError } from './homie';
import { hideDeleteModal } from './interface';

export const GET_DISCOVERIES = 'GET_DISCOVERIES';
export const ACCEPT_DISCOVERY = 'ACCEPT_DISCOVERY';
export const DELETE_DISCOVERY = 'DELETE_DISCOVERY';
export const ADD_NEW_DISCOVERY = 'ADD_NEW_DISCOVERY';
export const CHANGE_DISCOVERY_STATUS = 'CHANGE_DISCOVERY_STATUS';
export const START_DELETE_LOADING = 'START_DELETE_LOADING';
export const STOP_DELETE_LOADING = 'STOP_DELETE_LOADING';
export const DISCOVERY_ENTITY_TYPE = 'DISCOVERY';

export function getDiscoveries() {
    return async dispatch => {
        try {
            const discoveries = await smartHome.getEntities(DISCOVERY_ENTITY_TYPE);
            const serializedDiscoveries = {};

            for (const key in discoveries) {
                if (discoveries.hasOwnProperty(key)) {
                    const discovery = discoveries[key];
                    const status = discovery?.acceptedAt ? 'isPending' : 'isNew';

                    serializedDiscoveries[key] = {
                        ...discovery,
                        status
                    };
                }
            }

            dispatch({
                type    : GET_DISCOVERIES,
                payload : { discoveries: serializedDiscoveries }
            });
        } catch (e) {
            console.log(e);
        }
    };
}


export function onNewDiscoveryAdded(discovery) {
    return (dispatch) => {
        const newDiscovery = {
            id          : discovery?.id,
            name        : discovery?.name,
            entityTopic : discovery?.entityTopic,
            createdAt   : discovery?.createdAt,
            status      : 'isNew'
        };

        dispatch({
            type      : ADD_NEW_DISCOVERY,
            discovery : newDiscovery
        });
    };
}


export function acceptDiscovery(entityTopic, deviceId) {
    return async dispatch => {
        try {
            dispatch(changeDiscoveryStatus(deviceId, 'isFetching'));
            const { instance } = smartHome.getInstanceByTopic(entityTopic);

            await instance.setAttribute('event', 'accept');

            dispatch(onDiscoveryAccepted(instance));
        } catch (e) {
            console.log(e);
            dispatch(changeDiscoveryStatus(deviceId, 'isNew'));
            dispatch(handlePublishError(e));
        }
    };
}

export function changeDiscoveryStatus(deviceId, status) {
    return {
        type : CHANGE_DISCOVERY_STATUS,
        id   : deviceId,
        status
    };
}

export function startDiscoveryDeleting() {
    return { type: START_DELETE_LOADING   };
}

export function stopDiscoveryDeleting() {
    return { type: STOP_DELETE_LOADING   };
}

export function deleteDiscovery(entityTopic) {
    return async dispatch => {
        try {
            dispatch(startDiscoveryDeleting());
            const { instance } = smartHome.getInstanceByTopic(entityTopic);

            await instance.deleteRequest();

            dispatch(onDiscoveryDelete(instance));
        } catch (e) {
            console.log(e);
            dispatch(stopDiscoveryDeleting());
            dispatch(handlePublishError(e));
        }
    };
}


export function onDiscoveryAccepted(discovery) {
    return dispatch => {
        dispatch({
            type    : ACCEPT_DISCOVERY,
            payload : { discovery }
        });

        dispatch(changeDiscoveryStatus(discovery.id, 'isPending'));
    };
}

export function onDiscoveryDelete(discovery) {
    return dispatch => {
        dispatch({
            type    : DELETE_DISCOVERY,
            payload : { ...discovery }
        });
        dispatch(stopDiscoveryDeleting());
        dispatch(hideDeleteModal());
    };
}

