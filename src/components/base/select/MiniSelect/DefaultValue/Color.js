import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseDefaultValue from './Base';
import styles from './Color.less';

class ColorDefaultValue extends PureComponent {
    render() {
        const { defaultValue : { color } } = this.props;

        return (
            <BaseDefaultValue>
                <div className={styles.ColorDefaultValue} style={{ backgroundColor: color }} />
            </BaseDefaultValue>
        );
    }
}

ColorDefaultValue.propTypes = {
    defaultValue : PropTypes.object.isRequired
};

export default ColorDefaultValue;
