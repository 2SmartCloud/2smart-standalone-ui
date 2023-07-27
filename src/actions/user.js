import api from '../apiSingleton';
import meta from '../components/base/toast/meta';
import { hideScreensProtectedData } from '../actions/client/screens';
import { getSettingsSuccessMessage } from '../utils/messages';
import { callToastNotification,
    hideToastNotification } from './interface';
import { exitScreenEditMode } from './client/dashboard';

export const GET_INFO_REQUEST = 'GET_INFO:REQUEST';
export const GET_INFO_SUCCESS = 'GET_INFO:SUCCESS';
export const GET_INFO_FAILURE = 'GET_INFO:FAILURE';
export const GET_SETTINGS_REQUEST = 'GET_SETTINGS:REQUEST';
export const GET_SETTINGS_SUCCESS = 'GET_SETTINGS:SUCCESS';
export const GET_SETTINGS_FAILURE = 'GET_SETTINGS:FAILURE';
export const UPDATE_SETTING_REQUEST = 'UPDATE_SETTING:REQUEST';
export const UPDATE_SETTING_SUCCESS = 'UPDATE_SETTING:SUCCESS';
export const UPDATE_SETTING_FAILURE = 'UPDATE_SETTING:FAILURE';
export const UPDATE_PIN_REQUEST = 'UPDATE_PIN:REQUEST';
export const UPDATE_PIN_SUCCESS = 'UPDATE_PIN:SUCCESS';
export const UPDATE_PIN_FAILURE = 'UPDATE_PIN:FAILURE';
export const CLEAR_PIN_VALIDATION_ERROR = 'CLEAR_PIN_VALIDATION_ERROR';
export const GET_CLIENT_PANEL_ACCESS = 'GET_CLIENT_PANEL_ACCESS';
export const START_INACTIVITY_DETECTION = 'START_INACTIVITY_DETECTION';
export const VALIDATE_CLIENT_PANEL_ACCESS_TOKEN = 'VALIDATE_CLIENT_PANEL_ACCESS_TOKEN';
export const REMOVE_CLIENT_PANEL_ACCESS = 'REMOVE_CLIENT_PANEL_ACCESS';
export const PROLONG_CLIENT_PANEL_ACCESS = 'PROLONG_CLIENT_PANEL_ACCESS';
export const UPDATE_CREDENTIALS_SUCCESS = 'UPDATE_CREDENTIALS:SUCCESS';


export function getSettings() {
    return async dispatch => {
        dispatch({ type: GET_SETTINGS_REQUEST });

        try {
            const settings = await api.settings.show();

            dispatch({
                type : GET_SETTINGS_SUCCESS,
                ...settings
            });
            dispatch(hideScreensProtectedData());
        } catch (error) {
            if (error.name === 'AbortError') {
                return;
            }
            dispatch({ type: GET_SETTINGS_FAILURE });
            if (error.code === 'INVALID_SIGNATURE') {
                dispatch(removeClientPanelAccess());
            }
            throw error;
        }
    };
}


export function getInfo() {
    return async dispatch => {
        dispatch({ type: GET_INFO_REQUEST });

        try {
            const info = await api.users.show();

            dispatch({
                type : GET_INFO_SUCCESS,
                info
            });
        } catch (error) {
            dispatch({ type: GET_INFO_FAILURE });
            throw error;
        }
    };
}

export function updateSetting(key, value) {
    return async dispatch => {
        dispatch({
            type : UPDATE_SETTING_REQUEST,
            key
        });
        dispatch(hideToastNotification(meta.UPDATE_OPTION, 0));

        try {
            const payloadKey = mapSettings[key];
            const payload = { [payloadKey]: value };
            const response = await api.settings.update(payload);

            if (response) {
                const newValue = response[payloadKey];

                dispatch({
                    type  : UPDATE_SETTING_SUCCESS,
                    key,
                    value : newValue
                });
                dispatch(callToastNotification({  meta: meta.UPDATE_OPTION, title: 'Done', message: 'Your setting successfully updated' }));
            }
        } catch (error) {
            dispatch({
                type : UPDATE_SETTING_FAILURE,
                key
            });

            throw error;
        }
    };
}

