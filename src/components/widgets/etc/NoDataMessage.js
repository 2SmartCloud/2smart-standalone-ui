import React, { PureComponent } from 'react';
import styles from './NoDataMessage.less';

class NoDataMessage extends PureComponent {
    render() {
        return (
            <div className={styles.NoDataMessage}>
                <svg viewBox='0 0 192 28'>
                    <text x='0' y='22' className={styles.message}>No data to display</text>
                </svg>
            </div>
        );
    }
}

export default NoDataMessage;
