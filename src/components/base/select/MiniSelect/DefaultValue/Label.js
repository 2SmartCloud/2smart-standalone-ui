import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseDefaultValue from './Base';
import styles from './Label.less';

class LabelDefaultValue extends PureComponent {
    render() {
        const { defaultValue : { label } } = this.props;

        return (
            <BaseDefaultValue {...this.props}>
                <div className={styles.LabelDefaultValue}>{label}</div>
            </BaseDefaultValue>
        );
    }
}

LabelDefaultValue.propTypes = {
    defaultValue : PropTypes.object.isRequired
};

export default LabelDefaultValue;
