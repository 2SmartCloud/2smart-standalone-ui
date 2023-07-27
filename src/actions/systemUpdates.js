import {
    mapSystemUpdatesEntityToSystemUpdate,
    updateField
}                              from '../utils/mapper/systemUpdates';
import { attributeDispatcher } from '../utils/homie/dispatcherSingleton';
import smartHome               from '../smartHome/smartHomeSingleton';
import toastsMeta              from '../components/base/toast/meta';
import history                 from '../history';
import { SETTINGS }            from '../assets/constants/routes';
import { NAVIGATION_OPTIONS }  from '../assets/constants/settings';

import {
    callToast,
    callValErr
}                              from '../components/base/toast/callToast';
import {
    hideToastNotification,
    CALL_TOAST_NOTIFICATION
}                              from './interface';
import { handlePublishError }  from  './homie';

export const CHECK_SYSTEM_UPDATES_REQUEST = 'CHECK_SYSTEM_UPDATES_REQUEST';
export const CHECK_SYSTEM_UPDATES_SUCCESS = 'CHECK_SYSTEM_UPDATES_SUCCESS';
export const CHECK_SYSTEM_UPDATES_ERROR   = 'CHECK_SYSTEM_UPDATES_ERROR';
export const UPDATE_SYSTEM_UPDATES        = 'UPDATE_SYSTEM_UPDATES';
export const RUN_ACTION_START             = 'RUN_ACTION_START';
export const RUN_ACTION_END               = 'RUN_ACTION_END';

export const SYSTEM_UPDATES_ENTITY_TYPE   = 'SYSTEM_UPDATES';

export const ENTITY_ID = 'services';

const systemUpdatesTabInfo = NAVIGATION_OPTIONS.find(option => option.value === 'system') || {};

export function getSystemUpdates() {
    return async dispatch => {
        dispatch({ type: CHECK_SYSTEM_UPDATES_REQUEST });

        try {
            const entities = await smartHome.getEntities(SYSTEM_UPDATES_ENTITY_TYPE);
            const entity = entities[ENTITY_ID];

            entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));
            entity.onErrorPublish(params => dispatch(handleAttributeError(params)));

            const systemUpdates = entity.serialize();

            dispatch({
                type    : CHECK_SYSTEM_UPDATES_SUCCESS,
                payload : {
                    systemUpdates : mapSystemUpdatesEntityToSystemUpdate(systemUpdates)
                }
            });
        } catch (error) {
            console.error('getSystemUpdates() error', error);
            dispatch({ type: CHECK_SYSTEM_UPDATES_ERROR });
        }
    };
}

export function checkSystemUpdates() {
    return async (dispatch) => {
        dispatch({
            type    : RUN_ACTION_START,
            payload : { actionType: 'checkUpdates' }
        });

        try {
            await attributeDispatcher.setAsyncAttribute({
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'check',
                entityId : ENTITY_ID
            });
        } catch (error) {
            dispatch(showNotification('updates-check-error'));
            dispatch({
                type    : RUN_ACTION_END,
                payload : { actionType: 'checkUpdates' }
            });
        }
    };
}

export function downloadUpdates() {
    return async dispatch => {
        dispatch({
            type    : RUN_ACTION_START,
            payload : { actionType: 'downloadUpdates' }
        });

        try {
            await attributeDispatcher.setAsyncAttribute({
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'download',
                entityId : ENTITY_ID
            });
        } catch (error) {
            dispatch(showNotification('updates-download-error'));
        } finally {
            dispatch({
                type    : RUN_ACTION_END,
                payload : { actionType: 'downloadUpdates' }
            });
        }
    };
}

export function applyUpdates() {
    return async dispatch => {
        dispatch({
            type    : RUN_ACTION_START,
            payload : { actionType: 'applyUpdates' }
        });

        try {
            await attributeDispatcher.setAsyncAttribute({
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'update',
                entityId : ENTITY_ID
            });
        } catch (error) {
            console.error('applyUpdates() error', error);
        } finally {
            dispatch({
                type    : RUN_ACTION_END,
                payload : { actionType: 'applyUpdates' }
            });
        }
    };
}

