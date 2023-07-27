import {
    CALL_TOAST_NOTIFICATION,
    HIDE_TOAST_NOTIFICATION,
    OPEN_MODAL,
    CLOSE_MODAL,
    SHOW_PIN_FORM,
    HIDE_PIN_FORM,
    SHOW_DELETE_MODAL,
    HIDE_DELETE_MODAL,
    OPEN_POPUP,
    CLOSE_POPUP,
    CLOSE_ALL_POPUPS,
    SET_GROUPS_VISIBILITY,
    TOGGLE_ADMIN_SIDEBAR,
    SET_DEVICES_ORDER
} from '../actions/interface';
import { getData } from '../utils/localStorage';
import { isMobileDevice } from '../utils/detect';

import {
    DEVICES_SORT_ORDER,
    SHOW_NODES_AND_DEVICES_GROUPS
} from '../assets/constants/localStorage';


const isGroupsVisible = getData(SHOW_NODES_AND_DEVICES_GROUPS);

const initialState = {
    activeToasts : [],
    openedPopups : [  ],
    popupClasses : {},
    popupParams  : {
        propertyId   : null,
        nodeId       : null,
        deviceId     : null,
        propertyType : '',
        hardwareType : ''
    },
    lastToastMeta : '',
    modal         : {
        isOpen : false
    },
    pinForm : {
        isOpen : false,
        props  : {}
    },
    deleteModal : {
        isOpen : false
    },
    isGroupsVisible : typeof isGroupsVisible === 'boolean'  // should be true as default if user do not set this var
        ? isGroupsVisible
        : true,
    isAdminSideBarOpen : !isMobileDevice(),
    devicesSortOrder   : getData(DEVICES_SORT_ORDER) || 'ASC'
};

export default function (state = initialState, action) {
    const { type, payload = {} } = action;

    switch (type) {
        case TOGGLE_ADMIN_SIDEBAR: {
            return {
                ...state,
                isAdminSideBarOpen : !state.isAdminSideBarOpen
            };
        }
        case OPEN_POPUP: {
            const { popupClasses, popupParams } = action;

            return {
                ...state,
                openedPopups : [ ...state.openedPopups, action.id ],
                popupClasses : popupClasses ? { ...popupClasses } : state.popupClasses,
                popupParams  : popupParams ? { ...popupParams } : state.popupParams
            };
        }
        case CLOSE_POPUP: {
            return {
                ...state,
                openedPopups : [ ...state.openedPopups.slice(0, -1) ]
            };
        }
        case CLOSE_ALL_POPUPS: {
            return {
                ...state,
                openedPopups : [],
                popupParams  : {  propertyId : null,
                    nodeId     : null,
                    deviceId   : null },
                popupStyles : {}
            };
        }
        case OPEN_MODAL: {
            return {
                ...state,
                modal : {
                    ...state.modal,
                    isOpen : true
                }
            };
        }
        case CLOSE_MODAL: {
            return {
                ...state,
                modal : {
                    ...state.modal,
                    isOpen : false
                }
            };
        }
        case CALL_TOAST_NOTIFICATION: {
            const { meta } = action.payload;

            const toast = {
                title      : action.payload.title,
                message    : action.payload.message,
                id         : action.payload.id,
                deviceName : action.payload.deviceName,
                meta
            };

            const activeToasts = state.activeToasts;

            activeToasts.push(toast);

            return {
                ...state,
                activeToasts,
                lastToastMeta : typeof meta === 'string' ? meta : state.lastToastMeta
            };
        }
        case HIDE_TOAST_NOTIFICATION: {
            const { meta } = action;
            const newActiveToasts = state.activeToasts.filter(({ meta: activeToastsMeta }) => {
                return activeToastsMeta !== meta;
            });
            const sysToasts = newActiveToasts.filter(({ meta: systemToast }) => typeof systemToast === 'string');
            const lastToast = sysToasts.length ? sysToasts[sysToasts.length - 1] : null;

            return {
                ...state,
                activeToasts  : newActiveToasts,
                lastToastMeta : lastToast ? lastToast.meta : ''
            };
        }
        case SHOW_PIN_FORM: {
            const { props = {} } = action;

            return {
                ...state,
                pinForm : {
                    isOpen : true,
                    props
                }
            };
        }
        case HIDE_PIN_FORM: {
            return {
                ...state,
                pinForm : {
                    isOpen : false,
                    props  : {}
                }
            };
        }
        case SHOW_DELETE_MODAL:
            return  {
                ...state,
                deleteModal : {
                    isOpen : true
                }
            };
        case HIDE_DELETE_MODAL:
            return {
                ...state,
                deleteModal : {
                    isOpen : false
                }
            };
        case SET_GROUPS_VISIBILITY:
            return {
                ...state,
                isGroupsVisible : payload.isGroupsVisible
            };
        case SET_DEVICES_ORDER:
            return {
                ...state,
                devicesSortOrder : payload.order
            };

        default:
            return state;
    }
}
