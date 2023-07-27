import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorMessage.less';

class ErrorMessage extends PureComponent {
    render() {
        const { message } = this.props;

        return (
            <span className={styles.ErrorMessage}>{message}</span>
        );
    }
}

ErrorMessage.propTypes = {
    message : PropTypes.string
};

ErrorMessage.defaultProps = {
    message : ''
};

export default ErrorMessage;