export function restartApplication() {
    return async (dispatch) => {
        dispatch({
            type    : RUN_ACTION_START,
            payload : { actionType: 'restart' }
        });
        try {
            await attributeDispatcher.setAsyncAttribute({
                type     : SYSTEM_UPDATES_ENTITY_TYPE,
                field    : 'event',
                value    : 'restart',
                entityId : ENTITY_ID
            });
        } catch (error) {
            console.error('restartApplication() error', error);
        } finally {
            dispatch({
                type    : RUN_ACTION_END,
                payload : { actionType: 'restart' }
            });
        }
    };
}

export function onSystemUpdates(entity) {
    return async dispatch => {
        entity.onAttributePublish(params => dispatch(handlePublishEvent(params)));
        entity.onErrorPublish(params => dispatch(handleAttributeError(params)));

        const systemUpdates = entity.serialize();

        dispatch({
            type    : UPDATE_SYSTEM_UPDATES,
            payload : {
                updated : mapSystemUpdatesEntityToSystemUpdate(systemUpdates)
            }
        });
    };
}

function handlePublishEvent({ field, value }) {
    return async (dispatch, getState) => {
        const state = getState();
        const isRunCheckForUpdates = state?.systemUpdates?.runningActions?.includes('checkUpdates') || false;

        if (isRunCheckForUpdates) {
            if (field === 'status') {
                dispatch({
                    type    : RUN_ACTION_END,
                    payload : { actionType: 'checkUpdates' }
                });

                if (value === 'up-to-date') dispatch(showNotification('no-updates'));
            }
        } else if (field === 'status' && value === 'update-available') {
            const { pathname, hash } = history.location;
            const isSystemUpdatesPage = `${pathname}${hash}` === `${SETTINGS}${systemUpdatesTabInfo.hash}`;

            if (!isSystemUpdatesPage) {
                dispatch(showNotification('updates-exist'));
            } else dispatch(showNotification('updates-download-success'));
        }

        if  (field === 'status' && value === 'updating') {
            dispatch(hideToastNotification(toastsMeta.SYSTEM_UPDATES_EXISTS, 0));
        }
        dispatch({
            type    : UPDATE_SYSTEM_UPDATES,
            payload : {
                updated : updateField({ field, value })
            }
        });
    };
}

function handleAttributeError({ value: { code, message, fields } }) {
    return handlePublishError({ code, message, fields, entityId: ENTITY_ID });
}

function showNotification(value) {
    return async dispatch => {
        const props = {};
        const handleToast = [ 'no-updates', 'updates-exist', 'updates-download-success' ].includes(value)
            ? callToast
            : callValErr;

        switch (value) {
            case 'no-updates':
                props.meta = toastsMeta.SYSTEM_UPDATES_CHECK_SUCCESS;
                props.title = 'No updates available';
                props.message = 'System is up-to-date';
                break;
            case 'updates-check-error':
                props.meta = toastsMeta.SYSTEM_UPDATES_CHECK_ERROR;
                props.title = 'Failed to check for updates';
                props.message = 'Please try again later';
                break;
            case 'updates-exist':
                props.meta = toastsMeta.SYSTEM_UPDATES_EXISTS;
                props.title = 'System update exists';
                props.message = 'You can update your system';
                props.isInfinite = true;
                props.hidePrevious = true;
                props.controls = [ {
                    label       : 'Close',
                    type        : 'cancell',
                    handleClick : () => dispatch(hideToastNotification(toastsMeta.SYSTEM_UPDATES_EXISTS))
                }, {
                    label       : 'Go to system updates',
                    handleClick : () => {
                        history.push(`${SETTINGS}${systemUpdatesTabInfo.hash}`);

                        dispatch(hideToastNotification(toastsMeta.SYSTEM_UPDATES_EXISTS));
                    }
                } ];
                break;
            case 'updates-download-success':
                props.meta = toastsMeta.SYSTEM_UPDATES_DOWNLOAD_SUCCESS;
                props.title = 'System update has been loaded';
                props.message = 'You can apply updates';
                break;
            case 'updates-download-error':
                props.meta = toastsMeta.SYSTEM_UPDATES_DOWNLOAD_ERROR;
                props.title = 'System update hasn\'t been loaded';
                props.message = 'Please try again later';
                break;
            default:
                return;
        }

        const id = handleToast({
            ...props
        });

        dispatch({
            type    : CALL_TOAST_NOTIFICATION,
            payload : {  ...props, id }
        });
    };
}
