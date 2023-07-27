import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

import styles from './CitySingleValue.less';

class CitySingleValue extends PureComponent {
    render() {
        const { label, country } = this.props.data;

        return (
            <components.SingleValue {...this.props}>
                <div className={styles.TopicSingleValue}>
                    <span className={styles.name}>{label}</span>
                    <span
                        style={{
                            color    : 'var(--primary_text_color)',
                            fontSize : '12px',
                            opacity  : '0.7'
                        }}
                    >{` — ${country}`}</span>
                </div>
            </components.SingleValue >
        );
    }
}

CitySingleValue.propTypes = {
    data : PropTypes.object
};

CitySingleValue.defaultProps = {
    data : {
        label   : '',
        country : ''
    }
};

export default CitySingleValue;
