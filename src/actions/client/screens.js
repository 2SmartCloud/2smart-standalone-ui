import api from '../../apiSingleton';
import meta from '../../components/base/toast/meta';
import { dumpScreens, dumpScreen } from '../../utils/dump/screen';
import { hideToastNotification } from '../interface';
import { getSettings, removeClientPanelAccess } from '../user';
import history from '../../history';
import { saveScreen, START_FETCHING_SCREEN } from './dashboard';


export const GET_SCREENS = 'GET_SCREENS';
export const GET_SCREENS_SUCCESS = 'GET_SCREENS:SUCCESS';
export const GET_SCREENS_REQUEST = 'GET_SCREENS:REQUEST';
export const GET_SCREENS_FAILURE = 'GET_SCREENS:FAILURE';
export const GET_SCREEN_SUCCESS = 'GET_SCREEN:SUCCESS';
export const GET_SCREEN_REQUEST = 'GET_SCREEN:REQUEST';
export const GET_SCREEN_FAILURE = 'GET_SCREEN:FAILURE';
export const CREATE_NEW_SCREEN = 'CREATE_NEW_SCREEN';
export const CREATE_NEW_SCREEN_REJECTED = 'CREATE_NEW_SCREEN_REJECTED';
export const DELETE_SCREEN = 'DELETE_SCREEN';
export const CREATING_NEW_SCREEN = 'CREATING_NEW_SCREEN';
export const DELETING_SCREEN = 'DELETING_SCREEN';
export const ERROR_FETCHING_CREATE = 'ERROR_FETCHING_CREATE';
export const ERROR_FETCHING_DELETE = 'ERROR_FETCHING_DELETE';
export const UPDATE_SCREEN_REQUEST = 'UPDATE_SCREEN:REQUEST';
export const UPDATE_SCREEN_SUCCESS = 'UPDATE_SCREEN:SUCCESS';
export const UPDATE_SCREEN_FAILURE = 'UPDATE_SCREEN:FAILURE';
export const UPDATE_SCREEN_REJECTED = 'UPDATE_SCREEN:REJECTED';
export const HIDE_SCREENS_PROTECTED_DATA = 'HIDE_SCREENS_PROTECTED_DATA';

export function getScreens() {
    return async dispatch => {
        try {
            dispatch({
                type : GET_SCREENS_REQUEST
            });
            const screens = await api.screens.list();

            dispatch({
                type    : GET_SCREENS_SUCCESS,
                screens : dumpScreens(screens)
            });
        } catch (err) {
            if (err.name === 'AbortError') {
                return;
            }
            dispatch({
                type : GET_SCREENS_FAILURE
            });
            throw err;
        }
    };
}

export function getScreen(id) {
    return async dispatch => {
        try {
            dispatch({
                type : GET_SCREEN_REQUEST,
                id
            });
            const screen = await api.screens.show(id);

            dispatch({
                type   : GET_SCREEN_SUCCESS,
                screen : dumpScreen(screen)
            });
        } catch (error) {
            if (error.code === 'INVALID_SIGNATURE' || error.code === 'PERMISSION_DENIED') {
                dispatch(removeClientPanelAccess());
            } else if (error.code === 'REQUEST_REJECTED' || error.name === 'AbortError') {
                return;
            } else if (error.code === 'WRONG_ID') {
                return;
            }

            dispatch({
                type : GET_SCREEN_FAILURE,
                id
            });
            console.log(error);
        }
    };
}

export function updateScreen(id, payload) {
    return async dispatch => {
        dispatch({
            type : START_FETCHING_SCREEN,
            id
        });
        dispatch(getSettings());

        try {
            await api.screens.update(id, payload);
            await dispatch(getScreens());
            await dispatch(saveScreen({ id }));
        } catch (error) {
            dispatch({ type: UPDATE_SCREEN_REJECTED, id });
            if (error.code === 'INVALID_SIGNATURE' || error.code === 'PERMISSION_DENIED') {
                dispatch(removeClientPanelAccess());
            } else if (error.code === 'REQUEST_REJECTED') {
                return;
            }
        }
    };
}

export function updateScreenParentModeStatus(id, value) {
    return async dispatch => {
        try {
            dispatch({ type: UPDATE_SCREEN_REQUEST });

            const response = await api.screens.update(id, { parentControl: value });

            dispatch({
                type  : UPDATE_SCREEN_SUCCESS,
                id,
                value : response.parentControl
            });
        } catch (error) {
            dispatch({
                type : UPDATE_SCREEN_FAILURE
            });
            if (error.code === 'INVALID_SIGNATURE' || error.code === 'PERMISSION_DENIED') {
                dispatch(removeClientPanelAccess());
            } else if (error.code === 'REQUEST_REJECTED') {
                return;
            }

            throw error;
        }
    };
}

export function createNewScreen() {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type : CREATING_NEW_SCREEN
            });
            dispatch(getSettings());
            dispatch(getScreens());

            setTimeout(async () => {
                try {
                    const { screens } = getState().client.dashboard;
                    const newScreenIdx = screens.length + 1;
                    const screen = await api.screens.create({ position: newScreenIdx });
                    const { id } = screen;

                    history.push(`/${id}`);

                    dispatch({
                        type   : CREATE_NEW_SCREEN,
                        screen : {
                            ...screen,
                            widgets : screen.widgets || []
                        }
                    });

                    dispatch(hideToastNotification(meta.BAD_RESPONSE));

                    resolve();
                } catch (error) {
                    dispatch({ type: ERROR_FETCHING_CREATE });

                    if (error.code === 'INVALID_SIGNATURE' || error.code === 'PERMISSION_DENIED') {
                        dispatch(removeClientPanelAccess());
                    } else if (error.code === 'REQUEST_REJECTED') {
                        dispatch({
                            type : CREATE_NEW_SCREEN_REJECTED
                        });
                    }

                    reject();
                    throw error;
                }
            }, 500);
        });
    };
}

export function deleteScreen({ id }) {
    return async dispatch => {
        try {
            dispatch({
                type : DELETING_SCREEN
            });

            await api.screens.delete(id);
            dispatch(getScreens());

            dispatch(hideToastNotification(meta.BAD_RESPONSE));

            dispatch({
                type : DELETE_SCREEN,
                id
            });

            history.push('/');
        } catch (error) {
            dispatch({ type: ERROR_FETCHING_DELETE });

            if (error.code === 'INVALID_SIGNATURE' || error.code === 'PERMISSION_DENIED') {
                dispatch(removeClientPanelAccess());

                return;
            }

            throw error;
        }
    };
}

export function hideScreensProtectedData() {
    return (dispatch, getState) => {
        const state = getState();
        const isClientPanelAccessGranted = state.user.isClientPanelAccessGranted;
        const isSecureModeEnabled = state.user.settings.isSecureModeEnabled.value;

        dispatch({
            type : HIDE_SCREENS_PROTECTED_DATA,
            isClientPanelAccessGranted,
            isSecureModeEnabled
        });
    };
}