export function updatePin(pin, pinConfirm) {
    return async dispatch => {
        dispatch({
            type : UPDATE_PIN_REQUEST
        });

        try {
            await api.users.updatePin({ pin, pinConfirm });

            dispatch({
                type : UPDATE_PIN_SUCCESS
            });
            dispatch(callToastNotification({  meta: meta.CHANGE_PIN, title: 'Done', message: 'Your PIN successfully updated' }));
            dispatch(hideToastNotification(meta.CHANGE_PIN));
        } catch (error) {
            if (error.code === 'FORMAT_ERROR') {
                dispatch({ type: UPDATE_PIN_FAILURE, error: error.fields });
            } else {
                dispatch({ type: UPDATE_PIN_FAILURE, error: {} });

                throw error;
            }
        }
    };
}

export function updateCredentials(payload) {
    return async dispatch => {
        try {
            const resp = await api.users.updateCredentials(payload);

            dispatch(callToastNotification({  meta: meta.UPDATE_OPTION, title: 'Done', message: getSettingsSuccessMessage(payload) }));
            dispatch(hideToastNotification({  meta: meta.UPDATE_OPTION }));
            if (resp.newToken) {
                localStorage.setItem('jwt', resp.newToken);
                api.apiAdmin.setToken(resp.newToken);
            }
            const { username } = resp;

            dispatch({
                type : UPDATE_CREDENTIALS_SUCCESS,
                username
            });
        } catch (error) {
            if (error.code === 'SERVER_ERROR') {
                dispatch(callToastNotification({
                    meta    : meta.BAD_RESPONSE,
                    title   : 'Something went wrong',
                    message : 'Bad response from server'
                }));
            }
            throw error;
        }
    };
}


export function getClientPanelAccess(pin) {
    return async dispatch => {
        try {
            const response = await api.sessions.create({ pin });
            const { accessToken } = response;

            updateClientToken(accessToken);

            dispatch({
                type : GET_CLIENT_PANEL_ACCESS
            });
            dispatch(startInactivityDetection());
        } catch (error) {
            throw error;
        }
    };
}

export function startInactivityDetection() {
    return dispatch => {
        dispatch({
            type : START_INACTIVITY_DETECTION
        });
    };
}

export function validateClientPanelToken() {
    return async dispatch => {
        const token = localStorage.getItem('clientPanelAccessToken');

        if (token) {
            try {
                const response =  await api.sessions.update(token);
                const { accessToken: newToken } = response;

                updateClientToken(newToken);
                dispatch({
                    type : VALIDATE_CLIENT_PANEL_ACCESS_TOKEN
                });
                dispatch({
                    type : GET_CLIENT_PANEL_ACCESS
                });
                dispatch(startInactivityDetection());
            } catch (error) {
                if (
                    error.code === 'INVALID_SIGNATURE'
                    || error.code === 'PERMISSION_DENIED'
                    || error.code === 'TOKEN_EXPIRED'
                ) {
                    dispatch(removeClientPanelAccess());
                }

                console.log(error);
                throw error;
            }
        }
    };
}

export function removeClientPanelAccess() {
    return dispatch => {
        removeClientToken();

        dispatch({
            type : REMOVE_CLIENT_PANEL_ACCESS
        });
        dispatch(exitScreenEditMode());
    };
}

export function prolongClientPanelAccess() {
    return async dispatch => {
        const token = localStorage.getItem('clientPanelAccessToken');

        if (token) {
            try {
                const response = await api.sessions.update(token);
                const { accessToken } = response;

                dispatch({
                    type : PROLONG_CLIENT_PANEL_ACCESS
                });
                updateClientToken(accessToken);
            } catch (error) {
                if (error.code === 'INVALID_SIGNATURE') {
                    dispatch(removeClientPanelAccess());
                }

                throw error;
            }
        }
    };
}

function updateClientToken(token) {
    localStorage.setItem('clientPanelAccessToken', token);
    api.apiClient.setToken(token);
}

function removeClientToken() {
    localStorage.removeItem('clientPanelAccessToken');
    api.apiClient.setToken('');
}

export function clearPincodeValidationError() {
    return dispatch => {
        dispatch({
            type : CLEAR_PIN_VALIDATION_ERROR
        });
    };
}

const mapSettings = {
    isSecureModeEnabled   : 'secure_mode_enabled',
    isAutoBlockingEnabled : 'auto_exit_full_access_mode_enabled'
};
