import React                             from 'react';
import { toast }                         from 'react-toastify';
import classnames                        from 'classnames/bind';
import { dispatchHideToastNotification } from '../../../actions/interface';
import styles                            from '../ToastNotification.less';
import ToastContent                      from './ToastContent';
import ValidationErrorToast              from './ValidationErrorToast';
import toastsMeta                        from './meta';

const cn = classnames.bind(styles);
const successToastCN = cn('toast', 'success');

const successMetas = [
    toastsMeta.UPDATE_OPTION,
    toastsMeta.CHANGE_PIN,
    toastsMeta.SEND_NOTIFICATION_CHANNEL_SUCCESS,
    toastsMeta.BACKUP_RESTORE_SUCCESS,
    toastsMeta.SYSTEM_UPDATES_EXISTS,
    toastsMeta.SYSTEM_UPDATES_DOWNLOAD_SUCCESS,
    toastsMeta.SYSTEM_UPDATES_CHECK_SUCCESS,
    toastsMeta.BACKUP_CREATE_SUCCESS,
    toastsMeta.EXTENSION_EVENT,
    toastsMeta.MARKET_EVENT
];

export function callToast({
    title, message, meta, deviceName, isInfinite,
    hidePrevious, controls, toastOptions = {}
}) {
    const options = { ...toastOptions };
    const toastContentProps = {
        controls
    };

    if (hidePrevious) hideToast(meta?.type);

    if (successMetas.includes(meta) || successMetas.includes(meta?.type)) {
        options.className = successToastCN;
        if (!isInfinite) options.autoClose = toastOptions.autoClose || 5000;
        options.closeOnClick = true;
        toastContentProps.withReload = false;
    }

    const toastId = toast(
        <ToastContent
            title={title} message={message} meta={meta}
            deviceName={deviceName}
            {...toastContentProps}
        />, { ...options,  onClose: () => dispatchHideToastNotification(meta) }
    );

    return toastId;
}

export function callValErr({ title, message, deviceName }) {
    const toastId = toast(
        <ValidationErrorToast title={title} deviceName={deviceName} message={message} />,
        { autoClose: 5000, closeOnClick: true }
    );

    return toastId;
}

export function hideToast(id) {
    toast.dismiss(id);
}
