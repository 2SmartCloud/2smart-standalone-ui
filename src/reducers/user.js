import produce from 'immer';
import {
    GET_SETTINGS_REQUEST,
    GET_SETTINGS_SUCCESS,
    GET_SETTINGS_FAILURE,
    GET_INFO_REQUEST,
    GET_INFO_SUCCESS,
    UPDATE_PIN_REQUEST,
    UPDATE_PIN_SUCCESS,
    UPDATE_PIN_FAILURE,
    UPDATE_SETTING_REQUEST,
    UPDATE_SETTING_SUCCESS,
    UPDATE_SETTING_FAILURE,
    CLEAR_PIN_VALIDATION_ERROR,
    GET_CLIENT_PANEL_ACCESS,
    REMOVE_CLIENT_PANEL_ACCESS,
    PROLONG_CLIENT_PANEL_ACCESS,
    UPDATE_CREDENTIALS_SUCCESS
} from '../actions/user';

const initialState = {
    settings : {
        isFetching          : false,
        isSecureModeEnabled : {
            isUpdating : false,
            value      : false
        },
        isAutoBlockingEnabled : {
            isUpdating : false,
            value      : false
        },
        info : {
            pincode : {
                isExists   : false,
                isUpdating : false,
                error      : {}
            },
            username   : '',
            isFetching : false
        }
    },
    isClientPanelAccessGranted : false
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_SETTINGS_REQUEST: {
            draft.settings.isFetching = true;
            break;
        }
        case GET_INFO_REQUEST: {
            draft.settings.info.isFetching = true;
            break;
        }
        case GET_SETTINGS_FAILURE: {
            draft.settings.isFetching = false;
            break;
        }
        case GET_SETTINGS_SUCCESS: {
            const {
                auto_exit_full_access_mode_enabled : isAutoBlockingEnabled,
                secure_mode_enabled : isSecureModeEnabled } = action;

            draft.settings.isFetching = false;
            draft.settings.isSecureModeEnabled.value = isSecureModeEnabled;
            draft.settings.isAutoBlockingEnabled.value = isAutoBlockingEnabled;
            break;
        }
        case GET_INFO_SUCCESS: {
            draft.settings.info.isFetching = false;
            const { info } = action;

            draft.settings.isFetching = false;
            draft.settings.info.pincode.isExists = info.pin;
            draft.settings.info.pincode.isUpdating = false;
            draft.settings.info.username = info.username;
            break;
        }
        case UPDATE_PIN_REQUEST: {
            draft.settings.info.pincode.isUpdating = true;
            break;
        }
        case UPDATE_PIN_SUCCESS: {
            const { pincode } = draft.settings.info;

            pincode.isUpdating = false;
            pincode.error = {};
            pincode.isExists = true;
            break;
        }
        case UPDATE_PIN_FAILURE: {
            const { error } = action;

            draft.settings.info.pincode.isUpdating = false;
            draft.settings.info.pincode.error = error;
            break;
        }
        case UPDATE_SETTING_REQUEST: {
            const { key } = action;

            draft.settings[key].isUpdating = true;
            break;
        }
        case UPDATE_SETTING_SUCCESS: {
            const { key, value } = action;

            draft.settings[key].isUpdating = false;
            draft.settings[key].value = value;
            break;
        }
        case UPDATE_SETTING_FAILURE: {
            const { key } = action;

            draft.settings[key].isUpdating = false;
            break;
        }
        case CLEAR_PIN_VALIDATION_ERROR: {
            draft.settings.info.pincode.error = {};
            break;
        }
        case GET_CLIENT_PANEL_ACCESS: {
            draft.isClientPanelAccessGranted = true;

            break;
        }
        case REMOVE_CLIENT_PANEL_ACCESS: {
            draft.isClientPanelAccessGranted = false;

            break;
        }
        case PROLONG_CLIENT_PANEL_ACCESS: {
            break;
        }
        case UPDATE_CREDENTIALS_SUCCESS: {
            const { username } = action;

            draft.settings.info.username = username;
            break;
        }
        default:
            break;
    }
}, initialState);
