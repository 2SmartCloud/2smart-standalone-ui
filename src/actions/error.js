import store                from '../store';
import {
    callToastNotification,
    hideToastNotification
}                           from './interface';

export function handleErrorCode(code) {
    return dispatch => {
        const payload = {};

        switch (code) {
            case 'NETWORK_ERROR':
                payload.title = 'Fetching failed';
                payload.message = 'Can\'t connect to the resource';
                payload.meta = 'NETWORK_ERROR';

                break;
            default:
                break;
        }

        if (payload.title) dispatch(callToastNotification(payload));
    };
}

export function handleSuccessResponse() {
    return hideToastNotification('NETWORK_ERROR', 500);
}

export function dispatchHandleErrorCode(code) {
    store.dispatch(handleErrorCode(code));
}

export function dispatchHandleSuccessResponse() {
    store.dispatch(handleSuccessResponse());
}
