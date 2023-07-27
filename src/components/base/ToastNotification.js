import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import * as applicationInterfaceActions from '../../actions/interface';

import styles from './ToastNotification.less';

class ToastNotification extends PureComponent {
    render() {
        return (
            <ToastContainer
                autoClose={false}
                closeOnClick={false}
                className={styles.toastContainer}
                toastClassName={styles.toast}
                bodyClassName={styles.body}
                position='top-right'
                hideProgressBar
                newestOnTop
                closeButton={false}
                rtl={false}
                pauseOnVisibilityChange
                draggable={false}
            />
        );
    }
}

export default connect(state => ({
    lastToast : state.applicationInterface.lastToast
}), { ...applicationInterfaceActions })(ToastNotification);
