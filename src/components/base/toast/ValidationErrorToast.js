import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import styles from './ToastContent.less';

class ValidationErrorToast extends PureComponent {
    render() {
        const { title, message, deviceName } = this.props;

        return (
            <Fragment>
                <h1 className={styles.deviceName}>{deviceName}</h1>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>
            </Fragment>
        );
    }
}

ValidationErrorToast.propTypes = {
    deviceName : PropTypes.string,
    title      : PropTypes.string.isRequired,
    message    : PropTypes.string.isRequired
};

ValidationErrorToast.defaultProps = {
    deviceName : ''
};

export default ValidationErrorToast;
