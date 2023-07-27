import produce from 'immer';

import { REMOVE_CLIENT_PANEL_ACCESS } from '../../actions/user';
import {
    GET_SCREENS_SUCCESS,
    GET_SCREENS_REQUEST,
    GET_SCREENS_FAILURE,
    GET_SCREEN_SUCCESS,
    GET_SCREEN_REQUEST,
    GET_SCREEN_FAILURE,
    CREATE_NEW_SCREEN,
    CREATE_NEW_SCREEN_REJECTED,
    DELETE_SCREEN,
    CREATING_NEW_SCREEN,
    DELETING_SCREEN,
    ERROR_FETCHING_CREATE,
    ERROR_FETCHING_DELETE,
    UPDATE_SCREEN_REQUEST,
    UPDATE_SCREEN_SUCCESS,
    HIDE_SCREENS_PROTECTED_DATA,
    UPDATE_SCREEN_FAILURE,
    UPDATE_SCREEN_REJECTED
} from './../../actions/client/screens';
import {
    SCREEN_RENAME,
    SCREEN_RENAME_REQUEST,
    SCREEN_RENAME_ERROR,
    SAVE_SCREEN,
    ENTERING_EDIT_SCREEN_MODE,
    REJECTING_EDIT_SCREEN_MODE,
    ENTER_SCREEN_EDIT_MODE,
    EXIT_SCREEN_EDIT_MODE,
    SELECT_SCREEN,
    ERROR_FETCHING_SCREEN,
    // FINISH_FETCHING_SCREEN,
    START_RENAMING_SCREEN,
    FINISH_RENAMING_SCREEN,
    START_FETCHING_SCREEN,
    ADMIN_DATA_FETCH_SUCCESS,
    ADMIN_DATA_FETCH_FAILURE
} from './../../actions/client/dashboard';
import { CREATE_NEW_WIDGET, DELETE_WIDGET_FROM_SCREEN, UPDATE_WIDGET } from './../../actions/client/widget';


const DEFAULT_SCREEN_CONF = {
    isEditMode              : false,
    isActive                : false,
    isRenaming              : false,
    isFetching              : false,
    isUpdating              : false,
    isParentControlEnabled  : true,
    isParentControlUpdating : false,
    isProcessingEditMode    : false,
    isRenamingScreen        : false,
    fetched                 : false,
    widgets                 : [],
    layout                  : {}
};

const initialState = {
    screens             : [],
    isFetching          : true,
    isCreating          : false,
    isDeleting          : false,
    isError             : false,
    isClientDataFetched : null

};

