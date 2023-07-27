import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

import styles from './NotificationSingleValue.less';

class NotificationSingleValue extends PureComponent {
    render() {
        const { label, type } = this.props.data;

        return (
            <components.SingleValue {...this.props}>
                <div className={styles.TopicSingleValue}>
                    <span>{label}</span>
                    { type
                        ? (
                            <span
                                style={{
                                    color         : 'var(--primary_text_color)',
                                    fontSize      : '12px',
                                    textTransform : 'capitalize',
                                    opacity       : '0.7'
                                }}
                            >{` — ${type}`}</span>
                        ) : null
                    }
                </div>
            </components.SingleValue >
        );
    }
}

NotificationSingleValue.propTypes = {
    data : PropTypes.object
};

NotificationSingleValue.defaultProps = {
    data : {
        type  : '',
        label : ''
    }
};

export default NotificationSingleValue;
