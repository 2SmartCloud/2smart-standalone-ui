import api from '../../apiSingleton';
import store from '../../store';
import meta from '../../components/base/toast/meta';
import { getSettings, validateClientPanelToken } from '../user';
import { hidePinForm, hideToastNotification, showPinForm } from '../interface';
import { uttachErrorMessageToSpinner } from '../../utils/removeSpinner';

export const SCREEN_RENAME = 'SCREEN_RENAME';
export const SCREEN_RENAME_REQUEST = 'SCREEN_RENAME_REQUEST';
export const SCREEN_RENAME_ERROR = 'SCREEN_RENAME_ERROR';
export const SAVE_SCREEN = 'SAVE_SCREEN';
export const ENTERING_EDIT_SCREEN_MODE = 'ENTERING_EDIT_SCREEN_MODE';
export const REJECTING_EDIT_SCREEN_MODE = 'REJECTING_EDIT_SCREEN_MODE';
export const ENTER_SCREEN_EDIT_MODE = 'ENTER_SCREEN_EDIT_MODE';
export const EXIT_SCREEN_EDIT_MODE = 'EXIT_SCREEN_EDIT_MODE';
export const SELECT_SCREEN = 'SELECT_SCREEN';

export const START_FETCHING_SCREEN = 'START_FETCHING_SCREEN';
export const ERROR_FETCHING_SCREEN = 'ERROR_FETCHING_SCREEN';

export const START_RENAMING_SCREEN = 'START_RENAMING_SCREEN';
export const FINISH_RENAMING_SCREEN = 'FINISH_RENAMING_SCREEN';

export const ADMIN_DATA_FETCH_SUCCESS = 'ADMIN_DATA_FETCH_SUCCESS';
export const ADMIN_DATA_FETCH_FAILURE = 'ADMIN_DATA_FETCH_FAILURE';


export function getClientDataByInterval() {
    return async dispatch => {
        try {
            await dispatch(getSettings());
            await dispatch(validateClientPanelToken());

            dispatch({
                type : ADMIN_DATA_FETCH_SUCCESS
            });
        } catch (err) {
            if ((!err.status && err.name === 'TypeError') || err.status === 502) {
                uttachErrorMessageToSpinner();
                setTimeout(() => dispatch(getClientDataByInterval()), 5000);

                return;
            }
            dispatch({
                type : ADMIN_DATA_FETCH_FAILURE
            });
        }
    };
}


export function renameScreen({ name, id }) {
    return async dispatch => {
        dispatch({ type: SCREEN_RENAME_REQUEST });

        try {
            const screen = await api.screens.edit(id, { name });

            dispatch({
                type : SCREEN_RENAME,
                id,
                name : screen.name
            });

            store.dispatch(hideToastNotification(meta.BAD_RESPONSE));
        } catch (err) {
            dispatch({ type: SCREEN_RENAME_ERROR });
        }
    };
}

export function startRenaming({ id }) {
    return dispatch => {
        dispatch({
            type : START_RENAMING_SCREEN,
            id
        });
    };
}

export function finishRenaming({ id }) {
    return dispatch => {
        dispatch({
            type : FINISH_RENAMING_SCREEN,
            id
        });
    };
}

export function saveScreen({ id }) {
    return dispatch => {
        dispatch({
            type : SAVE_SCREEN,
            id
        });
    };
}

export function enterScreenEditMode(id) {
    return async (dispatch, getState) => {
        dispatch({ type: ENTERING_EDIT_SCREEN_MODE });

        await dispatch(getSettings());

        const { settings, isClientPanelAccessGranted } = getState().user;

        if (settings.isSecureModeEnabled.value && !isClientPanelAccessGranted) {
            dispatch(showPinForm({
                cb : () => {
                    dispatch({
                        type : ENTER_SCREEN_EDIT_MODE,
                        id
                    });
                    dispatch(hidePinForm());
                },
                reject : () => {
                    dispatch({ type: REJECTING_EDIT_SCREEN_MODE });
                },
                isCloseable : true
            }));

            return;
        }

        dispatch({
            type : ENTER_SCREEN_EDIT_MODE,
            id
        });
    };
}

export function exitScreenEditMode(id) {
    return (dispatch, getState) => {
        if (!id) {
            const activeEditScreen = getState().client.dashboard.screens
                .find(screen => screen.isActive && screen.isEditMode);

            id = activeEditScreen && activeEditScreen.id;
        }

        if (id) {
            dispatch({
                type : EXIT_SCREEN_EDIT_MODE,
                id
            });
        }
    };
}

export function selectScreen({ id }) {
    return dispatch => {
        if (!id) return;

        dispatch({
            type : SELECT_SCREEN,
            id
        });
    };
}
