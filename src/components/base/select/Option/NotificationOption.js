import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseOption from './BaseOption';

import styles from './NotificationOption.less';

class NotificationOption extends PureComponent {
    render() {
        const { label, type } = this.props.data;

        return (
            <BaseOption {...this.props}>
                <div className={styles.NotificationOption}>
                    <span>{label}</span>
                    { type
                        ? (
                            <span
                                className={styles.label}
                                style={{
                                    textTransform : 'capitalize'
                                }}
                            >{` — ${type}`}</span>
                        ) : null
                    }
                </div>
            </BaseOption>
        );
    }
}

NotificationOption.propTypes = {
    data : PropTypes.object
};

NotificationOption.defaultProps = {
    data : {
        label : '',
        type  : ''
    }
};

export default NotificationOption;
