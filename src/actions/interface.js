import store from '../store';
import toastsMeta from '../components/base/toast/meta';
import { callToast, callValErr, hideToast } from '../components/base/toast/callToast';
import { saveData } from '../utils/localStorage';
import smartHome from '../smartHome/smartHomeSingleton';
import {
    DEVICES_SORT_ORDER,
    SHOW_NODES_AND_DEVICES_GROUPS
} from '../assets/constants/localStorage';

export const CALL_TOAST_NOTIFICATION = 'CALL_TOAST_NOTIFICATION';
export const HIDE_TOAST_NOTIFICATION = 'HIDE_TOAST_NOTIFICATION';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const SHOW_PIN_FORM = 'SHOW_PIN_FORM';
export const HIDE_PIN_FORM = 'HIDE_PIN_FORM';

export const SHOW_DELETE_MODAL = 'SHOW_DELETE_MODAL';
export const HIDE_DELETE_MODAL = 'HIDE_DELETE_MODAL';

export const OPEN_POPUP = 'OPEN_POPUP';
export const CLOSE_POPUP = 'CLOSE_POPUP';
export const CLOSE_ALL_POPUPS = 'CLOSE_ALL_POPUPS';

export const TOGGLE_ADMIN_SIDEBAR = 'TOGGLE_ADMIN_SIDEBAR';
export const SET_GROUPS_VISIBILITY = 'SET_GROUPS_VISIBILITY';
export const SET_DEVICES_ORDER = 'SET_DEVICES_ORDER';

export function handleToggleSidebar() {
    return  {
        type : TOGGLE_ADMIN_SIDEBAR
    };
}

export function openPopup({ id, position, popupParams }) {
    return  {
        type : OPEN_POPUP,
        id,
        position,
        popupParams
    };
}

export function closeAllPopups() {
    return {
        type : CLOSE_ALL_POPUPS
    };
}

export function closeLastPopup() {
    return {
        type : CLOSE_POPUP
    };
}


export function openModal() {
    return dispatch => {
        dispatch({
            type   : OPEN_MODAL,
            isOpen : true
        });
    };
}

export function closeModal() {
    return dispatch => {
        dispatch({
            type   : CLOSE_MODAL,
            isOpen : false
        });
    };
}

function getDeviceName(meta) {
    let deviceName;

    try {
        deviceName = smartHome.getDeviceById(meta.deviceId)?.name;
    } catch (err) {
        // pass
    }

    return deviceName || meta.deviceId || 'System';
}

export function callToastNotification({ meta, title, message }) {
    return (dispatch, getState) => {
        const state = getState();
        const { activeToasts } = state.applicationInterface;
        const currToasts = activeToasts.find(({ meta: activeToastMeta }) => activeToastMeta === meta);
        const deviceName = getDeviceName(meta);

        // ignore if error exists
        if (currToasts) return;

        const id = callToast({ title, message, meta, deviceName });

        dispatch({
            type    : CALL_TOAST_NOTIFICATION,
            payload : { title, message, meta, deviceName, id }
        });
    };
}

export function callValErrNotification({ meta, title, message }) {
    return dispatch => {
        const deviceName = getDeviceName(meta);

        const id = callValErr({ title, message, meta, deviceName });

        dispatch({
            type    : CALL_TOAST_NOTIFICATION,
            payload : { title, message, meta, deviceName, id }
        });
    };
}

// const BROKER_RESPONSE_TIMEOUT_META = 'BROKER_RESPONSE_TIMEOUT';

// export function callBrokerResponseTimeoutNotification() {
//     return dispatch => {
//         dispatch(callValErrNotification({
//             meta    : BROKER_RESPONSE_TIMEOUT_META,
//             title   : 'Network error',
//             message : 'Something went wrong. Please try again' }));
//     };
// }
//
// export function hideBrokerResponseTimeoutNotification() {
//     return dispatch => {
//         dispatch(hideValErrToastNotification({
//             meta : BROKER_RESPONSE_TIMEOUT_META
//         }));
//     };
// }

export function hideToastNotification(meta, timeout = 2000) {
    return (dispatch, getState) => {
        function hide() {
            const state = getState();
            const { activeToasts } = state.applicationInterface;
            const toastsToHide = activeToasts.filter(({ meta: activeToastMeta }) => activeToastMeta === meta);

            toastsToHide.forEach(({ id }) => hideToast(id));

            dispatch({
                type : HIDE_TOAST_NOTIFICATION,
                meta
            });
        }

        if (timeout === 0) {
            hide();
        } else {
            setTimeout(hide, timeout);
        }
    };
}

export function hideValErrToastNotification({ meta }) {
    return (dispatch, getState) => {
        const state = getState();
        const { activeToasts } = state.applicationInterface;
        const toastsToHide = activeToasts
            .filter(({ meta: activeToastMeta }) => JSON.stringify(activeToastMeta) === JSON.stringify(meta));

        toastsToHide.forEach(({ id }) => hideToast(id));

        dispatch({
            type : HIDE_TOAST_NOTIFICATION,
            meta
        });
    };
}

export function showPinForm(props) {
    return (dispatch, getState) => {
        const state = getState();
        const isClientPanelAccessGranted = state.user.isClientPanelAccessGranted;
        const isOpen = state.applicationInterface.pinForm.isOpen;
        const isDeleteOpen = state.applicationInterface.deleteModal.isOpen;

        if (isClientPanelAccessGranted) return;
        if (isOpen) dispatch(hidePinForm());
        if (isDeleteOpen) dispatch(hideDeleteModal());

        dispatch({ type: SHOW_PIN_FORM, props });
    };
}

export function hidePinForm() {
    return (dispatch, getState) => {
        const { reject } = getState().applicationInterface.pinForm.props;

        if (typeof reject === 'function') reject();

        dispatch({ type: HIDE_PIN_FORM });
    };
}

export function decoratedHideValErrToastNotification(meta) {
    store.dispatch(hideValErrToastNotification({ meta }));
}

export function decoratedCallToastNotification() {
    store.dispatch(callToastNotification({
        meta    : toastsMeta.BROKER_ON_OFFLINE,
        title   : 'Something went wrong',
        message : 'An error occured while trying to connect to broker'
    }));
}

export function decoratedHideToastNotification() {
    store.dispatch(hideToastNotification(toastsMeta.BROKER_ON_OFFLINE));
}

export function dispatchHideToastNotification(meta, timeout = 0) {
    store.dispatch(hideToastNotification(meta, timeout));
}

export function showDeleteModal() {
    return { type: SHOW_DELETE_MODAL };
}

export function hideDeleteModal() {
    return { type: HIDE_DELETE_MODAL };
}

export function setGroupsVisibility(isGroupsVisible) {
    saveData(SHOW_NODES_AND_DEVICES_GROUPS, isGroupsVisible);

    return {
        type    : SET_GROUPS_VISIBILITY,
        payload : {
            isGroupsVisible
        }
    };
}

export function setDevicesOrder(order) {
    saveData(DEVICES_SORT_ORDER, order);

    return {
        type    : SET_DEVICES_ORDER,
        payload : { order }
    };
}