export default produce((draft, action) => { // eslint-disable-line
    switch (action.type) {
        case ADMIN_DATA_FETCH_SUCCESS: {
            draft.isClientDataFetched = true;
            break;
        }
        case ADMIN_DATA_FETCH_FAILURE: {
            draft.isClientDataFetched = false;
            break;
        }
        case DELETE_WIDGET_FROM_SCREEN: {
            const screen = draft.screens.find(({ id }) => id === action.screen);
            const idx = screen.widgets.findIndex(({ id }) => id === action.id);

            screen.widgets.splice(idx, 1);

            break;
        }
        case CREATE_NEW_WIDGET: {
            const screen = draft.screens.find(({ id }) => id === action.screenId);

            screen.widgets.push(action.widget);

            break;
        }
        case UPDATE_WIDGET: {
            const screenIdx = draft.screens.findIndex(({ id }) => id === action.screenId);
            const widgetIdx = draft.screens[screenIdx].widgets.findIndex(({ id }) => id === action.widget.id);

            draft.screens[screenIdx].widgets[widgetIdx] = action.widget;

            break;
        }
        case GET_SCREENS_REQUEST:
            draft.isFetching = true;
            break;
        case GET_SCREENS_SUCCESS:
            draft.isFetching = false;
            draft.isError = false;
            if (!draft.screens.length) {
                draft.screens = action.screens.map((screen, key) => {
                    if (key === 0) return { ...DEFAULT_SCREEN_CONF, ...screen, isActive: true };

                    return {
                        ...DEFAULT_SCREEN_CONF,
                        ...screen
                    };
                });
            } else {
                draft.screens = action.screens.map((screen, index) => {
                    const currentScreen = draft.screens[index] || {};
                    const prevScreen = draft.screens.find(item => screen.id === item.id);

                    return {
                        ...prevScreen,
                        ...screen,
                        widgets : screen.widgets.length ? screen.widgets : currentScreen.widgets
                    };
                });
            }

            break;
        case GET_SCREENS_FAILURE:
            draft.isFetching = false;
            break;
        case GET_SCREEN_SUCCESS: {
            const { screen: screenExtraPayload } = action;
            const screen = draft.screens.find(({ id }) => {
                return id === screenExtraPayload.id;
            });

            screen.uuid = screenExtraPayload.uuid;
            screen.layout = screenExtraPayload.layout;
            screen.widgets = screenExtraPayload.widgets;
            screen.isUpdating = false;
            screen.isFetching = false;
            screen.fetched = true;

            break;
        }
        case GET_SCREEN_REQUEST: {
            const { id: screenId } = action;
            const screen = draft.screens.find(({ id }) => screenId === id);

            if (screen.fetched) {
                screen.isUpdating = true;
            } else {
                screen.isFetching = true;
            }
            break;
        }
        case GET_SCREEN_FAILURE: {
            const { id } = action;
            const screen = draft.screens.find(item => item === id);

            if (screen) {
                screen.isUpdating = false;
                screen.isFetching = false;
            }
            break;
        }
        case SCREEN_RENAME: {
            const { id, name } = action;
            const screen = draft.screens.find(obj => obj.id === id);

            draft.isRenamingScreen = false;
            screen.name = name;
            screen.isRenaming = false;
            screen.isUpdating = false;

            break;
        }
        case SCREEN_RENAME_REQUEST:
            draft.isRenamingScreen = true;
            break;
        case SCREEN_RENAME_ERROR:
            draft.isRenamingScreen = false;
            break;
        case SAVE_SCREEN: {
            const { id } = action;
            const screen = draft.screens.find(obj => obj.id === id);

            screen.isEditMode = false;
            screen.isRenaming = false;
            screen.isUpdating = false;
            draft.isError = false;

            break;
        }
        case ENTERING_EDIT_SCREEN_MODE:
            draft.isProcessingEditMode = true;
            break;
        case REJECTING_EDIT_SCREEN_MODE:
            draft.isProcessingEditMode = false;
            break;
        case ENTER_SCREEN_EDIT_MODE: {
            const { id } = action;
            const screen = draft.screens.find(obj => obj.id === id);

            screen.isEditMode = true;
            draft.isError = false;
            draft.isProcessingEditMode = false;

            break;
        }
        case EXIT_SCREEN_EDIT_MODE: {
            const { id } = action;

            const screen = draft.screens.find(obj => obj.id === id);

            screen.isEditMode = false;
            draft.isError = false;

            break;
        }
        case CREATE_NEW_SCREEN: {
            const updatedScreens = draft.screens.map(screen => {
                return { ...screen, isActive: false, isEditMode: false };
            });

            updatedScreens.push({
                ...action.screen,
                isActive               : true,
                isEditMode             : true,
                isParentControlEnabled : true,
                fetched                : true
            });

            draft.screens = updatedScreens;
            draft.isCreating = false;
            draft.isError = false;

            break;
        }
        case CREATE_NEW_SCREEN_REJECTED:
            draft.isCreating = false;
            break;
        case SELECT_SCREEN: {
            const { id } = action;

            draft.screens = draft.screens.map(screen => {
                if (screen.id === id) {
                    return {
                        ...screen,
                        isActive : true
                    };
                }

                return {
                    ...screen,
                    isActive   : false,
                    isEditMode : false
                };
            });

            break;
        }
        case DELETE_SCREEN: {
            const idx = draft.screens.findIndex(({ id }) => id === action.id);

            delete draft.screens[idx];

            const filteredScreens = draft.screens.filter(el => el);

            draft.isDeleting = false;
            draft.isError = false;
            draft.screens = filteredScreens.map((screen, key) => {
                if (key === 0) {
                    return {
                        ...screen,
                        isActive : true
                    };
                }

                return {
                    ...screen,
                    isActive : false
                };
            });
            break;
        }
        case START_RENAMING_SCREEN: {
            const { id } = action;
            const screen = draft.screens.find(obj => obj.id === id);

            screen.isRenaming = true;

            break;
        }
        case FINISH_RENAMING_SCREEN: {
            const { id } = action;
            const screen = draft.screens.find(obj => obj.id === id);

            screen.isRenaming = false;

            break;
        }
        case START_FETCHING_SCREEN: {
            const { id } = action;
            const screen = draft.screens.find(obj => obj.id === id);

            screen.isUpdating = true;
            break;
        }
        case ERROR_FETCHING_SCREEN: {
            const { id } = action;
            const screen = draft.screens.find(obj => obj.id === id);

            screen.isUpdating = false;
            draft.isError = true;
            break;
        }
        case CREATING_NEW_SCREEN:
            draft.isCreating = true;
            break;
        case DELETING_SCREEN:
            draft.isDeleting = true;
            break;
        case ERROR_FETCHING_CREATE:
        case ERROR_FETCHING_DELETE:
            draft.isDeleting = false;
            draft.isError = true;
            break;
        // case FINISH_FETCHING_SCREEN:
        //     draft.isError = false;
        //     break;
        case UPDATE_SCREEN_REQUEST:
            draft.isParentControlUpdating = true;
            break;
        case UPDATE_SCREEN_SUCCESS: {
            const { id, value } = action;
            const screen = draft.screens.find(item => item.id === id);

            screen.isParentControlEnabled = value;
            draft.isParentControlUpdating = false;
            break;
        }
        case UPDATE_SCREEN_FAILURE:
            draft.isParentControlUpdating = false;
            break;
        case UPDATE_SCREEN_REJECTED: {
            const { id } = action;
            const screen = draft.screens.find(item => item.id === id);

            screen.isUpdating = false;
            break;
        }
        case HIDE_SCREENS_PROTECTED_DATA: {
            const { isClientPanelAccessGranted, isSecureModeEnabled  } = action;

            if (!isClientPanelAccessGranted && isSecureModeEnabled) {
                draft.screens = draft.screens.map(screen => {
                    if (screen.isParentControlEnabled) {
                        return  { ...screen, widgets: [], layout: {} };
                    }

                    return screen;
                });
            }
            break;
        }
        case REMOVE_CLIENT_PANEL_ACCESS: {
            for (const screen of draft.screens) {
                if (screen.isParentControlEnabled) {
                    screen.widgets = [];
                    screen.fetched = false;
                }
            }
            break;
        }
        default:
            break;
    }
}, initialState);
