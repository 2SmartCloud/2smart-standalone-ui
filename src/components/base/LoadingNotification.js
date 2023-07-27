import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './LoadingNotification.less';

class LoadingNotification extends PureComponent {
    render() {
        return (
            <div className={styles.LoadingNotification}>
                <p className={styles.loadingMessage}>{this.props.text}</p>
                <div className={styles.loadingIndicator} />
            </div>
        );
    }
}

LoadingNotification.propTypes = {
    text : PropTypes.string.isRequired
};

export default LoadingNotification;
